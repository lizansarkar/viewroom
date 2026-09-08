import React from 'react'
import MatterportSlider from './MatterportSlider'
import MatterportHero from './MatterportHero'
import WhatIsMatterport from './WhatIsMatterport'
import MatterportHowItWorks from './MatterportHowItWorks'

function Matterport() {
  return (
    <div>
      <MatterportHero />
      <WhatIsMatterport />
      <MatterportHowItWorks />
      <MatterportSlider />
    </div>
  )
}

export default Matterport