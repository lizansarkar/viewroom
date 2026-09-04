import React from 'react'
import Hero from './Hero'
import PropertyShowcase from './PropertyShowcase'
import HowItWorks from './HowItWorks'
import HomeCategories from './HomeCategories'
import ImmersiveScroll from './ImmersiveScroll'
import Explore from './Explore'
import Featured from './Featured'
import Hotspots from './Hotspots'
import Discover from './Discover'
import Properties from './Properties'
import Cta from './Cta'

function Home() {
  return (
    <div>
      {/* <ExampleUsage /> */}
      <Hero />
      <Explore />
      <Featured />
      <HowItWorks />
      <Hotspots />
      <Discover />
      <Properties />
      <Cta />
      {/* <ImmersiveScroll/>   */}
      {/* <HomeCategories/> */}
      {/* <PropertyShowcase /> */}
    </div>
  )
}

export default Home
