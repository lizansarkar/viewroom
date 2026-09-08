import React from 'react';

function WhatIsMatterport() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-20 px-6 sm:px-12 lg:px-20 border-t border-[var(--app-text-secondary)]/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)] mb-3">
            WHAT IS A DIGITAL TWIN?
          </span>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-6 text-[var(--app-text-primary)]">
            A PERFECT 3D COPY OF YOUR PHYSICAL SPACE.
          </h2>

          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium leading-relaxed mb-6">
            Unlike standard 2D photos or simple 360 panoramas, a Matterport digital twin creates a dimensionally accurate 3D model of any building. It allows users to walk through rooms, measure distances, and evaluate spatial layouts as if they were physically standing there.
          </p>

          {/* Quick Key Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4 border-t border-[var(--app-text-secondary)]/15">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[var(--app-text-primary)]">99%</span>
              <span className="text-xs font-semibold text-[var(--app-text-secondary)] uppercase tracking-wider">
                Measurement Accuracy
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[var(--app-text-primary)]">4K</span>
              <span className="text-xs font-semibold text-[var(--app-text-secondary)] uppercase tracking-wider">
                HDR Spatial Clarity
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Feature Card */}
        <div className="lg:col-span-5 w-full">
          <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 overflow-hidden group shadow-2xl">
            {/* Background Light Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xl">
                3D
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase mb-2 tracking-wide">
                  Dimensional Depth
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
                  Capture high-density spatial data, point clouds, and automated floor plans for engineering, real estate, and design teams.
                </p>
              </div>

              <div className="w-full aspect-video rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                  alt="Spatial 3D Layout"
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default WhatIsMatterport;