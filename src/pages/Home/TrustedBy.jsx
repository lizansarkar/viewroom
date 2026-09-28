import React from 'react';

// Brand Logos with Official Icon Mark + Styled Wordmark Name
const logos = [
  {
    name: 'Webflow',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 100 30">
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
    name: 'Vercel',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 512 512">
        <path d="M256 48L512 464H0L256 48z" />
      </svg>
    ),
  },
  {
    name: 'Stripe',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 24 24">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.763-1.444 2.15-1.444 2.052 0 4.093.844 5.518 1.767L19.5 2.82C17.781 1.666 15.228 1 12.607 1 7.747 1 4.542 3.55 4.542 7.733c0 6.056 8.334 5.372 8.334 8.146 0 .976-.879 1.574-2.348 1.574-2.344 0-4.99-1.168-6.704-2.29l-1.246 4.382C4.464 20.84 7.42 22 10.395 22c5.074 0 8.442-2.518 8.442-6.842 0-6.425-8.861-5.467-8.861-8.008z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.353-.674.464-1.026.248-2.812-1.718-6.352-2.106-10.523-1.152-.403.093-.807-.156-.9-.559-.093-.404.156-.808.559-.901 4.568-1.043 8.487-.6 11.642 1.338.352.215.464.674.248 1.026zm1.467-3.265c-.27.44-.847.58-1.287.31-3.218-1.978-8.125-2.55-11.93-1.396-.496.15-1.021-.132-1.171-.628-.15-.496.132-1.02.628-1.171 4.354-1.32 9.771-.678 13.45 1.583.44.27.58.847.31 1.287zm.127-3.4c-3.859-2.29-10.237-2.503-13.916-1.386-.593.18-1.223-.157-1.403-.75-.18-.593.157-1.223.75-1.403 4.232-1.285 11.272-1.025 15.717 1.613.533.317.708 1.008.39 1.541-.316.533-1.007.708-1.538.385z" />
      </svg>
    ),
  },
  {
    name: 'Framer',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 24 24">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
      </svg>
    ),
  },
  {
    name: 'React',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="10" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="5" transform="rotate(120 50 50)" />
      </svg>
    ),
  },
  {
    name: 'Adobe',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 24 24">
        <path d="M13.966 22h6.034V2h-6.034zM0 2v20h6.034zM8.983 2h6.034l8.983 20h-6.034l-2.017-4.5H8.051z" />
      </svg>
    ),
  },
  {
    name: 'Airbnb',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 4.887 2.915 9.094 7.085 10.969L12 15l4.915 7.969C21.085 21.094 24 16.887 24 12c0-6.627-5.373-12-12-12zm0 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
      </svg>
    ),
  },
  {
    name: 'Tesla',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 342 342">
        <path d="M171 63.8c34.7 0 66.8 5.7 94.7 15.6l5.7-27.1C240.2 38.6 206.2 31.8 171 31.8s-69.2 6.8-100.4 20.5l5.7 27.1c27.9-9.9 60-15.6 94.7-15.6zM46.7 93.3l-27.1 5.7c20.5 44.9 57.6 80 102.3 98.4l11.3-24.8c-36.9-15.3-67.4-44.4-86.5-79.3zm248.6 0c-19.1 34.9-49.6 64-86.5 79.3l11.3 24.8c44.7-18.4 81.8-53.5 102.3-98.4l-27.1-5.7zM171 100.8c-9.1 0-16.5 7.4-16.5 16.5v192.9h33V117.3c0-9.1-7.4-16.5-16.5-16.5z" />
      </svg>
    ),
  },
  {
    name: 'Apple',
    svg: (
      <svg className="h-6 sm:h-7 fill-current" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.23-9.88-1.8-14.56-6.09-3.26-2.85-7.16-7.55-11.7-14.11-6.19-8.86-11.07-18.77-14.64-29.74-3.57-10.97-5.35-21.46-5.35-31.47 0-14.28 3.69-25.79 11.07-34.53 7.38-8.74 16.51-13.22 27.39-13.45 5.03 0 10.51 1.27 16.44 3.8 5.93 2.53 9.94 3.8 12.03 3.8 1.86 0 5.95-1.33 12.28-3.99 6.33-2.66 11.75-3.89 16.26-3.7 11.97.94 21.28 5.66 27.93 14.16-10.6 6.42-15.78 15.28-15.54 26.58.23 8.87 3.59 16.29 10.08 22.26 6.49 5.97 14.11 9.4 22.86 10.3-2.58 7.7-6.04 15.24-10.38 22.62zM119.22 30.12c0-6.84 2.45-13.35 7.36-19.53 4.91-6.18 11.07-9.87 18.49-11.07.12 1.06.18 2.01.18 2.85 0 6.72-2.52 13.3-7.56 19.74-5.04 6.44-11.19 10.12-18.47 11.04-.12-.84-.18-1.7-.18-2.58z" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    svg: (
      <svg className="h-5 sm:h-6 fill-current" viewBox="0 0 180 180">
        <mask id="mask0_next2" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="#fff" />
        </mask>
        <g mask="url(#mask0_next2)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path d="M149.508 157.52L69.142 54H54v72h14.4V73.837l66.864 87.086c4.615-1.077 9.076-2.52 13.31-4.303z" fill="#fff" />
          <path d="M126 54h14.4v72H126z" fill="#fff" />
        </g>
      </svg>
    ),
  },
];

function TrustedBy() {
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-12 overflow-hidden select-none">

      {/* Keyframe & Mask Styles */}
      <style>{`
        @keyframes marqueeSeamless {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-smooth {
          display: flex;
          width: max-content;
          animation: marqueeSeamless 36s linear infinite;
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
      <div className="relative w-full overflow-hidden fade-edge-mask py-3">
        <div className="animate-marquee-smooth items-center gap-10 sm:gap-16">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-2.5 text-[var(--app-text-primary)] opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0 group"
            >
              <div className="flex items-center justify-center shrink-0">
                {logo.svg}
              </div>
              <span className="font-heading text-base sm:text-lg font-black tracking-tight text-[var(--app-text-primary)] group-hover:text-[var(--app-text-primary)]">
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