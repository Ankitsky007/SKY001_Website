import { VersionSwitcher } from '@skyfall/core'
import { SmoothScroll, useLenis } from '@skyfall/core/motion'
import { useEffect } from 'react'
import { Backers } from './sections/Backers'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'
import { Research } from './sections/Research'
import { Sky001Cta } from './sections/Sky001Cta'
import { Team } from './sections/Team'

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
      const offset = -(document.querySelector('header')?.getBoundingClientRect().height ?? 64)
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset, duration: 1.4 })
      else target.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', href)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])
  return null
}

// v3 Captain. Mobile-first: base classes target phones, sm/md/lg/xl scale up.
function App() {
  return (
    <SmoothScroll>
      <AnchorScroll />
      <Nav />
      <main>
        <Hero />
        <Research />
        <Team />
        <Backers />
        <Sky001Cta />
      </main>
      <Footer />
      <VersionSwitcher current="v3" />
    </SmoothScroll>
  )
}

export default App
