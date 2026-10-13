import { VersionSwitcher } from '@skyfall/core'
import { ScrollTrigger, SmoothScroll, useLenis } from '@skyfall/core/motion'
import { useEffect } from 'react'
import { FxPicker } from './components/FxPicker'
import { isLaunchPath } from './lib/routes'
import { FrontPage } from './pages/FrontPage'
import { LaunchPage } from './pages/LaunchPage'

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

// v7 Campus (v6 with the enterprise campus hero on the front page). Two pages in one app: the Skyfall front page at "/" and the SKY-001 launch page at "/sky-001".
function App() {
  const launch = typeof window !== 'undefined' && isLaunchPath(window.location.pathname)
  return (
    <SmoothScroll>
      <AnchorScroll />
      <TriggerRefresh />
      {launch ? <LaunchPage /> : <FrontPage />}
      <FxPicker />
      <VersionSwitcher current="v7" />
    </SmoothScroll>
  )
}

export default App
