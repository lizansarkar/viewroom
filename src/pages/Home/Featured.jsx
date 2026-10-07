import React from "react";
import { Link } from "react-router-dom";

/* Simple inline mark icons standing in for the two brand badges in the design */
const IconMarkSquare = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="m4 9 8-5 8 5-8 5-8-5Z" strokeLinejoin="round" />
    <path d="M4 9v6l8 5 8-5V9" strokeLinejoin="round" />
  </svg>
);

const IconMarkPeak = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M2 8.5 6.5 15 12 6l5.5 9L22 8.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const badges = [
  { icon: IconMarkPeak, label: "Webflow" },
  { icon: IconMarkSquare, label: "Relume" },
  { icon: IconMarkPeak, label: "Webflow" },
  { icon: IconMarkSquare, label: "Relume" },
];

function Featured() {
  return (
    <section className="w-full overflow-hidden rounded-2xl">
      {/* Top: content block */}
      <div className="bg-base-100 text-base-content px-4 sm:px-8 py-14 sm:py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-[var(--app-text-secondary)]">
            Featured
          </span>

          <h2 className="mt-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            Modern Residence. Three Bedrooms. Two Bathrooms.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[var(--app-text-secondary)] max-w-xl leading-relaxed">
            A full 360° tour is ready. Walk from the entrance through the
            living room and into every corner of the house.
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
            <Link to="/explore">
              <button
                type="button"
                className="btn rounded-full bg-base-content text-base-100 border-none px-8 font-heading text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
                Enter
              </button>
            </Link>
            <Link
              to="/360-virtual-tour"
              className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-base-content hover:opacity-70 transition-opacity cursor-pointer"
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
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom: full-width image */}
      <div className="w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/6]">
        <img
          src="https://media.licdn.com/dms/image/v2/D4E12AQGn5iOuSfzR0g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1698674398769?e=2147483647&v=beta&t=bvXEc6IP9G-f5JZyWV3Dil7twZ-oyKBYPVe1Mici218"
          alt="Couple sharing coffee at a cafe table"
          className="h-full w-full object-cover rounded-none"
        />
      </div>
    </section>
  );
}

export default Featured;