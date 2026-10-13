import { media, type ModelId } from './media'

type Range = { start: number; end: number }
type Meta = { w: number; h: number; n: number; offsets: number[]; sizes: number[]; timeline: Record<string, Range> }

/**
 * One showcase frame sequence: a JSON index plus a single .bin of WebP frames rendered on
 * studio grey. Frames are decoded on demand around the wanted index and a small cache is kept.
 */
export class FrameSequence {
  meta: Meta | null = null
  onReady: (() => void) | null = null
  private blob: Blob | null = null
  private cache = new Map<number, ImageBitmap>()
  private pending = new Set<number>()
  private want = 0
  private loading: Promise<void> | null = null
  private readonly id: ModelId
  private readonly cap: number

  constructor(id: ModelId, cap = 24) {
    this.id = id
    this.cap = cap
  }

  load(onProgress: (p: number) => void) {
    this.loading ??= (async () => {
      const meta = (await (await fetch(media.seqMeta(this.id))).json()) as Meta
      const res = await fetch(media.seqFrames(this.id))
      if (!res.ok || !res.body) throw new Error(`frames ${res.status}`)
      const total = meta.offsets[meta.offsets.length - 1] + meta.sizes[meta.sizes.length - 1]
      const reader = res.body.getReader()
      const parts: BlobPart[] = []
      let got = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        parts.push(value)
        got += value.length
        onProgress(Math.min(0.99, got / total))
      }
      this.blob = new Blob(parts)
      this.meta = meta
      onProgress(1)
    })()
    return this.loading
  }

  /** Timeline stage name ("clay", "explode", "refine", ...) for a frame. */
  stageAt(frame: number) {
    if (!this.meta) return 'clay'
    for (const [name, r] of Object.entries(this.meta.timeline)) if (frame >= r.start && frame < r.end) return name
    return 'hold'
  }

  private decode(i: number) {
    const { meta, blob } = this
    if (!meta || !blob || i < 0 || i >= meta.n || this.cache.has(i) || this.pending.has(i)) return
    this.pending.add(i)
    const o = meta.offsets[i]
    createImageBitmap(blob.slice(o, o + meta.sizes[i], 'image/webp'))
      .then((bitmap) => {
        this.pending.delete(i)
        this.cache.set(i, bitmap)
        while (this.cache.size > this.cap) {
          let far = -1
          let dist = -1
          for (const k of this.cache.keys()) {
            const d = Math.abs(k - this.want)
            if (d > dist) {
              dist = d
              far = k
            }
          }
          this.cache.get(far)?.close()
          this.cache.delete(far)
        }
        if (this.want === i) this.onReady?.()
      })
      .catch(() => this.pending.delete(i))
  }

  /** Best available frame for index `i`: the frame itself, else its nearest decoded neighbour. */
  get(i: number, dir: 1 | -1) {
    this.want = i
    this.decode(i)
    for (let s = 1; s <= 6; s++) this.decode(i + s * dir)
    const hit = this.cache.get(i)
    if (hit || !this.meta) return hit ?? null
    for (let s = 1; s < this.meta.n; s++) {
      const near = this.cache.get(i - s) ?? this.cache.get(i + s)
      if (near) return near
    }
    return null
  }

  dispose() {
    for (const b of this.cache.values()) b.close()
    this.cache.clear()
    this.onReady = null
  }
}
