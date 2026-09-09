import React from 'react'
import MatterportSlider from './MatterportSlider'
import MatterportHero from './MatterportHero'
import WhatIsMatterport from './WhatIsMatterport'
import MatterportHowItWorks from './MatterportHowItWorks'
import MatterportFeatures from './MatterportFeatures'
import MatterportUseCases from './MatterportUseCases'

function Matterport() {
  return (
    <div>
      <MatterportHero />
      <WhatIsMatterport />
      <MatterportHowItWorks />
      <MatterportFeatures />
      <MatterportUseCases />
      {/* <MatterportSlider /> */}
    </div>
  )
}

export default Matterport