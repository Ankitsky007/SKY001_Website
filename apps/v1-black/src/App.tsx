import { VersionSwitcher } from '@skyfall/core'
import { SmoothScroll } from '@skyfall/core/motion'
import { Backers } from './sections/Backers'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Nav } from './sections/Nav'
import { Research } from './sections/Research'
import { Sky001Cta } from './sections/Sky001Cta'
import { Team } from './sections/Team'

// v1 Black: line-diagram hero, schematic figures that draw themselves, one blue accent.
// Mobile-first: base classes target phones, md (834 board) and lg (1440 board) scale up.
function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Research />
        <Team />
        <Backers />
        <Sky001Cta />
      </main>
      <Footer />
      <VersionSwitcher current="v1" />
    </SmoothScroll>
  )
}

export default App
