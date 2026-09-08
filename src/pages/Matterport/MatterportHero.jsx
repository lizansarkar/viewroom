import React from 'react';
import Button from '../../components/reuseable/Button';

function MatterportHero() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 pt-20 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Header Tag */}
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)] mb-4">
          MATTERPORT DIGITAL TWIN
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight max-w-4xl leading-tight mb-6 text-[var(--app-text-primary)]">
          STEP INSIDE. ANYWHERE, ANYTIME.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-[var(--app-text-secondary)] max-w-2xl font-medium mb-8">
          Transform physical spaces into dimensionally accurate 3D digital twins. Explore, measure, and annotate real-world environments seamlessly.
        </p>

        {/* CTA Button */}
        <div className="mb-14">
          <Button variant="primary" className="cursor-pointer">
            Explore 3D Demo &darr;
          </Button>
        </div>

        {/* High-End PC Monitor Frame */}
        <div className="w-full max-w-5xl relative group">
          {/* External Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700/30 via-zinc-500/20 to-zinc-700/30 rounded-[28px] blur-xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none" />

          {/* PC Monitor Outer Frame */}
          <div className="relative rounded-[24px] border border-zinc-700/60 bg-zinc-950 p-2 sm:p-3 shadow-2xl overflow-hidden">
            
            {/* Top Camera Notch & Bar */}
            <div className="w-full h-6 bg-zinc-900 rounded-t-[18px] flex items-center justify-center relative mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse" />
              </div>
            </div>

            {/* Screen Content Window */}
            <div className="w-full aspect-video rounded-b-[18px] bg-zinc-900 overflow-hidden relative border border-zinc-800/80 flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="3D Space Preview"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />

              {/* Interactive Hotspot Overlay (Demo UI) */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center">
                <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Interactive 3D Walkthrough
                </div>
              </div>
            </div>

          </div>

          {/* Monitor Stand Base (Minimalistic) */}
          <div className="w-32 sm:w-48 h-3 bg-zinc-800/80 mx-auto rounded-b-lg border-x border-b border-zinc-700/50 shadow-md" />
        </div>

      </div>
    </section>
  );
}

export default MatterportHero;