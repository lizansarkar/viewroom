import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";

const stats = [
  { value: "2K+", label: "Spaces Scanned" },
  { value: "99.5%", label: "Accuracy" },
  { value: "< 48h", label: "Turnaround" },
  { value: "4.9★", label: "Client Rating" },
];

const features = [
  {
    title: "3D Dollhouse View",
    desc: "See an entire property as an interactive 3D miniature. Zoom in, rotate and explore the full layout.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: "Floor Plans",
    desc: "Auto-generated 2D floor plans from every scan. Accurate measurements, labeled rooms.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    ),
  },
  {
    title: "Measurement Tool",
    desc: "Measure any wall, room or object directly inside the 3D model with millimeter precision.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M2 22L22 2" />
        <path d="M6.3 17.7l-2.1 2.1" />
        <path d="M17.7 6.3l2.1-2.1" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    title: "Easy Sharing",
    desc: "One link to share with clients, tenants or buyers. No app download needed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
];

const properties = [
  { id: 1, title: "Luxury Penthouse", type: "Residential", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Boutique Hotel", type: "Hospitality", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Modern Office", type: "Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Coastal Villa", type: "Residential", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Art Museum", type: "Cultural", image: "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Mountain Chalet", type: "Residential", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=800" },
];

function Matterport() {
  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-base-100 border-b border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              Matterport 3D Scanning
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-base-content sm:text-5xl md:text-6xl">
              Digital Twins
              <br />
              <span className="text-[var(--app-text-secondary)]">Made Real</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-[var(--app-text-secondary)] sm:text-base">
              Photorealistic 3D scans of any physical space. Walk through, measure and explore properties as if you were standing inside them.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/create"><Button variant="primary">Book a Scan</Button></Link>
              <Link to="/pricing"><Button variant="secondary">View Pricing</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="w-full border-y border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4 gap-6 px-5 py-10 sm:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-base-content sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs tracking-wide text-[var(--app-text-secondary)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Technology</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">What Matterport Delivers</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--app-text-secondary)]">
              Every scan captures millions of data points to create a photorealistic digital replica of your space.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="card border border-[var(--app-border)]/20 bg-base-100 p-6 transition-colors hover:border-base-content/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-base-content">{f.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-secondary)]">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase Grid ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Portfolio</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Recent Scans</h2>
            <p className="mt-2 text-sm text-[var(--app-text-secondary)]">Explore our latest Matterport digital twins.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
                  <img src={p.image} alt={p.title} className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
                  <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">{p.type}</span>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full border-t border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">Ready to Create Your Digital Twin?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--app-text-secondary)]">
            Professional Matterport scanning for real estate, hospitality, retail and more. Fast, accurate, shareable.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create"><Button variant="primary">Schedule a Scan</Button></Link>
            <Link to="/pricing"><Button variant="secondary">See Packages</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Matterport;
