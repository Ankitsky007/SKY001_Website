import { ScrollTrigger, SmoothScroll, useLenis } from '@skyfall/core/motion'
import { useEffect, useState } from 'react'
import { PartnershipForm } from './components/PartnershipForm'
import { VideoModal } from './components/VideoModal'
import { WaitlistForm } from './components/WaitlistForm'
import { currentPage, HASH_ROUTES, HOME, LAUNCH } from './lib/routes'
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

// Final Skyfall site: the front page at "/" and the SKY-001 page at "/sky-001", with the pop-ups
// (partnership, waitlist, launch video) shared by both.
function App() {
  const [page, setPage] = useState(currentPage)
  // hash-routed builds: "#sky-001" and "#home" switch pages; other hashes (sections, pop-ups) don't
  useEffect(() => {
    if (!HASH_ROUTES) return
    const onHash = () => {
      const h = window.location.hash
      if (h !== HOME && h !== LAUNCH) return
      setPage(h === LAUNCH ? 'launch' : 'home')
      window.scrollTo(0, 0)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return (
    <SmoothScroll>
      <AnchorScroll />
      <TriggerRefresh />
      {page === 'launch' ? <LaunchPage key="launch" /> : <FrontPage key="home" />}
      <PartnershipForm />
      <WaitlistForm />
      <VideoModal />
    </SmoothScroll>
  )
}

export default App
