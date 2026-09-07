import React from 'react';

// Real SVGs for Brands
const logos = [
  {
    name: 'Webflow',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 100 30">
        <path d="M78.8 9.5c-4.4 0-7.8 2.2-9.7 5.7V9.9h-6.2v19.6h6.4v-11c0-3.3 2.1-5.1 4.9-5.1 2.9 0 4.6 1.8 4.6 5.1v11h6.4V18.1c0-5.4-2.8-8.6-6.4-8.6zm-26.6 0c-5.8 0-9.8 4.3-9.8 10.2 0 5.8 3.9 10.1 9.8 10.1 5.9 0 9.8-4.3 9.8-10.1 0-5.9-3.9-10.2-9.8-10.2zm0 14.8c-2.4 0-3.9-2.1-3.9-4.6 0-2.6 1.5-4.6 3.9-4.6 2.4 0 3.9 2.1 3.9 4.6 0 2.5-1.5 4.6-3.9 4.6zM28.4 9.9l-4.1 11.2-4.2-11.2h-6.8l-4.2 11.2L5 9.9H0l7.2 19.6h5.8l4.4-11 4.4 11h5.8l7.2-19.6h-6.4z" />
      </svg>
    ),
  },
  {
    name: 'Figma',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 38 57">
        <path d="M19 28.5a9.5 9.5 0 1 1 9.5-9.5A9.5 9.5 0 0 1 19 28.5zM9.5 0A9.5 9.5 0 0 0 0 9.5 9.5 9.5 0 0 0 9.5 19 9.5 9.5 0 0 0 19 9.5 9.5 9.5 0 0 0 9.5 0zm19 0A9.5 9.5 0 0 0 19 9.5 9.5 9.5 0 0 0 28.5 19 9.5 9.5 0 0 0 38 9.5 9.5 9.5 0 0 0 28.5 0zM9.5 19A9.5 9.5 0 0 0 0 28.5 9.5 9.5 0 0 0 9.5 38 9.5 9.5 0 0 0 19 28.5 9.5 9.5 0 0 0 9.5 19zm0 19A9.5 9.5 0 0 0 0 47.5 9.5 9.5 0 0 0 9.5 57 9.5 9.5 0 0 0 19 47.5V38H9.5z" />
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg className="h-7 sm:h-8 fill-current" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="10" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" transform="rotate(120 50 50)" />
      </svg>
    ),
  },
  {
    name: 'Tailwind',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 100 30">
        <path d="M26 6c-4.4 0-7.3 2.2-8.8 6.6 2.2-2.2 4.8-2.9 7.7-2.2 1.7.4 2.9 1.6 4.2 3 2.2 2.2 4.7 4.7 10.3 4.7 4.4 0 7.3-2.2 8.8-6.6-2.2 2.2-4.8 2.9-7.7 2.2-1.7-.4-2.9-1.6-4.2-3C34.1 8.5 31.6 6 26 6zm-16 12c-4.4 0-7.3 2.2-8.8 6.6 2.2-2.2 4.8-2.9 7.7-2.2 1.7.4 2.9 1.6 4.2 3 2.2 2.2 4.7 4.7 10.3 4.7 4.4 0 7.3-2.2 8.8-6.6-2.2 2.2-4.8 2.9-7.7 2.2-1.7-.4-2.9-1.6-4.2-3C18.1 20.5 15.6 18 10 18z" />
      </svg>
    ),
  },
];

function TrustedBy() {
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-12 overflow-hidden">
      
      {/* Keyframe & Mask Styles */}
      <style>{`
        @keyframes marqueeSeamless {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-smooth {
          display: flex;
          width: max-content;
          animation: marqueeSeamless 28s linear infinite;
        }
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }
        /* Alpha Mask for Pure Smooth Edge Dissolve */
        .fade-edge-mask {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 12%,
            black 88%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 12%,
            black 88%,
            transparent 100%
          );
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)]">
          TRUSTED BY THE WORLD'S LEADING COMPANIES
        </h3>
      </div>

      {/* Main Container with Alpha Mask Blend */}
      <div className="relative w-full overflow-hidden fade-edge-mask py-2">
        <div className="animate-marquee-smooth items-center gap-12 sm:gap-20">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-[var(--app-text-primary)] opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0"
            >
              {logo.svg}
              <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;