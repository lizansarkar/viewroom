import React from 'react'
import Hero from './Hero'
import PropertyShowcase from './PropertyShowcase'
import HowItWorks from './HowItWorks'
import HomeCategories from './HomeCategories'
import ImmersiveScroll from './ImmersiveScroll'

function Home() {
  return (
    <div>
      {/* <ExampleUsage /> */}
      <Hero />
      <ImmersiveScroll/>
      <HomeCategories/>
      <PropertyShowcase />
      <HowItWorks />
    </div>
  )
}

export default Home
