import { useFrame, useThree } from '@react-three/fiber'
import { deviceTier, WebGLStage } from '@skyfall/core/webgl'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { SeaFallback, SeaGraph } from '../figures/sea'
import { SEA_DESKTOP, SEA_MOBILE, seaPoints, type SeaLayout } from '../figures/seaData'
import { placeOverlay, type ScreenPoint } from '../lib/live'

// Hero "decision sea": a perspective field of tick marks over a ground plane, displaced by waves
// rolling toward the viewer, with brightness bands drifting across each row like the board's CSS
// masks. The six function nodes and the decision node ride the waves; their marks are an SVG
// overlay (crisp Geist Mono labels) that this scene re-projects every frame.

const FOV = 40
const CAM_H = 1.6
const TILT = THREE.MathUtils.degToRad(18)

/** Height of the sea at (x, z). Mirrors the GLSL below so nodes ride the same waves. */
function wave(x: number, z: number, t: number) {
  return 0.07 * (Math.sin(x * 0.55 + z * 0.35 - t * 0.9) * 0.6 + Math.sin(x * 1.15 - z * 0.5 - t * 1.25) * 0.3 + Math.sin(z * 0.9 - t * 0.7) * 0.25)
}

const vertex = /* glsl */ `
uniform float uTime;
uniform float uDpr;
attribute float aRow;
attribute float aSize;
attribute float aPeriod;
attribute float aSpeed;
attribute float aAlpha;
varying float vAlpha;
varying float vRx;

float wave(vec2 p, float t) {
  return 0.07 * (sin(p.x * 0.55 + p.y * 0.35 - t * 0.9) * 0.6 + sin(p.x * 1.15 - p.y * 0.5 - t * 1.25) * 0.3 + sin(p.y * 0.9 - t * 0.7) * 0.25);
}

void main() {
  vec3 p = position;
  p.y = wave(p.xz, uTime);
  // The board's row mask: 1 → .35 → 1 → .6 → 1 across one period, drifting sideways.
  float b = fract(p.x / aPeriod - uTime * aSpeed);
  float m = b < .22 ? 1. : b < .38 ? mix(1., .35, (b - .22) / .16) : b < .55 ? mix(.35, 1., (b - .38) / .17) : b < .78 ? mix(1., .6, (b - .55) / .23) : mix(.6, 1., (b - .78) / .22);
  float crest = smoothstep(-0.03, 0.09, p.y);
  vAlpha = aAlpha * m * (0.7 + 0.5 * crest) * smoothstep(0.0, 0.18, aRow);
  float size = aSize * (0.85 + 0.3 * crest);
  vRx = max(0.17, 0.55 / size);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = size * uDpr;
}
`

const fragment = /* glsl */ `
varying float vAlpha;
varying float vRx;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = (c.x * c.x) / (vRx * vRx) + (c.y * c.y) / 0.25;
  float a = vAlpha * (1.0 - smoothstep(0.6, 1.0, d));
  if (a < 0.01) discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}
`

const lerp = THREE.MathUtils.lerp

/** Rows spaced like real ground perspective; columns spaced in screen px like the board's rows. */
function buildSea(w: number, h: number, dense: boolean) {
  const tanV = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const focal = h / 2 / tanV
  const aspect = w / h
  const small = w < 640
  const aMax = TILT + THREE.MathUtils.degToRad(FOV / 2) + 0.04
  const dMin = CAM_H / Math.tan(aMax)
  const dMax = CAM_H / Math.tan(THREE.MathUtils.degToRad(1.3))
  const rows = dense ? 72 : 46
  const sx = small ? 0.8 : 1

  const pos: number[] = []
  const row: number[] = []
  const size: number[] = []
  const period: number[] = []
  const speed: number[] = []
  const alpha: number[] = []

  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1)
    const d = dMax * Math.pow(dMin / dMax, t)
    const slant = Math.hypot(d, CAM_H)
    const spPx = lerp(4, 24, Math.pow(t, 1.25)) * sx
    const sp = (spPx * slant) / focal
    const halfW = slant * tanV * aspect * 1.25 + 0.6
    const cols = Math.floor((2 * halfW) / sp)
    const per = (lerp(260, 1320, t) * sx * slant) / focal
    const spd = 1 / lerp(26, 10, t)
    const a = t < 0.75 ? lerp(0.22, 0.56, t / 0.75) : lerp(0.56, 0.46, (t - 0.75) / 0.25)
    const tick = lerp(2.6, 15, Math.pow(t, 1.3)) * (small ? 0.85 : 1)
    const off = (r % 2) * 0.5
    for (let c = 0; c < cols; c++) {
      pos.push(-halfW + (c + off) * sp, 0, -d)
      row.push(t)
      size.push(tick)
      period.push(per)
      speed.push(spd)
      alpha.push(a)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aRow', new THREE.Float32BufferAttribute(row, 1))
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1))
  g.setAttribute('aPeriod', new THREE.Float32BufferAttribute(period, 1))
  g.setAttribute('aSpeed', new THREE.Float32BufferAttribute(speed, 1))
  g.setAttribute('aAlpha', new THREE.Float32BufferAttribute(alpha, 1))
  return g
}

