import React from "react";

const steps = [
  {
    title: "Choose a Space",
    description: "Find a home, hotel or room that pulls you in.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    offset: "lg:mt-0",
  },
  {
    title: "Enter the 360° Experience",
    description: "Step through the door and into the full panorama.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    offset: "lg:mt-14",
  },
  {
    title: "Explore Every Corner",
    description: "Move room to room using hotspots placed in the space.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
    offset: "lg:mt-28",
  },
];

function HowItWorks() {
  return (
    <section className="w-full bg-base-100 text-base-content px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
            How It Works
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight">
            Three Steps. One Open Door.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed">
            No downloads. No waiting. Pick a space and you are already inside.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {steps.map((step) => (
            <div key={step.title} className={step.offset}>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl mb-5">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--app-text-secondary)] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-14 sm:mt-16 flex items-center gap-6">
          {/* TODO: swap in your <Button /> component here, same as Featured.jsx */}
          <button
            type="button"
            className="btn rounded-full bg-base-content text-base-100 border-none px-8 font-heading text-sm font-semibold hover:opacity-90"
          >
            Start
          </button>
          <a
            href="#"
            className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-base-content hover:opacity-70 transition-opacity"
          >
            Explore
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
    </section>
  );
}

export default HowItWorks;