import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";

const services = [
  {
    title: "Architectural",
    desc: "Exterior and interior shots that capture the soul of a building. Ideal for portfolios and marketing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Interior Design",
    desc: "Highlight textures, lighting and spatial flow. Styled or as-is, we make interiors shine.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
        <path d="M4 18v2" />
        <path d="M20 18v2" />
      </svg>
    ),
  },
  {
    title: "Aerial Drone",
    desc: "Bird's-eye perspectives that reveal context, scale and surroundings. FAA-certified pilots.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Virtual Staging",
    desc: "Digitally furnish empty rooms. Photorealistic renders that help buyers visualize the potential.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
      </svg>
    ),
  },
];

const galleryCategories = ["All", "Residential", "Commercial", "Aerial", "Interior"];

const photos = [
  { id: 1, title: "Glass House", category: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Downtown Tower", category: "Commercial", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Coastal Aerial", category: "Aerial", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Minimal Living Room", category: "Interior", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Lake House", category: "Residential", image: "https://images.unsplash.com/photo-1499793983394-12dec4e2e3c8?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Corporate Campus", category: "Commercial", image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Urban Skyline", category: "Aerial", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "Modern Kitchen", category: "Interior", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800" },
];

function Photography() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-base-100 border-b border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              Professional Photography
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-base-content sm:text-5xl md:text-6xl">
              Spaces That
              <br />
              <span className="text-[var(--app-text-secondary)]">Speak for Themselves</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-[var(--app-text-secondary)] sm:text-base">
              High-impact architectural and interior photography that sells properties, showcases designs and elevates brands.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/create"><Button variant="primary">Book a Session</Button></Link>
              <Link to="/pricing"><Button variant="secondary">View Packages</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Services</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">What We Capture</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--app-text-secondary)]">
              From ground-level details to aerial overviews, we cover every angle of your space.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="card border border-[var(--app-border)]/20 bg-base-100 p-6 text-center transition-colors hover:border-base-content/30">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content">
                  {s.icon}
                </div>
                <h3 className="font-heading text-base font-semibold text-base-content">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-secondary)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Portfolio</span>
              <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Selected Works</h2>
              <p className="mt-2 text-sm text-[var(--app-text-secondary)]">A curated look at our recent shoots.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`btn btn-sm rounded-md font-heading text-[11px] tracking-wide font-semibold px-4 border transition-colors duration-200 ${
                    active === cat
                      ? "bg-base-content text-base-100 border-base-content hover:bg-base-content hover:text-base-100"
                      : "text-base-content border-[var(--app-border)]/40 hover:border-base-content hover:text-base-content"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer overflow-hidden">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-xs font-semibold text-white">{p.title}</span>
                    <span className="ml-2 text-[10px] text-white/70">{p.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[var(--app-text-secondary)] py-16">No photos found in this category.</p>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full border-t border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">Let's Capture Your Space</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--app-text-secondary)]">
            Professional photography packages tailored to your property type and marketing goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create"><Button variant="primary">Book a Shoot</Button></Link>
            <Link to="/pricing"><Button variant="secondary">See Packages</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Photography;
