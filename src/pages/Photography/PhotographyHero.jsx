import React from "react";

function PhotographyHero() {
  const heroPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      pos: "top-[-2%] left-[-4%] sm:top-[4%] sm:left-[25%]",
      size: "w-28 sm:w-48 md:w-56 lg:w-64 aspect-[4/3]",
      rotate: "-rotate-6",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      pos: "top-[1%] right-[-4%] sm:top-[6%] sm:right-[20%]",
      size: "w-32 sm:w-52 md:w-60 lg:w-68 aspect-[3/4]",
      rotate: "rotate-6",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      pos: "bottom-[-6%] left-[1%] sm:bottom-[4%] sm:left-[20%]",
      size: "w-36 sm:w-56 md:w-64 lg:w-72 aspect-[16/10]",
      rotate: "rotate-3",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      pos: "bottom-[-4%] right-[1%] sm:bottom-[0%] sm:right-[20%]",
      size: "w-28 sm:w-48 md:w-56 lg:w-64 aspect-square",
      rotate: "-rotate-12",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      pos: "top-[38%] left-[-6%] sm:top-[42%] sm:left-[10%]",
      size: "w-32 sm:w-52 md:w-60 aspect-[4/3]",
      rotate: "rotate-12",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      pos: "top-[36%] right-[-6%] sm:top-[40%] sm:right-[10%]",
      size: "w-32 sm:w-52 md:w-60 aspect-[3/4]",
      rotate: "-rotate-8",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
      pos: "top-[36%] right-[-6%] sm:top-[4%] sm:right-[40%]",
      size: "w-36 sm:w-60 md:w-72 aspect-[16/9]",
      rotate: "rotate-2",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
      pos: "bottom-[0%] left-[42%] -translate-x-1",
      size: "w-36 sm:w-64 md:w-76 aspect-[16/9]",
      rotate: "-rotate-3",
    },
  ];

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[88vh] flex items-center justify-center bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 overflow-hidden px-4 sm:px-8 select-none">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px]" />

      {/* 8 SCATTERED BACKGROUND PHOTOGRAPHY CARDS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {heroPhotos.map((photo) => (
          <div
            key={photo.id}
            className={`absolute ${photo.pos} ${photo.size} ${photo.rotate} ${photo.opacity} shadow-2xl transition-all duration-500 ease-out pointer-events-auto`}
          >
            <img
              src={photo.url}
              alt="Photography Backdrop"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* CENTER CONTENT AREA */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center py-12">
        {/* MAIN HEADING */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[1.08] mb-6 text-[var(--app-text-primary)] drop-shadow-md">
          EVERY FRAME <br className="hidden sm:block" />
          TELLS A STORY.
        </h1>

        {/* SUBTITLE TEXT */}
        <p className="text-xs sm:text-base md:text-lg text-[var(--app-text-secondary)] font-medium max-w-xl leading-relaxed drop-shadow-sm">
          Showcasing real estate, interior structures, and architectural
          masterpieces through high-precision photographic art.
        </p>
      </div>

      {/* BOTTOM GRADIENT OVERLAY FOR SMOOTH TRANSITION */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--app-background)] via-[var(--app-background)]/60 to-transparent pointer-events-none" />
    </section>
  );
}

export default PhotographyHero;
