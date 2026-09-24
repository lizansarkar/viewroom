import React from "react";
import VirtualTourViewer from "./VirtualTourViewer";

function VirtualTourHero() {
  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-12 sm:py-16 overflow-hidden">
      
      {/* Top Hero Text Section */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 flex flex-col items-center text-center z-10 mb-10 sm:mb-12">
        <span className="font-heading text-xs sm:text-sm font-black tracking-[0.25em] text-[var(--app-text-secondary)] uppercase block mb-3">
          360° VIRTUAL TOURS
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-4 text-[var(--app-text-primary)]">
          WALK INSIDE BEFORE YOU ARRIVE
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[var(--app-text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
          Immersive 360° panoramic spatial tours for real estate, hospitality, and commercial architecture.
        </p>
      </div>

      {/* 360 Tour Viewer Container - Full Width */}
      <div className="w-full px-0">
        <VirtualTourViewer />
      </div>

    </section>
  );
}

export default VirtualTourHero;
