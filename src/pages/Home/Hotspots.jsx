import React from "react";

// Icons using Lucide React / Inline SVG for exact design matching
const UploadIcon = () => (
  <svg
    className="w-6 h-6 mb-3 text-[var(--app-text-primary)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    className="w-6 h-6 mb-3 text-[var(--app-text-primary)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    className="w-6 h-6 mb-3 text-[var(--app-text-primary)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const PublishIcon = () => (
  <svg
    className="w-6 h-6 mb-3 text-[var(--app-text-primary)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </svg>
);

const CompassIcon = () => (
  <svg
    className="w-6 h-6 mb-3 text-[var(--app-text-primary)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const IconMarkSquare = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...props}
  >
    <path d="m4 9 8-5 8 5-8 5-8-5Z" strokeLinejoin="round" />
    <path d="M4 9v6l8 5 8-5V9" strokeLinejoin="round" />
  </svg>
);

const IconMarkPeak = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...props}
  >
    <path
      d="M2 8.5 6.5 15 12 6l5.5 9L22 8.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const badges = [
  { icon: IconMarkPeak, label: "Webflow" },
  { icon: IconMarkSquare, label: "Relume" },
  { icon: IconMarkPeak, label: "Webflow" },
  { icon: IconMarkSquare, label: "Relume" },
];

function Hotspots() {
  return (
    <section className="w-full bg-base-100 text-base-content px-4 sm:px-6 lg:px-0 py-14 sm:py-16 lg:py-0">
      {/* Upper container */}
        {/* Top: content block */}
        <div className="bg-base-100 text-base-content px-4 sm:px-0 py-14 sm:py-16 lg:py-10 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center py-2 md:py-10">
            <span className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-[var(--app-text-secondary)]">
              Hotspots
            </span>

            <h2 className="mt-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              One panoroma became a whole walkable tour. Hotspots connect the spaces.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[var(--app-text-secondary)] max-w-xl leading-relaxed">
              Enterence to living room to kitchen to bedroom to bathroom. Hotspots are the doors that connect each room.
            </p>

            {/* Badge row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {badges.map(({ icon: Icon, label }, i) => (
                <div
                  key={`${label}-${i}`}
                  className="flex items-center gap-2 text-base-content"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-heading text-sm font-semibold">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-9 flex items-center gap-6">
              {/* TODO: swap in your <Button /> component here — see note below */}
              <button
                type="button"
                className="btn rounded-full bg-base-content text-base-100 border-none px-8 font-heading text-sm font-semibold hover:opacity-90"
              >
                Enter
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-base-content hover:opacity-70 transition-opacity"
              >
                Tour
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="h-4 w-4"
                >
                  <path
                    d="m9 6 6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

        {/* Bottom: full-width image */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/6]">
          <img
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1600&auto=format&fit=crop"
            alt="Couple sharing coffee at a cafe table"
            className="h-full w-full object-cover rounded-none"
          />
        </div>
      </div>

        {/* Lower container */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Image */}
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200"
              alt="Person working"
              className="w-full h-full object-cover rounded-none"
            />
          </div>

          {/* Right Content Grid */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-[var(--app-background)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {/* Feature 1 */}
              <div>
                <UploadIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  UPLOAD 360° IMAGES
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)]">
                  Bring your space in with full panoramic captures.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <TagIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  PLACE HOTSPOTS
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)]">
                  Mark the doors and openings that connect each room.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <ImageIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  CONNECT SPACES
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)]">
                  Link every panorama into one continuous walkable tour.
                </p>
              </div>

              {/* Feature 4 */}
              <div>
                <PublishIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  PUBLISH
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)]">
                  Share a single link that opens your space to anyone.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-12">
              <button className="btn bg-[var(--color-primary)] text-[var(--color-primary-content)] hover:opacity-90 rounded-full px-8 border-none font-medium text-sm transition-all duration-200 cursor-pointer">
                Create
              </button>
              <button className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                Tour <span className="text-xs">&gt;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Content Grid */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[var(--app-background)] order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {/* Feature 1 */}
              <div>
                <ImageIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  SEE THE SPACE
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)] mb-4">
                  The first look is not a photo. It is the room itself.
                </p>
                <button className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  Look <span className="text-xs">&gt;</span>
                </button>
              </div>

              {/* Feature 2 */}
              <div>
                <CompassIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  UNDERSTAND THE LAYOUT
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)] mb-4">
                  Know how rooms connect before you ever arrive.
                </p>
                <button className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  Move <span className="text-xs">&gt;</span>
                </button>
              </div>

              {/* Feature 3 */}
              <div>
                <CompassIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  EXPLORE EVERY CORNER
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)] mb-4">
                  Walk the floor, check the ceiling, feel the scale.
                </p>
                <button className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  Enter <span className="text-xs">&gt;</span>
                </button>
              </div>

              {/* Feature 4 */}
              <div>
                <CompassIcon />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-2">
                  EXPERIENCE IT BEFORE YOU ARRIVE
                </h3>
                <p className="text-sm leading-relaxed text-[var(--app-text-secondary)] mb-4">
                  Step inside from anywhere and know the truth of the place.
                </p>
                <button className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                  Begin <span className="text-xs">&gt;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200"
              alt="People in a cozy interior space"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hotspots;
