import React from "react";

/* Inline SVG icons — no external icon package required */
const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 21v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 6h2M7 10h2M7 14h2M11 6h2M11 10h2M11 14h2" strokeLinecap="round" />
  </svg>
);

const IconBed = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 18v2M21 18v2" strokeLinecap="round" />
    <path d="M3 12V8a2 2 0 0 1 2-2h5v6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="9" r="1" />
  </svg>
);

const IconLamp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M8 4h8l3 7H5l3-7Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11v9" strokeLinecap="round" />
    <path d="M9 20h6" strokeLinecap="round" />
  </svg>
);

const IconLayout = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M4 9h16" strokeLinecap="round" />
    <path d="M9 9v12" strokeLinecap="round" />
  </svg>
);

const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  {
    icon: IconBuilding,
    title: "Homes and Apartments",
    description:
      "Walk through full residences and understand how rooms connect before you visit.",
  },
  {
    icon: IconBed,
    title: "Hotels and Rooms",
    description:
      "See the real room, the real view and the real distance from the lobby.",
  },
  {
    icon: IconLamp,
    title: "Living Rooms and Bedrooms",
    description:
      "Feel the light, the ceiling height and the space between furniture.",
  },
  {
    icon: IconLayout,
    title: "Kitchens and Bathrooms",
    description:
      "Inspect finishes, fixtures and layouts in detail that photos cannot show.",
  },
];

function Explore() {
  return (
    <section className="w-full bg-base-100 text-base-content px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Top: label + heading + intro paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 sm:mb-16">
          <div>
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
              Explore
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight">
              Explore Spaces.
              <br />
              Your Way.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed lg:max-w-md">
              From entire homes to single rooms, every space opens the same
              way. Choose a place and step inside without leaving where you
              are.
            </p>
          </div>
        </div>

        {/* Feature columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12 sm:mb-14">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon className="h-7 w-7 sm:h-8 sm:w-8 mb-4 text-base-content" />
              <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-tight mb-2 leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom: View button + All link */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="btn rounded-full bg-base-content text-base-100 hover:bg-base-content/90 border-none px-8 font-heading text-sm font-semibold"
          >
            View
          </button>
          <a
            href="#"
            className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-base-content hover:opacity-70 transition-opacity"
          >
            All
            <IconChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Explore;