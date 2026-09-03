import React from 'react'
import Hero from './Hero'
import PropertyShowcase from './PropertyShowcase'
import HowItWorks from './HowItWorks'
import HomeCategories from './HomeCategories'
import ImmersiveScroll from './ImmersiveScroll'
import Explore from './Explore'
import Featured from './Featured'

function Home() {
  return (
    <div>
      {/* <ExampleUsage /> */}
      <Hero />
      <Explore />
      <Featured />
      <ImmersiveScroll/>
      
      {/* <HomeCategories/> */}
      <PropertyShowcase />
      <HowItWorks />
    </div>
  )
}

export default Home
