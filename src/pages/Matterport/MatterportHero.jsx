import React from 'react';

function MatterportHero() {
  return (
    <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-white overflow-hidden px-6 sm:px-12 bg-zinc-900">
      
      {/* Background Image with Blur & Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Blurred Interior Background"
          className="w-full h-full object-cover scale-110 blur-xl opacity-40 brightness-75"
        />
        {/* Dark overlay to match image background tone */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Main Heading */}
        <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-6 text-white drop-shadow-md">
          STEP INSIDE. BEFORE YOU STEP IN.
        </span>

        {/* Subtitle Text */}
        <p className="text-sm sm:text-lg md:text-xl text-zinc-300 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
          Explore homes, hotels and spaces through immersive 360° experiences. Move through rooms before you ever arrive.
        </p>

      </div>

    </section>
  );
}

export default MatterportHero;