import React, { useState } from 'react';

const hotspotsData = [
  { id: 1, label: 'Kitchen', top: '28%', left: '32%', active: true },
  { id: 2, label: 'Master Bedroom', top: '22%', left: '46%' },
  { id: 3, label: 'Balcony View', top: '25%', left: '68%' },
  { id: 4, label: 'Living Space', top: '65%', left: '52%' },
  { id: 5, label: 'Bathroom', top: '48%', left: '74%' },
];

const categories = ['Apartments', 'Villas', 'Commercial', 'Lofts', 'Studio', 'Modern'];

function Hero() {
  const [activeCategory, setActiveCategory] = useState('Apartments');
  const [selectedHotspot, setSelectedHotspot] = useState('Kitchen');

  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-12 px-4 sm:px-8 flex flex-col items-center justify-center overflow-hidden">

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center z-10">
        
        {/* TOP SECTION: 3D Isometric Viewport Container with PC Stand */}
        <div className="relative w-full max-w-3xl flex flex-col items-center mb-10">
          
          {/* Hexagonal / 3D Isometric Outer Frame (PC Screen) */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl bg-[#0e1117] p-2 flex items-center justify-center">
            
            {/* Room Image */}
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
              alt="3D Interior Room Space"
              className="w-full h-full object-cover rounded-2xl opacity-90"
            />

            {/* Glowing Accent Borders */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </div>

          {/* PC Monitor Stand Neck */}
          <div className="w-20 sm:w-24 h-6 sm:h-8 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-x border-slate-700/60 shadow-inner" />

          {/* PC Monitor Stand Base */}
          <div className="w-40 sm:w-48 h-3 sm:h-3.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-slate-600/50 rounded-full shadow-lg" />

        </div>

        {/* MIDDLE SECTION: Main Headline & Subtitle */}
        <div className="text-center max-w-2xl px-4 mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--app-text-primary)]">
            Explore Spaces. Redefine Reality.
          </h1>
          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed">
            Step into immersive 3D architectural tours of properties worldwide with ViewRoom's cutting-edge platform.
          </p>
        </div>

        {/* BOTTOM SECTION: Category Filter Pills */}
        {/* <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                activeCategory === category
                  ? 'bg-[var(--color-base-content)] text-[var(--color-base-100)] border-transparent shadow-sm'
                  : 'bg-transparent text-[var(--app-text-secondary)] border-[var(--app-border)] hover:text-[var(--app-text-primary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

      </div>
    </section>
  );
}

export default Hero;