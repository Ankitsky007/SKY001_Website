import { ScrollTrigger, SmoothScroll, useLenis } from '@skyfall/core/motion'
import { useEffect } from 'react'
import { FxPicker } from './components/FxPicker'
import { FrontPage } from './pages/FrontPage'

/** In-page links glide with Lenis (offset by the sticky header); bare "#" placeholders do nothing. */
function AnchorScroll() {
  const lenis = useLenis()
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')!
      if (href === '#') {
        e.preventDefault()
        return
      }
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      const offset = -72
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset, duration: 1.4 })
      else target.scrollIntoView({ behavior: 'smooth' })
      // Some embedded viewers refuse address changes; the scroll still happens.
      try {
        history.replaceState(null, '', href)
      } catch {
        /* ignore */
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])
  return null
}

/** Late-loading media and fonts change the page height; keep scroll triggers measured against the real layout. */
function TriggerRefresh() {
  useEffect(() => {
    let timer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [])
  return null
}

// Final Skyfall site, started from v7 Campus. Front page only for now.
function App() {
  return (
    <SmoothScroll>
      <AnchorScroll />
      <TriggerRefresh />
      <FrontPage />
      <FxPicker />
    </SmoothScroll>
  )
}

export default App
