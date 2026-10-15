import { ScrollTrigger, SmoothScroll, useLenis } from '@skyfall/core/motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { PartnershipForm } from './components/PartnershipForm'
import { VideoModal } from './components/VideoModal'
import { WaitlistForm } from './components/WaitlistForm'
import { currentRoute, HASH_ROUTES, isPageHash } from './lib/routes'
import { FrontPage } from './pages/FrontPage'
import { LaunchPage } from './pages/LaunchPage'

// The blog carries every post's full text, so it loads only when someone opens it.
const BlogPage = lazy(() => import('./pages/BlogPage'))

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
      // page links ("#blog/<slug>" in hash builds) are not sections
      if (HASH_ROUTES && isPageHash(href)) return
      let target: Element | null = null
      try {
        target = document.querySelector(href)
      } catch {
        return
      }
      if (!target) return
      e.preventDefault()
      // clear the nav, and the news ticker above it while it shows
      const offset = document.querySelector('.ticker') ? -108 : -72
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

// Final Skyfall site: the front page at "/", the SKY-001 page at "/sky-001" and the blog at "/blog"
// (each post at "/blog/<slug>"), with the pop-ups (partnership, waitlist, launch video) shared by all.
function App() {
  const [route, setRoute] = useState(currentRoute)
  const { page, post } = route
  // hash-routed builds: "#sky-001", "#home", "#blog" and "#blog/<slug>" switch pages; other hashes (sections, pop-ups) don't
  useEffect(() => {
    if (!HASH_ROUTES) return
    const onHash = () => {
      if (!isPageHash(window.location.hash)) return
      setRoute(currentRoute())
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
      {page === 'launch' ? (
        <LaunchPage key="launch" />
      ) : page === 'blog' ? (
        <Suspense fallback={<div className="min-h-screen" />}>
          <BlogPage key={post ?? 'index'} post={post} />
        </Suspense>
      ) : (
        <FrontPage key="home" />
      )}
      <PartnershipForm />
      <WaitlistForm />
      <VideoModal />
    </SmoothScroll>
  )
}

export default App
