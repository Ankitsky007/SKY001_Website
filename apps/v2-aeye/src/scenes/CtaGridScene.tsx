// Lazy chunk: shares three.js / React Three Fiber with the hero grid scene.
import { useFrame } from '@react-three/fiber'
import { WebGLStage } from '@skyfall/core/webgl'
import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { Vector2, Vector3, Vector4, type ShaderMaterial } from 'three'
import { CYCLE, now, type PointerState } from './heroGrid'

const VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// One full-screen quad drawing the same dark pixel grid as the CSS `grid-dark` band it replaces
// (cells counted from the top-left, in CSS px). SKY-001's card is the source: the hero's 6s pulse
// leaves the card's edge, and rollouts run outward along single rows and columns, the model
// playing futures forward. Pointer trail and click ripples match the hero grid.
const FRAG = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform vec4 uCard;
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
  float h = cellHash(c);
  if (d < 1.5) return h < 0.55 ? 0.3 : 0.0;
  if (d < 3.5) return h < 0.3 ? 0.18 : 0.0;
  if (d < 7.0) return h < 0.18 ? 0.09 : 0.0;
  return 0.0;
}

float envelope(float x) {
  if (x < 0.0) return 0.0;
  return x < 0.7 ? smoothstep(0.0, 0.7, x) : 1.0 - smoothstep(0.7, 2.6, x);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr, uRes.y - gl_FragCoord.y / uDpr);
  vec2 c = floor(p / uCell);
  vec2 l = p - c * uCell;

  // Distance from this cell to the card, in cells (0 under the card).
  vec2 a = floor(uCard.xy / uCell);
  vec2 b = floor((uCard.zw - 1.0) / uCell);
  vec2 dv = max(max(a - c, c - b), 0.0);
  float d = length(dv);

  float t = mod(uTime, CYCLE);
  float I = restLevel(c, d) * (0.35 + 0.65 * envelope(t - d * 0.16));

  // The pulse front leaving the card.
  I += 0.14 * exp(-pow((d - t * 5.0) / 0.7, 2.0)) * exp(-d * 0.05);

  // Rollouts: a head with a fading tail runs straight out from the card along some rows and columns.
  bool row = dv.y == 0.0 && dv.x > 0.0;
  bool col = dv.x == 0.0 && dv.y > 0.0;
  if (row || col) {
    float id = row ? c.y : c.x;
    float side = row ? (c.x < a.x ? 0.0 : 1.0) : (c.y < a.y ? 2.0 : 3.0);
    float k = row ? dv.x : dv.y;
    float h = cellHash(vec2(id, 3.0 + side * 5.0));
    if (h > 0.45) {
      float head = mod(uTime + h * 23.0, 4.0 + h * 3.0) * 8.0;
      if (k <= head) I = max(I, 0.75 * exp(-(head - k) * 0.35) * (1.0 - smoothstep(10.0, 22.0, head)));
    }
  }

  // Cells under the card stay dark, so nothing shows through while the card reveals.
  if (d < 0.5) I = 0.0;

  // Sparse ambient twinkle.
  float h2 = cellHash(c + vec2(17.0, 5.0));
  if (h2 > 0.94) I += 0.06 * (0.5 + 0.5 * sin(uTime * 1.3 + h2 * 40.0));

  for (int i = 0; i < 8; i++) {
    vec3 tr = uTrail[i];
    if (c.x == tr.x && c.y == tr.y) I = max(I, 0.6 * exp(-(uTime - tr.z) * 2.0));
  }
  float ct = uTime - uClick.z;
  if (ct >= 0.0 && ct < 3.0) {
    float dc = length(c - uClick.xy);
    I += 0.55 * exp(-pow((dc - ct * 7.0) / 0.8, 2.0)) * (1.0 - ct / 3.0);
  }

  vec3 col3 = mix(BG, BRAND, clamp(I, 0.0, 1.0));
  if (l.x >= uCell - 1.0 || l.y >= uCell - 1.0) col3 = LINE;
  gl_FragColor = vec4(col3, 1.0);
}
`

type SceneProps = {
  /** Cell size in CSS px (matches `grid-dark`). */
  cell: number
  /** Card rectangle inside the band, CSS px: [left, top, right, bottom]. */
  card: RefObject<[number, number, number, number]>
  pointer: RefObject<PointerState>
  onReady: () => void
}

function GridPlane({ cell, card, pointer, onReady }: SceneProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uDpr: { value: 1 },
      uCell: { value: 48 },
      uCard: { value: new Vector4() },
      uTrail: { value: Array.from({ length: 8 }, () => new Vector3(0, 0, -100)) },
      uClick: { value: new Vector3(0, 0, -100) },
    }),
    [],
  )

  const material = useRef<ShaderMaterial>(null)
  const ready = useRef(false)

  useFrame(({ size, gl }) => {
    const uni = material.current?.uniforms
    const ptr = pointer.current
    if (!uni) return
    uni.uTime.value = now()
    uni.uCell.value = cell
    uni.uCard.value.fromArray(card.current)
    uni.uRes.value.set(size.width, size.height)
    uni.uDpr.value = gl.getPixelRatio()
    for (let i = 0; i < 8; i++) uni.uTrail.value[i].fromArray(ptr.trail, i * 3)
    uni.uClick.value.fromArray(ptr.click)

    if (!ready.current) {
      ready.current = true
      requestAnimationFrame(onReady)
    }
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

export default function CtaGridScene({ className, fallback, ...props }: SceneProps & { className?: string; fallback: ReactNode }) {
  return (
    <WebGLStage className={className} fallback={fallback} dpr={[1, 1.5]} flat gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}>
      <GridPlane {...props} />
    </WebGLStage>
  )
}
