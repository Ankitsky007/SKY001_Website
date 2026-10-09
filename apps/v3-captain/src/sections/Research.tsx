import { Matters } from './Matters'
import { Mission } from './Mission'
import { Pareto } from './Pareto'
import { Problem } from './Problem'
import { Steps } from './Steps'
import { WhatWeBuild } from './WhatWeBuild'

/** 01 Research & vision: mission, 1.1 problem, 1.2 what we build, steps, 1.3 trade-offs, 1.4 sectors. */
export function Research() {
  return (
    <div id="research" className="scroll-mt-16">
      <Mission />
      <Problem />
      <WhatWeBuild />
      <Steps />
      <Pareto />
      <Matters />
    </div>
  )
}
