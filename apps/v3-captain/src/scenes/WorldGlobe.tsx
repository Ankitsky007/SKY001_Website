import { useFrame, useThree } from '@react-three/fiber'
import { WebGLStage } from '@skyfall/core/webgl'
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { GlobeFallback, GlobeFrame, GlobeOverlay } from '../figures/globe'
import { DECISION, GLOBE, GLOBE_LABEL, GLOBE_NODES } from '../figures/globeData'
import { placeOverlay, type ScreenPoint } from '../lib/live'

// 1.2 world-model globe: a wireframe sphere (meridians + parallels) spinning on a tilted axis
// inside the board's compass rings. The six functions and the decision are fixed points on the
// front of the sphere; great-circle links draw in turn from the decision and then flow.
// An orthographic camera maps world units 1:1 onto the board's 440 × 460 viewBox.

const R = GLOBE.r
const CENTER = new THREE.Vector3(0, GLOBE.h / 2 - GLOBE.cy, 0)
const CYCLE = 8

/** Board pixel on the disk → unit vector on the front hemisphere. */
function toSphere(px: number, py: number) {
  const x = (px - GLOBE.cx) / R
  const y = (GLOBE.cy - py) / R
  return new THREE.Vector3(x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y)))
}

function wireGeometry() {
  const pts: number[] = []
  const seg = 120
  const push = (f: (a: number) => THREE.Vector3) => {
    for (let i = 0; i < seg; i++) {
      const a = f((i / seg) * Math.PI * 2)
      const b = f(((i + 1) / seg) * Math.PI * 2)
      pts.push(a.x * R, a.y * R, a.z * R, b.x * R, b.y * R, b.z * R)
    }
  }
  for (let k = 0; k < 12; k++) {
    const lon = (k / 12) * Math.PI
    push((t) => new THREE.Vector3(Math.sin(t) * Math.cos(lon), Math.cos(t), Math.sin(t) * Math.sin(lon)))
  }
  for (const lat of [-66, -45, -22, 0, 22, 45, 66]) {
    const r = Math.cos(THREE.MathUtils.degToRad(lat))
    const y = Math.sin(THREE.MathUtils.degToRad(lat))
    push((t) => new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

const wireMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { uCenter: { value: CENTER } },
    vertexShader: /* glsl */ `
      uniform vec3 uCenter;
      varying float vFace;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vFace = normalize(wp.xyz - uCenter).z;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      varying float vFace;
      void main() {
        float a = mix(0.12, 0.6, smoothstep(-0.12, 0.12, vFace));
        gl_FragColor = vec4(1.0, 1.0, 1.0, a);
      }`,
  })

/** Great-circle arc from the decision to a node, with per-vertex progress and arc length. */
function arcGeometry(a: THREE.Vector3, b: THREE.Vector3) {
  const n = 48
  const pos: number[] = []
  const prog: number[] = []
  const len: number[] = []
  let acc = 0
  let prev: THREE.Vector3 | null = null
  const angle = a.angleTo(b)
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const p = new THREE.Vector3()
      .copy(a)
      .multiplyScalar(Math.sin((1 - t) * angle))
      .addScaledVector(b, Math.sin(t * angle))
      .divideScalar(Math.sin(angle) || 1)
      .normalize()
      .multiplyScalar(R + 1)
    if (prev) acc += p.distanceTo(prev)
    prev = p
    pos.push(p.x, p.y, p.z)
    prog.push(t)
    len.push(acc)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aProg', new THREE.Float32BufferAttribute(prog, 1))
  g.setAttribute('aLen', new THREE.Float32BufferAttribute(len, 1))
  return g
}

const linkMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { uDraw: { value: 0 }, uTime: { value: 0 }, uAlpha: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aProg;
      attribute float aLen;
      varying float vProg;
      varying float vLen;
      void main() {
        vProg = aProg;
        vLen = aLen;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDraw;
      uniform float uTime;
      uniform float uAlpha;
      varying float vProg;
      varying float vLen;
      void main() {
        if (vProg > uDraw) discard;
        if (mod(vLen - uTime * 15.0, 10.0) > 5.5) discard;
        gl_FragColor = vec4(0.553, 0.616, 0.941, uAlpha);
      }`,
  })

function Globe({ overlay, wrap, onReady }: { overlay: RefObject<SVGSVGElement | null>; wrap: RefObject<HTMLDivElement | null>; onReady?: () => void }) {
  const { camera } = useThree()
  const tiltRef = useRef<THREE.Group>(null)
  const linkGroup = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)

  const wire = useMemo(() => wireGeometry(), [])
  const wireMat = useMemo(() => wireMaterial(), [])
  const dir = useMemo(() => ({ d: toSphere(DECISION.x, DECISION.y), nodes: GLOBE_NODES.map((n) => toSphere(n.x, n.y)) }), [])
  const links = useMemo(
    () =>
      dir.nodes.map((b) => {
        const geometry = arcGeometry(dir.d, b)
        const material = linkMaterial()
        return { geometry, material, object: new THREE.Line(geometry, material) }
      }),
    [dir],
  )

  useEffect(
    () => () => {
      wire.dispose()
      wireMat.dispose()
      for (const l of links) {
        l.geometry.dispose()
        l.material.dispose()
      }
    },
    [wire, wireMat, links],
  )

  // Pointer tilts the instrument (desktop mouse only; ignores the synthetic events scrolling fires).
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const move = (e: PointerEvent) => {
      if (!mq.matches || e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      target.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      target.current.y = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    const leave = () => {
      target.current.x = 0
      target.current.y = 0
    }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [wrap])

  const v = useRef(new THREE.Vector3())

  // The camera is `manual` (fixed to the board's viewBox), so R3F never computes its projection.
  useLayoutEffect(() => {
    camera.updateProjectionMatrix()
  }, [camera])
  const lit = useRef<boolean[]>([])
  const ready = useRef(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const tilt = tiltRef.current
    const spin = spinRef.current
    if (!tilt || !spin) return

    spin.rotation.y = (t / 60) * Math.PI * 2
    tilt.rotation.x += (target.current.y * 0.22 - tilt.rotation.x) * 0.06
    tilt.rotation.y += (target.current.x * 0.3 - tilt.rotation.y) * 0.06
    tilt.updateMatrixWorld()

    // Links draw in turn, hold, fade, repeat.
    const c = t % CYCLE
    const fade = c > CYCLE - 1 ? 1 - (c - (CYCLE - 1)) : 1
    const draws: number[] = []
    linkGroup.current?.children.forEach((child, i) => {
      const draw = THREE.MathUtils.clamp((c - 0.3 - i * 0.35) / 0.7, 0, 1)
      const u = ((child as THREE.Line).material as THREE.ShaderMaterial).uniforms
      u.uDraw.value = draw
      u.uTime.value = t
      u.uAlpha.value = fade
      draws.push(draw)
    })

    const svg = overlay.current
    if (!svg) return
    const pts: Record<string, ScreenPoint> = {}
    const project = (u: THREE.Vector3, id: string) => {
      const p = v.current.copy(u).multiplyScalar(R + 1).applyMatrix4(tilt.matrixWorld).project(camera)
      pts[id] = { x: ((p.x + 1) / 2) * GLOBE.w, y: ((1 - p.y) / 2) * GLOBE.h }
    }
    project(dir.d, 'd')
    GLOBE_NODES.forEach((n, i) => {
      project(dir.nodes[i], n.id)
      const on = (draws[i] ?? 0) >= 1 && fade > 0.5
      if (lit.current[i] !== on) {
        lit.current[i] = on
        svg.querySelector(`[data-node="${n.id}"]`)?.setAttribute('fill', on ? '#3E57DA' : '#0B1338')
      }
    })
    placeOverlay(svg, pts)
    if (!ready.current) {
      ready.current = true
      onReady?.()
    }
  })

  return (
    <group ref={tiltRef} position={CENTER}>
      <group rotation={[0, 0, THREE.MathUtils.degToRad(18)]}>
        <group rotation={[THREE.MathUtils.degToRad(17.5), 0, 0]}>
          <group ref={spinRef}>
            <lineSegments geometry={wire} material={wireMat} />
          </group>
        </group>
      </group>
      <group ref={linkGroup}>
        {links.map((l, i) => (
          <primitive key={i} object={l.object} />
        ))}
      </group>
    </group>
  )
}

/** Lazy entry: frame SVG under the canvas, live marks over it. */
export default function WorldGlobe({ className, onReady }: { className?: string; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const overlay = useRef<SVGSVGElement>(null)
  return (
    <div ref={wrap} className={`relative cursor-crosshair ${className ?? ''}`} role="img" aria-label={GLOBE_LABEL}>
      <svg viewBox="0 0 440 460" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <GlobeFrame />
      </svg>
      <WebGLStage
        className="absolute! inset-0 h-full w-full"
        fallback={<GlobeFallback className="h-full w-full" />}
        orthographic
        camera={{ manual: true, left: -GLOBE.w / 2, right: GLOBE.w / 2, top: GLOBE.h / 2, bottom: -GLOBE.h / 2, near: 1, far: 2000, position: [0, 0, 500] }}
      >
        <Globe overlay={overlay} wrap={wrap} onReady={onReady} />
      </WebGLStage>
      <GlobeOverlay ref={overlay} className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  )
}
