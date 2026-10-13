import { VersionSwitcher } from '@skyfall/core'
import { SmoothScroll } from '@skyfall/core/motion'
import '../lib/motion'
import { useAnchorScroll } from '../lib/useAnchorScroll'
import { Footer } from '../sections/Footer'
import { Nav } from '../sections/Nav'
import { Benchmarks, Faq, Hero, Model, Roadmap, Stages, Team, Waitlist, Why } from './sections'

const TABS = [
  { id: 'top', label: 'SKY-001', href: '#top' },
  { id: 'model', label: 'Model', href: '#model' },
  { id: 'benchmarks', label: 'Benchmarks', href: '#benchmarks' },
  { id: 'stages', label: 'How it works', href: '#stages' },
  { id: 'roadmap', label: 'Roadmap', href: '#roadmap' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
]
const SPY = TABS.map((t) => t.id)
const CTA = { label: 'Join the waitlist', href: '#waitlist' }
const PAGES = TABS.slice(1).map(({ label, href }) => ({ label, href }))

function Page() {
  useAnchorScroll()
  return (
    <>
      <Nav tabs={TABS} spy={SPY} cta={CTA} badge="SKY-001" />
      <main>
        <Hero />
        <Model />
        <Benchmarks />
        <Stages />
        <Why />
        <Roadmap />
        <Team />
        <Faq />
        <Waitlist />
      </main>
      <Footer pages={PAGES} tagline="SKY-001 · First World Model for the Engineered World." />
    </>
  )
}

// SKY-001 launch page in the v2 aeye language. Mobile-first: base classes target phones.
export default function SkyApp() {
  return (
    <SmoothScroll>
      <Page />
      <VersionSwitcher current="v2" />
    </SmoothScroll>
  )
}
