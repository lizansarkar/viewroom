import React from "react";
import VirtualTourHero from "./VirtualTourHero";
import VirtualTourFeatures from "./VirtualTourFeatures";
import VirtualTourShowcase from "./VirtualTourShowcase";
import VirtualTourWorkflow from "./VirtualTourWorkflow";
import VirtualTourJournal from "./VirtualTourJournal";
import Cta from "../Home/Cta";
import SEOHead from "../../components/seo/SEOHead";

function VirtualTour360() {
  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <SEOHead
        title="360° Virtual Tours & Panoramic Real Estate Showcase"
        description="Explore ultra high-definition 360° virtual tours with interactive hot-spots, floor plans, and spatial audio narration."
        canonicalUrl="https://viewroom.com/360-virtual-tour"
      />
      <VirtualTourHero />
      <VirtualTourFeatures />
      <VirtualTourShowcase />
      <VirtualTourJournal />
      <VirtualTourWorkflow />
      <Cta />
    </main>
  );
}

export default VirtualTour360;