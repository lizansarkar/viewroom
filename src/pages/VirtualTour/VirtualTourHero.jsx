import React from "react";
import VirtualTourViewer from "./VirtualTourViewer";

function VirtualTourHero() {
  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-12 sm:py-16 px-4 sm:px-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center z-10">
        
        {/* Top Hero Text Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-heading text-xs sm:text-sm font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase block mb-3">
            360° IMMERSIVE VIRTUAL TOURS
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[1.05] mb-5 text-[var(--app-text-primary)]">
            WALK INSIDE. <br className="hidden sm:inline" />
            BEFORE YOU EVER ARRIVE.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[var(--app-text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
            Experience spatial freedom with our 360-degree panoramic virtual tours. Walk through homes, hotels, lofts, and commercial spaces from anywhere in the world.
          </p>
        </div>

        {/* 360 Tour Viewer Container */}
        <div className="w-full">
          <VirtualTourViewer />
        </div>

      </div>
    </section>
  );
}

export default VirtualTourHero;
