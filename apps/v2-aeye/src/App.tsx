import { VersionSwitcher } from '@skyfall/core'
import { prefersReducedMotion, SmoothScroll, useLenis } from '@skyfall/core/motion'
import { useEffect } from 'react'
import './lib/motion'
import { Backers } from './sections/Backers'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'
import { Research } from './sections/Research'
import { Sky001Cta } from './sections/Sky001Cta'
import { Team } from './sections/Team'

/** In-page links glide with Lenis (offset for the phone header); placeholder `#` links stay put. */
function useAnchorScroll() {
  const lenis = useLenis()
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const id = a.getAttribute('href')!.slice(1)
      e.preventDefault()
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      // Lenis honours html's scroll-padding-top (the phone header height); native scrollTo does not.
      if (lenis) return lenis.scrollTo(target, { duration: 1.4, force: true })
      const offset = window.matchMedia('(min-width: 768px)').matches ? 0 : -72
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])
}

function Page() {
  useAnchorScroll()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Research />
        <Team />
        <Backers />
        <Sky001Cta />
      </main>
      <Footer />
    </>
  )
}

// v2 aeye. Mobile-first: base classes target phones, sm/md/lg scale up.
function App() {
  return (
    <SmoothScroll>
      <Page />
      <VersionSwitcher current="v2" />
    </SmoothScroll>
  )
}

export default App
