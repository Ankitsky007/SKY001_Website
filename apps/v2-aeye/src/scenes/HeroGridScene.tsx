// Lazy chunk: the only module that pulls in three.js / React Three Fiber.
import { useFrame } from '@react-three/fiber'
import { WebGLStage } from '@skyfall/core/webgl'
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { Vector2, Vector3, type ShaderMaterial } from 'three'
import { CYCLE, LABEL_HOLD, labelStart, now, ROUTE_TIME, type GridLayout, type PointerState } from './heroGrid'

const VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// One full-screen quad. Every pixel works out which grid cell it is in (counted from the right
// edge, in CSS px, so cells stay crisp at any device pixel ratio) and how lit that cell is:
// resting rings around the decision cell, the 6s pulse travelling outward, a route from the
// decision to each function in turn, the pointer trail and click ripples.
const FRAG = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform vec2 uOrigin;
uniform vec2 uTargets[6];
uniform vec3 uTrail[8];
uniform vec3 uClick;

const vec3 BG = vec3(0.1020);
const vec3 LINE = vec3(0.2392);
const vec3 BRAND = vec3(0.2431, 0.3412, 0.8549);
const float CYCLE = ${CYCLE.toFixed(1)};

float cellHash(vec2 c) {
  float n = c.x * 37.0 + c.y * 113.0 + c.x * c.x * 7.0 + c.y * c.y * 13.0;
  return mod(n * 97.0, 101.0) / 101.0;
}

float restLevel(vec2 c, float d) {
  if (d < 0.5) return 1.0;
  if (d < 1.5) return 0.6;
  float h = cellHash(c);
  if (d < 3.4) return h < 0.5 ? 0.34 : 0.0;
  if (d < 5.0) return h < 0.32 ? 0.18 : 0.0;
  if (d < 7.6) return h < 0.22 ? 0.09 : 0.0;
  return 0.0;
}

