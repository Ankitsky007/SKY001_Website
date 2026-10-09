import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { BufferAttribute, BufferGeometry, ShaderMaterial } from 'three'
import { WebGLStage } from '@skyfall/core/webgl'

/**
 * SKY-001 CTA backdrop: the board's 12px blue dot grid, redrawn on the GPU so a slow ripple can
 * travel through it from the button (the hero's "one decision ripples out" motif) and the dots
 * near the pointer lift. Orthographic camera in CSS pixels keeps every dot on the CSS grid.
 */

const PITCH = 12

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uOrigin;
  uniform vec2 uPointer;
  uniform float uDpr;
  varying float vI;

  float ring(float d, float t, float period) {
    float r = mod(t, period);
    float fade = 1.0 - smoothstep(0.0, period, r);
    return exp(-pow((d - r) / 46.0, 2.0)) * fade;
  }

  void main() {
    vec2 p = position.xy;
    float d = distance(p, uOrigin);
    float t = uTime * 120.0;
    float w = ring(d, t, 1100.0) + 0.6 * ring(d, t + 550.0, 1100.0);
    float near = exp(-pow(distance(p, uPointer) / 110.0, 2.0));
    vI = clamp(w * 0.85 + near * 0.9, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = (1.5 + vI * 1.4) * uDpr;
  }
`

const fragment = /* glsl */ `
  varying float vI;
  void main() {
    vec3 base = vec3(0.118, 0.145, 0.314);   // #1E2550, the board's CTA dots
    vec3 lift = vec3(0.435, 0.514, 0.941);   // #6F83F0
    gl_FragColor = vec4(mix(base, lift, vI), 1.0);
  }
`

type Pointer = RefObject<{ x: number; y: number } | null>

function DotField({ pointer }: { pointer: Pointer }) {
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)
  const mat = useRef<ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const cols = Math.ceil(size.width / PITCH) + 1
    const rows = Math.ceil(size.height / PITCH) + 1
    const pos = new Float32Array(cols * rows * 3)
    let k = 0
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Match CSS: radial-gradient dot at (1px, 1px) of every 12px tile, origin top-left.
        pos[k++] = -size.width / 2 + 1.5 + x * PITCH
        pos[k++] = size.height / 2 - 1.5 - y * PITCH
        pos[k++] = 0
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    return g
  }, [size.width, size.height])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOrigin: { value: [0, 0] as [number, number] },
      uPointer: { value: [-9999, -9999] as [number, number] },
      uDpr: { value: 1 },
    }),
    [],
  )

  useFrame((_, delta) => {
    const m = mat.current
    if (!m) return
    m.uniforms.uTime.value += Math.min(delta, 0.05)
    m.uniforms.uDpr.value = dpr
    // Ripples start near the CTA button: bottom right on wide boxes, bottom left on phones.
    const wide = size.width > 700
    m.uniforms.uOrigin.value = [wide ? size.width / 2 - 140 : -size.width / 2 + 90, -size.height / 2 + 50]
    const p = pointer.current
    const target = p ? [p.x - size.width / 2, size.height / 2 - p.y] : [-9999, -9999]
    const cur = m.uniforms.uPointer.value as [number, number]
    // Ease toward the pointer, but snap when it enters or leaves so no glow streaks across.
    const k = Math.abs(target[0] - cur[0]) > 4000 ? 1 : 0.12
    cur[0] += (target[0] - cur[0]) * k
    cur[1] += (target[1] - cur[1]) * k
  })

  return (
    <points geometry={geometry}>
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </points>
  )
}

export default function CtaField({ pointer, fallback }: { pointer: Pointer; fallback: ReactNode }) {
  return (
    // WebGLStage's wrapper is position: relative, so it fills the absolutely positioned layer.
    <WebGLStage
      className="h-full w-full"
      fallback={fallback}
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
    >
      <color attach="background" args={['#05060F']} />
      <DotField pointer={pointer} />
    </WebGLStage>
  )
}
