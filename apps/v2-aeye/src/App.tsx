import { VersionSwitcher } from '@skyfall/core'
import { SmoothScroll } from '@skyfall/core/motion'
import './lib/motion'
import { useAnchorScroll } from './lib/useAnchorScroll'
import { Backers } from './sections/Backers'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'
import { Research } from './sections/Research'
import { Sky001Cta } from './sections/Sky001Cta'
import { Team } from './sections/Team'

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
