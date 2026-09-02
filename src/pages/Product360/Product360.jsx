import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";

const stats = [
  { value: "10K+", label: "Products Digitized" },
  { value: "360°", label: "Full Rotation" },
  { value: "4K", label: "Resolution" },
  { value: "98%", label: "Client Retention" },
];

const features = [
  {
    title: "360° Spin Views",
    desc: "Let customers rotate and inspect every angle of your product with smooth, high-resolution spin photography.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
        <path d="M14 15V7.5A2.5 2.5 0 0 0 11.5 5h-1" />
        <path d="M2.46 9H7a2 2 0 0 0 2-2V2.46" />
        <path d="M10 9V4.5A2.5 2.5 0 0 1 12.5 2h1" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "HD Zoom Detail",
    desc: "Deep-zoom capability lets users magnify textures, labels and fine details without losing clarity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    title: "AR Ready Output",
    desc: "Export your 3D product models directly for augmented reality experiences on web and mobile.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: "Embed Anywhere",
    desc: "One-line embed code for your website, marketplace or product page. Works on all platforms.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const categories = ["All", "Furniture", "Electronics", "Fashion", "Automotive", "Jewelry"];

const products = [
  { id: 1, title: "Designer Lounge Chair", category: "Furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Wireless Headphones", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Minimalist Watch", category: "Fashion", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Modern Table Lamp", category: "Furniture", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Smart Speaker", category: "Electronics", image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Running Sneakers", category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Luxury Sedan", category: "Automotive", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "Diamond Pendant", category: "Jewelry", image: "https://images.unsplash.com/photo-1515562141589-67f0d939b71e?auto=format&fit=crop&q=80&w=800" },
];

function SpinIcon() {
  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-base-100/80 backdrop-blur-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-base-content">
          <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 15V7.5A2.5 2.5 0 0 0 11.5 5h-1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.46 9H7a2 2 0 0 0 2-2V2.46" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 9V4.5A2.5 2.5 0 0 1 12.5 2h1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      </div>
    </div>
  );
}

function Product360() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-base-100 border-b border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              360° Product Photography
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-base-content sm:text-5xl md:text-6xl">
              Every Angle.
              <br />
              <span className="text-[var(--app-text-secondary)]">Every Detail.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-[var(--app-text-secondary)] sm:text-base">
              Turn static product pages into interactive 360° experiences. Let customers rotate, zoom and inspect before they buy.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/create">
                <Button variant="primary">Start a Shoot</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative rotating product preview */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-10">
          <div className="h-64 w-64 rounded-full border border-[var(--app-border)]/20" />
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
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Capabilities</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Built for Product Teams</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--app-text-secondary)]">
              From studios to warehouses, we digitize your entire catalog with precision and speed.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card border border-[var(--app-border)]/20 bg-base-100 p-6 text-center transition-colors hover:border-base-content/30">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content">
                  {f.icon}
                </div>
                <h3 className="font-heading text-base font-semibold text-base-content">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Gallery ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Portfolio</span>
              <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Recent Shoots</h2>
              <p className="mt-2 text-sm text-[var(--app-text-secondary)]">Browse our latest 360° product captures.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
                  <img src={item.image} alt={item.title} className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <SpinIcon />
                </div>
                <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
                  <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">{item.category}</span>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[var(--app-text-secondary)] py-16">No products found in this category.</p>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full border-t border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">Ready to Digitize Your Catalog?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--app-text-secondary)]">
            Get started with 360° product photography. Fast turnaround, studio-quality results.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create"><Button variant="primary">Book a Session</Button></Link>
            <Link to="/pricing"><Button variant="secondary">See Packages</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Product360;