// Storyboard pulse: up to full over 0.7s, back to 35% by 2.6s.
float envelope(float x) {
  if (x < 0.0) return 0.0;
  return x < 0.7 ? smoothstep(0.0, 0.7, x) : 1.0 - smoothstep(0.7, 2.6, x);
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  vec2 q = vec2(uRes.x - p.x, uRes.y - p.y);
  vec2 c = floor(q / uCell);
  vec2 l = q - c * uCell;

  float t = mod(uTime, CYCLE);
  float d = length(c - uOrigin);
  float level = restLevel(c, d);

  float route = 0.0;
  float arrive = 0.0;
  vec2 rel = c - uOrigin;
  for (int i = 0; i < 6; i++) {
    vec2 tg = uTargets[i];
    bool isTarget = c.x == tg.x && c.y == tg.y;
    if (isTarget) level = max(level, 0.34);
    float dt = t - (1.2 + float(i) * 0.65);
    if (dt < 0.0 || dt > 2.2) continue;
    vec2 dd = tg - uOrigin;
    float len = abs(dd.x) + abs(dd.y);
    float k = -1.0;
    if (rel.y == 0.0 && rel.x != 0.0 && sign(rel.x) == sign(dd.x) && abs(rel.x) <= abs(dd.x)) {
      k = abs(rel.x);
    } else if (c.x == tg.x && rel.y != 0.0 && sign(rel.y) == sign(dd.y) && abs(rel.y) <= abs(dd.y)) {
      k = abs(dd.x) + abs(rel.y);
    }
    if (k > 0.0) {
      float head = dt / ${ROUTE_TIME.toFixed(2)} * len;
      if (k <= head + 0.001) route = max(route, 0.8 * exp(-(head - k) * 0.3) * (1.0 - smoothstep(0.45, 1.5, dt)));
    }
    if (isTarget && dt >= ${ROUTE_TIME.toFixed(2)}) arrive = max(arrive, exp(-(dt - ${ROUTE_TIME.toFixed(2)}) * 1.5));
  }

  float pulse = 0.35 + 0.65 * envelope(t - d * 0.16);
  if (d < 0.5) pulse = max(pulse, 0.75);
  float I = level * pulse;

  // The ripple front crossing the whole band.
  I += 0.14 * exp(-pow((d - t * 5.0) / 0.7, 2.0)) * exp(-d * 0.05);
  I = max(I, route);
  I = max(I, arrive);

  // Sparse ambient twinkle so the far side of the band breathes.
  float h2 = cellHash(c + vec2(17.0, 5.0));
  if (h2 > 0.94) I += 0.06 * (0.5 + 0.5 * sin(uTime * 1.3 + h2 * 40.0));

  // Pointer trail (aeye's hover trail) and click ripples.
  for (int i = 0; i < 8; i++) {
    vec3 tr = uTrail[i];
    if (c.x == tr.x && c.y == tr.y) I = max(I, 0.6 * exp(-(uTime - tr.z) * 2.0));
  }
  float ct = uTime - uClick.z;
  if (ct >= 0.0 && ct < 3.0) {
    float dc = length(c - uClick.xy);
    I += 0.55 * exp(-pow((dc - ct * 7.0) / 0.8, 2.0)) * (1.0 - ct / 3.0);
  }

  vec3 col = mix(BG, BRAND, clamp(I, 0.0, 1.0));
  if (l.x > uCell - 1.0 || l.y < 1.0) col = LINE;
  gl_FragColor = vec4(col, 1.0);
}
`

type SceneProps = {
  layout: GridLayout
  labels: RefObject<(HTMLElement | null)[]>
  pointer: RefObject<PointerState>
  onReady: () => void
}

function GridPlane({ layout, labels, pointer, onReady }: SceneProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uDpr: { value: 1 },
      uCell: { value: 48 },
      uOrigin: { value: new Vector2() },
      uTargets: { value: Array.from({ length: 6 }, () => new Vector2()) },
      uTrail: { value: Array.from({ length: 8 }, () => new Vector3(0, 0, -100)) },
      uClick: { value: new Vector3(0, 0, -100) },
    }),
    [],
  )

  // Uniforms are written through the material (three's own object) every frame.
  const material = useRef<ShaderMaterial>(null)
  const lit = useRef<boolean[]>([])
  const ready = useRef(false)

  useFrame(({ size, gl }) => {
    const uni = material.current?.uniforms
    const ptr = pointer.current
    if (!uni) return
    const t = now()
    uni.uTime.value = t
    uni.uCell.value = layout.cell
    uni.uOrigin.value.set(layout.origin[0], layout.origin[1])
    layout.targets.forEach(([rc, r], i) => uni.uTargets.value[i].set(rc, r))
    uni.uRes.value.set(size.width, size.height)
    uni.uDpr.value = gl.getPixelRatio()
    for (let i = 0; i < 8; i++) uni.uTrail.value[i].fromArray(ptr.trail, i * 3)
    uni.uClick.value.fromArray(ptr.click)

    // Light the DOM labels in step with the routes the shader draws.
    const phase = t % CYCLE
    labels.current?.forEach((el, i) => {
      const dt = phase - labelStart(i) - ROUTE_TIME
      const on = dt >= 0 && dt < LABEL_HOLD
      if (lit.current[i] !== on) {
        lit.current[i] = on
        el?.toggleAttribute('data-lit', on)
      }
    })

    if (!ready.current) {
      ready.current = true
      requestAnimationFrame(onReady)
    }
  })

  useEffect(
    () => () => {
      labels.current?.forEach((el) => el?.removeAttribute('data-lit'))
    },
    [labels],
  )

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

export default function HeroGridScene({ className, fallback, ...props }: SceneProps & { className?: string; fallback: ReactNode }) {
  return (
    <WebGLStage className={className} fallback={fallback} dpr={[1, 1.5]} flat gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}>
      <GridPlane {...props} />
    </WebGLStage>
  )
}
