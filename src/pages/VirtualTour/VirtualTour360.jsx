import React from "react";
import VirtualTourHero from "./VirtualTourHero";
import VirtualTourFeatures from "./VirtualTourFeatures";
import VirtualTourShowcase from "./VirtualTourShowcase";
import VirtualTourWorkflow from "./VirtualTourWorkflow";
import Cta from "../Home/Cta";

function VirtualTour360() {
  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <VirtualTourHero />
      <VirtualTourFeatures />
      <VirtualTourShowcase />
      <VirtualTourWorkflow />
      <Cta />
    </main>
  );
}

export default VirtualTour360;