import React from 'react'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Explore from './Explore'
import Featured from './Featured'
import Hotspots from './Hotspots'
import Discover from './Discover'
import Properties from './Properties'
import Cta from './Cta'
import Gallery from './Gallery'
import Benefits from './Benefits'
import TrustedBy from './TrustedBy'
import SEOHead from '../../components/seo/SEOHead'

function Home() {
  return (
    <main className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <SEOHead
        title="360° Virtual Tours & Spatial Product Customizer"
        description="Experience immersive 360° virtual real estate tours, 3D object customization, and spatial photography with ViewRoom."
        canonicalUrl="https://viewroom.com/"
      />
      <Hero />
      <TrustedBy />
      <Properties />
      <Explore />
      <Benefits />
      <Featured />
      <HowItWorks />
      <Hotspots />
      <Discover />
      <Gallery />
      <Cta />
    </main>
  )
}

export default Home
