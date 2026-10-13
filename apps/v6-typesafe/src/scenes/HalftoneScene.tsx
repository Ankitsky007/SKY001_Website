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

// One full-screen quad. Slow noise drifts across a grid of cells and sets each dot's radius, the
// way TypeSafe's dithered clouds read, and the dots swell under the pointer. `uFade` is the
// direction the field dissolves in (0 = none, 1 = towards the bottom, -1 = towards the top).
const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform vec3 uDot;
uniform vec3 uPointer;
uniform float uFade;

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

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr, uRes.y - gl_FragCoord.y / uDpr);
  vec2 c = floor(p / uCell);
  vec2 l = (p - c * uCell) / uCell - 0.5;
  vec2 q = (c * uCell) / max(uRes.x, 900.0);

  float t = uTime * 0.045;
  float n = fbm(q * 3.2 + vec2(t, -t * 0.6)) * 0.62 + fbm(q * 1.3 - vec2(t * 0.5, t)) * 0.5;
  float level = smoothstep(0.42, 0.86, n);

  // Dissolve towards one edge so the field hands over to the page.
  float y = p.y / uRes.y;
  if (uFade > 0.5) level *= 1.0 - smoothstep(0.25, 1.0, y);
  if (uFade < -0.5) level *= smoothstep(0.0, 0.75, y);

  // Pointer: a soft lens that grows the dots it passes over.
  float d = distance(p, uPointer.xy);
  level = max(level, uPointer.z * (1.0 - smoothstep(0.0, 150.0, d)) * 0.9);

  float r = 0.5 * sqrt(level) * 0.92;
  float a = 1.0 - smoothstep(r - 0.06, r + 0.06, length(l));
  if (r < 0.03) a = 0.0;
  gl_FragColor = vec4(uDot * a, a) * 0.85;
}
`

function Field({ tone, fade, cell }: { tone: FieldTone; fade: number; cell: number }) {
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
    }),
    [tone, fade, cell],
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

export default function HalftoneScene({ tone, fade, cell, fallback, className }: { tone: FieldTone; fade: number; cell: number; fallback: ReactNode; className?: string }) {
  return (
    <WebGLStage fallback={fallback} className={className} gl={{ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Field tone={tone} fade={fade} cell={cell} />
    </WebGLStage>
  )
}
