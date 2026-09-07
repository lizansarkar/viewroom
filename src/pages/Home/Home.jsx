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
import Gallery from './Gallery'
import Benefits from './Benefits'
import TrustedBy from './TrustedBy'

function Home() {
  return (
    <div>
      {/* <ExampleUsage /> */}
      <Hero />
      <TrustedBy/>
      <Properties />
      <Explore />
      <Benefits/>
      <Featured />
      <HowItWorks />
      <Hotspots />
      <Discover />
      <Gallery/>
      <Cta />
      {/* <ImmersiveScroll/>   */}
      {/* <HomeCategories/> */}
      {/* <PropertyShowcase /> */}
    </div>
  )
}

export default Home
