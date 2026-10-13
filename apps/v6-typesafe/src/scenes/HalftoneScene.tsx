// Lazy chunk: three.js / React Three Fiber load only when a field is about to be shown.
import { useFrame, useThree } from '@react-three/fiber'
import { WebGLStage } from '@skyfall/core/webgl'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Vector2, Vector3, type ShaderMaterial } from 'three'
import { FIELD_DOT, type FieldTone } from './halftone'

const VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// One full-screen quad with five looks, chosen by `uMode`. All of them drift with slow noise and
// react to the pointer. `uFade` is the direction the field dissolves in (0 = none, 1 = towards the
// bottom, -1 = towards the top).
//   0 dots      halftone dots whose size follows the noise
//   1 contours  thin topographic lines that bend around the pointer
//   2 cells     a blueprint grid whose cells light up and trail the pointer
//   3 floor     a perspective floor grid rolling towards the viewer
//   4 dither    ordered-dither clouds in chunky pixels
const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform vec3 uDot;
uniform vec3 uPointer;
uniform float uFade;
uniform int uMode;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}
float bayer4(vec2 c) {
  vec2 m = mod(c, 4.0);
  float i = m.x + m.y * 4.0;
  float v = 0.0;
  if (i < 0.5) v = 0.0; else if (i < 1.5) v = 8.0; else if (i < 2.5) v = 2.0; else if (i < 3.5) v = 10.0;
  else if (i < 4.5) v = 12.0; else if (i < 5.5) v = 4.0; else if (i < 6.5) v = 14.0; else if (i < 7.5) v = 6.0;
  else if (i < 8.5) v = 3.0; else if (i < 9.5) v = 11.0; else if (i < 10.5) v = 1.0; else if (i < 11.5) v = 9.0;
  else if (i < 12.5) v = 15.0; else if (i < 13.5) v = 7.0; else if (i < 14.5) v = 13.0; else v = 5.0;
  return (v + 0.5) / 16.0;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr, uRes.y - gl_FragCoord.y / uDpr);
  float span = max(uRes.x, 900.0);
  float t = uTime * 0.045;
  float y = p.y / uRes.y;
  float fade = 1.0;
  if (uFade > 0.5) fade = 1.0 - smoothstep(0.25, 1.0, y);
  if (uFade < -0.5) fade = smoothstep(0.0, 0.75, y);
  float lens = uPointer.z * (1.0 - smoothstep(0.0, 170.0, distance(p, uPointer.xy)));
  float a = 0.0;

  if (uMode == 0) {
    vec2 c = floor(p / uCell);
    vec2 l = (p - c * uCell) / uCell - 0.5;
    vec2 q = (c * uCell) / span;
    float n = fbm(q * 3.2 + vec2(t, -t * 0.6)) * 0.62 + fbm(q * 1.3 - vec2(t * 0.5, t)) * 0.5;
    float level = max(smoothstep(0.42, 0.86, n) * fade, lens * 0.9);
    float r = 0.5 * sqrt(level) * 0.92;
    a = r < 0.03 ? 0.0 : (1.0 - smoothstep(r - 0.06, r + 0.06, length(l))) * 0.85;
  } else if (uMode == 1) {
    vec2 q = p / span;
    float n = fbm(q * 2.1 + vec2(t * 0.8, -t * 0.5)) + 0.35 * fbm(q * 0.9 - vec2(t * 0.3, t * 0.4)) + lens * 0.16;
    float v = n * 15.0;
    float w = fwidth(v);
    float line = 1.0 - smoothstep(0.0, 1.3, abs(fract(v) - 0.5) / w);
    float bold = 1.0 - smoothstep(0.0, 1.6, abs(fract(v / 5.0) - 0.5) / (w / 5.0));
    a = (line * 0.6 + bold * 0.7) * fade + line * lens * 0.4;
  } else if (uMode == 2) {
    float size = uCell * 4.0;
    vec2 c = floor(p / size);
    vec2 l = p - c * size;
    float edge = (1.0 - step(1.0, min(l.x, l.y))) * 0.22;
    float beat = floor(uTime * 1.2 + hash(c) * 9.0);
    float h = hash(c + beat * 0.137);
    float n = fbm(c * 0.09 + vec2(t, -t));
    float lit = step(0.9 - n * 0.22, h) * (0.25 + 0.55 * fract(h * 7.0));
    float trail = 1.0 - smoothstep(0.0, size * 2.6, distance((c + 0.5) * size, uPointer.xy));
    lit = max(lit, uPointer.z * trail * 0.8);
    float inset = step(2.0, l.x) * step(2.0, l.y);
    a = (edge + lit * inset) * fade;
  } else if (uMode == 3) {
    float horizon = uFade < -0.5 ? 0.05 : 0.0;
    float yy = uFade > 0.5 ? 1.0 - y : y;
    float depth = 1.0 / max(yy - horizon + 0.04, 0.04);
    vec2 g = vec2((p.x / uRes.x - 0.5) * depth * 5.0 + lens * 0.3, depth * 1.4 + uTime * 0.12);
    g.y += 0.18 * sin(g.x * 1.7 + uTime * 0.4);
    vec2 w = fwidth(g);
    vec2 d = abs(fract(g) - 0.5) / w;
    float line = 1.0 - smoothstep(0.0, 1.4, min(d.x, d.y));
    float near = smoothstep(0.02, 0.5, yy);
    a = line * (0.2 + 0.6 * near) * fade;
  } else {
    float px = 3.0;
    vec2 c = floor(p / px);
    vec2 q = (c * px) / span;
    float n = fbm(q * 2.6 + vec2(t, -t * 0.7)) * 0.7 + fbm(q * 1.1 - vec2(t * 0.4, t * 0.6)) * 0.45;
    float level = max(smoothstep(0.38, 0.95, n) * fade, lens * 0.75);
    a = step(bayer4(c), level) * 0.8;
  }

  gl_FragColor = vec4(uDot * a, a);
}
`

function Field({ tone, fade, cell, mode }: { tone: FieldTone; fade: number; cell: number; mode: number }) {
  const material = useRef<ShaderMaterial>(null)
  const { gl, size } = useThree()
  const pointer = useRef({ x: -9999, y: -9999, target: 0, value: 0 })
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uDpr: { value: 1 },
      uCell: { value: cell },
      uDot: { value: new Vector3(...FIELD_DOT[tone]) },
      uPointer: { value: new Vector3(-9999, -9999, 0) },
      uFade: { value: fade },
      uMode: { value: mode },
    }),
    [tone, fade, cell, mode],
  )

  // The canvas sits behind content with pointer-events off, so listen on the window.
  useEffect(() => {
    const el = gl.domElement
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      pointer.current.x = e.clientX - r.left
      pointer.current.y = e.clientY - r.top
      pointer.current.target = inside && e.pointerType === 'mouse' ? 1 : 0
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [gl])

  useFrame((state, delta) => {
    const m = material.current
    if (!m) return
    const p = pointer.current
    p.value += (p.target - p.value) * Math.min(1, delta * 6)
    m.uniforms.uTime.value = state.clock.elapsedTime
    m.uniforms.uRes.value.set(size.width, size.height)
    m.uniforms.uDpr.value = state.viewport.dpr
    m.uniforms.uPointer.value.set(p.x, p.y, p.value)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthTest={false} />
    </mesh>
  )
}

export default function HalftoneScene({ tone, fade, cell, mode, fallback, className }: { tone: FieldTone; fade: number; cell: number; mode: number; fallback: ReactNode; className?: string }) {
  return (
    <WebGLStage fallback={fallback} className={className} gl={{ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Field tone={tone} fade={fade} cell={cell} mode={mode} />
    </WebGLStage>
  )
}
