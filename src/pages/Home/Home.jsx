import React from 'react'
import Hero from './Hero'
import PropertyShowcase from './PropertyShowcase'
import HowItWorks from './HowItWorks'
import HomeCategories from './HomeCategories'

function Home() {
  return (
    <div>
      {/* <ExampleUsage /> */}
      <Hero />
      <HomeCategories/>
      <PropertyShowcase />
      <HowItWorks />
    </div>
  )
}

export default Home
