// Feature detection for GPU effects. Every WebGL/WebGPU effect needs a static fallback,
// chosen from these checks, so phones, old browsers and reduced-motion visitors get a clean page.

let webgl2: boolean | undefined

export function hasWebGL2(): boolean {
  if (webgl2 !== undefined) return webgl2
  try {
    const canvas = document.createElement('canvas')
    webgl2 = !!canvas.getContext('webgl2')
  } catch {
    webgl2 = false
  }
  return webgl2
}

let webgpu: Promise<boolean> | undefined

/** The `shaders` library renders with WebGPU, which Safari and many Android phones still lack. */
export function hasWebGPU(): Promise<boolean> {
  if (webgpu) return webgpu
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
  webgpu = gpu
    ? gpu
        .requestAdapter()
        .then((adapter) => !!adapter)
        .catch(() => false)
    : Promise.resolve(false)
  return webgpu
}

/** Rough device class for picking effect quality. Low = phones and low-core machines. */
export function deviceTier(): 'low' | 'high' {
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return coarse || cores <= 4 || memory <= 4 ? 'low' : 'high'
}
