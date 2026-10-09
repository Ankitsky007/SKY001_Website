import '@testing-library/jest-dom/vitest'

// jsdom lacks the browser APIs GSAP, Lenis and the GPU stages touch; stub the minimum.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver
window.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

if (!('fonts' in document)) {
  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve(), status: 'loaded', addEventListener: () => {}, removeEventListener: () => {} },
  })
}
