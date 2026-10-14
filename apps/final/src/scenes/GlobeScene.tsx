// Lazy chunk: the "world model" globe. Shares three.js / React Three Fiber with the field scene.
import { useFrame } from '@react-three/fiber'
import { WebGLStage } from '@skyfall/core/webgl'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { CanvasTexture, DoubleSide, RepeatWrapping, SRGBColorSpace, type Group, type Mesh, type ShaderMaterial } from 'three'

const VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

// A glossy logo-blue sphere: soft key light, a white highlight, a bright rim, and latitude and
// longitude lines that turn with the globe.
const FRAG = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vUv;
uniform float uSpin;

void main() {
  vec3 n = normalize(vNormal);
  vec3 key = normalize(vec3(-0.55, 0.75, 0.6));
  float diff = clamp(dot(n, key), 0.0, 1.0);
  float rim = pow(1.0 - clamp(dot(n, vView), 0.0, 1.0), 2.4);
  float spec = pow(clamp(dot(reflect(-key, n), vView), 0.0, 1.0), 38.0);

  vec3 deep = vec3(0.090, 0.130, 0.420);
  vec3 brand = vec3(0.2431, 0.3412, 0.8549);
  vec3 lift = vec3(0.640, 0.710, 0.980);
  vec3 col = mix(deep, brand, smoothstep(0.0, 0.75, diff));
  col = mix(col, lift, smoothstep(0.55, 1.0, diff) * 0.6);

  vec2 g = vec2((vUv.x + uSpin) * 24.0, vUv.y * 12.0);
  vec2 d = abs(fract(g) - 0.5) / fwidth(g);
  float line = 1.0 - smoothstep(0.0, 1.3, min(d.x, d.y));
  col = mix(col, vec3(1.0), line * (0.22 + 0.5 * diff));

  col += vec3(1.0) * spec * 0.9;
  col = mix(col, vec3(0.86, 0.90, 1.0), rim * 0.75);
  gl_FragColor = vec4(col, 1.0);
}
`

/** The band's lettering, drawn once to a canvas: a brushed light strip with ink mono capitals, twice around. */
function useBandTexture(label: string) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    // About 16:1, the band's own proportions (circumference to height), so the letters are not stretched.
    c.width = 4096
    c.height = 260
    const t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    t.wrapS = RepeatWrapping
    t.anisotropy = 8
    return t
  }, [])

  useEffect(() => {
    let cancelled = false
    const paint = () => {
      if (cancelled) return
      const c = texture.image as HTMLCanvasElement
      const ctx = c.getContext('2d')
      if (!ctx) return
      const grad = ctx.createLinearGradient(0, 0, 0, c.height)
      grad.addColorStop(0, '#c9cfdb')
      grad.addColorStop(0.18, '#ffffff')
      grad.addColorStop(0.5, '#f1f3f8')
      grad.addColorStop(0.82, '#ffffff')
      grad.addColorStop(1, '#b6bdcc')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, c.width, 8)
      ctx.fillRect(0, c.height - 8, c.width, 8)
      ctx.font = '700 156px "Geist Mono", ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const x of [c.width * 0.25, c.width * 0.75]) ctx.fillText(label.toUpperCase(), x, c.height / 2 + 8)
      ctx.fillStyle = '#3e57da'
      for (const x of [0, c.width * 0.5, c.width]) ctx.fillRect(x - 18, c.height / 2 - 18, 36, 36)
      texture.needsUpdate = true
    }
    paint()
    document.fonts?.load('700 156px "Geist Mono"').then(paint, () => {})
    return () => {
      cancelled = true
    }
  }, [texture, label])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

// Turn that brings the first copy of the lettering (a quarter of the way round the texture) to the front.
const FRONT = -Math.PI / 2

function Globe({ label }: { label: string }) {
  const group = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const material = useRef<ShaderMaterial>(null)
  const band = useBandTexture(label)
  const uniforms = useMemo(() => ({ uSpin: { value: 0 } }), [])
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (material.current) material.current.uniforms.uSpin.value = t * 0.02
    // The band keeps its lettering towards the viewer and only sways, so it always reads.
    if (ring.current) ring.current.rotation.y = FRONT + Math.sin(t * 0.5) * 0.22
    const g = group.current
    if (!g) return
    // The whole object leans a little towards the pointer and bobs gently.
    const k = Math.min(1, delta * 3)
    g.rotation.x += (0.24 + pointer.current.y * 0.12 - g.rotation.x) * k
    g.rotation.z += (-0.1 - pointer.current.x * 0.08 - g.rotation.z) * k
    g.position.y = Math.sin(t * 0.8) * 0.04
  })

  return (
    <group ref={group} rotation={[0.24, 0, -0.1]}>
      <mesh>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial ref={material} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
      </mesh>
      <mesh ref={ring} rotation={[0, FRONT, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.52, 96, 1, true]} />
        <meshBasicMaterial map={band} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function GlobeScene({ label, fallback, className }: { label: string; fallback: ReactNode; className?: string }) {
  return (
    <WebGLStage fallback={fallback} className={className} camera={{ position: [0, 0.25, 5.4], fov: 34 }} gl={{ antialias: true, alpha: true }} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Globe label={label} />
    </WebGLStage>
  )
}