function Sea({ layout, overlay, onReady }: { layout: SeaLayout; overlay: RefObject<SVGSVGElement | null>; onReady?: () => void }) {
  const { size, camera, gl } = useThree()
  const dense = useMemo(() => deviceTier() === 'high', [])
  const geometry = useMemo(() => buildSea(size.width, size.height, dense), [size.width, size.height, dense])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDpr: { value: 1 } }), [])
  const material = useRef<THREE.ShaderMaterial>(null)
  useEffect(() => () => geometry.dispose(), [geometry])

  // Board points → ground positions, by casting through the un-parallaxed camera.
  const anchors = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(FOV, size.width / size.height, 0.05, 200)
    cam.position.set(0, CAM_H, 0)
    cam.rotation.set(-TILT, 0, 0, 'YXZ')
    cam.updateMatrixWorld()
    const ray = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const out: Record<string, THREE.Vector3> = {}
    for (const [id, p] of Object.entries(seaPoints(layout))) {
      ray.setFromCamera(new THREE.Vector2((p.x / layout.w) * 2 - 1, 1 - (p.y / layout.h) * 2), cam)
      const hit = new THREE.Vector3()
      if (ray.ray.intersectPlane(plane, hit)) out[id] = hit
    }
    return out
  }, [layout, size.width, size.height])

  // Pointer parallax, desktop mouse only.
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const move = (e: PointerEvent) => {
      if (!mq.matches || e.pointerType !== 'mouse') return
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const ready = useRef(false)
  const v = useRef(new THREE.Vector3())

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mat = material.current
    if (mat) {
      mat.uniforms.uTime.value = t
      mat.uniforms.uDpr.value = gl.getPixelRatio()
    }

    const c = current.current
    c.x += (target.current.x - c.x) * 0.04
    c.y += (target.current.y - c.y) * 0.04
    camera.position.set(c.x * 0.45, CAM_H - c.y * 0.12, 0)
    camera.rotation.set(-TILT - c.y * 0.01, -c.x * 0.03, 0, 'YXZ')
    camera.updateMatrixWorld()

    const svg = overlay.current
    if (!svg) return
    const pts: Record<string, ScreenPoint> = {}
    for (const [id, a] of Object.entries(anchors)) {
      const p = v.current.set(a.x, wave(a.x, a.z, t) + 0.02, a.z).project(camera)
      pts[id] = { x: ((p.x + 1) / 2) * size.width, y: ((1 - p.y) / 2) * size.height }
    }
    placeOverlay(svg, pts)
    if (!ready.current) {
      ready.current = true
      onReady?.()
    }
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} depthTest={false} />
    </points>
  )
}

/** Lazy entry: canvas + live overlay. The SVG fallback shows without WebGL. */
export default function HeroSea({ onReady }: { onReady?: () => void }) {
  const [small, setSmall] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const on = () => setSmall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const overlay = useRef<SVGSVGElement>(null)
  const layout = small ? SEA_MOBILE : SEA_DESKTOP

  return (
    <div className="absolute inset-0">
      <WebGLStage
        className="h-full w-full"
        fallback={<SeaFallback />}
        camera={{ fov: FOV, near: 0.05, far: 200, position: [0, CAM_H, 0], rotation: [-TILT, 0, 0] }}
      >
        <Sea layout={layout} overlay={overlay} onReady={onReady} />
      </WebGLStage>
      <SeaGraph key={small ? 'm' : 'd'} ref={overlay} live layout={layout} className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  )
}
