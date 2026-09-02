import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";

const features = [
  {
    title: "VR Headset Ready",
    desc: "Every video is optimized for VR headsets. Put on your device and step inside the scene.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M6 12h.01" />
        <path d="M18 12h.01" />
        <rect x="2" y="6" width="20" height="12" rx="4" />
        <path d="M12 6v12" />
      </svg>
    ),
  },
  {
    title: "Analytics Dashboard",
    desc: "Track viewer engagement, heatmaps and attention spans across every 360° video.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    title: "Live Streaming",
    desc: "Broadcast immersive 360° events in real time to audiences worldwide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
      </svg>
    ),
  },
  {
    title: "Cinematic Stitching",
    desc: "Multi-camera rigs stitched seamlessly. No visible seams, no distortion — just pure immersion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" />
        <rect x="3" y="6" width="12" height="12" rx="2" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Capture", desc: "We shoot with professional 360° camera rigs at your location or studio." },
  { num: "02", title: "Produce", desc: "Our team stitches, color-grades and optimizes every frame for web delivery." },
  { num: "03", title: "Publish", desc: "Get a shareable link or embed code. Your immersive video is live in minutes." },
];

const categories = ["All", "Real Estate", "Hospitality", "Events", "Tourism"];

const videos = [
  { id: 1, title: "Penthouse Walkthrough", category: "Real Estate", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800", duration: "2:34" },
  { id: 2, title: "Resort Poolside Tour", category: "Hospitality", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", duration: "3:12" },
  { id: 3, title: "Music Festival Coverage", category: "Events", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800", duration: "4:48" },
  { id: 4, title: "Historic Cathedral Tour", category: "Tourism", image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800", duration: "5:20" },
  { id: 5, title: "Beachfront Villa Preview", category: "Real Estate", image: "https://images.unsplash.com/photo-1499793983394-12dec4e2e3c8?auto=format&fit=crop&q=80&w=800", duration: "3:55" },
  { id: 6, title: "Mountain Lodge Experience", category: "Tourism", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=800", duration: "6:10" },
];

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/80 bg-black/10 backdrop-blur-[1px] transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 sm:h-7 sm:w-7 translate-x-[1px]">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

function Video360() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? videos : videos.filter((v) => v.category === active);

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-base-100 border-b border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              360° Video Production
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-base-content sm:text-5xl md:text-6xl">
              Step Inside
              <br />
              <span className="text-[var(--app-text-secondary)]">The Story</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-[var(--app-text-secondary)] sm:text-base">
              Immersive 360° video that puts your audience at the center of the action. Walkthroughs, events, destinations — all in cinematic quality.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/create"><Button variant="primary">Start a Project</Button></Link>
              <Link to="/pricing"><Button variant="secondary">View Pricing</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full border-y border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Process</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <p className="font-heading text-5xl font-bold text-base-content/10">{s.num}</p>
                <h3 className="font-heading mt-2 text-lg font-semibold text-base-content">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-secondary)]">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 -right-4 w-8 h-px bg-[var(--app-border)]/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Capabilities</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Full-Spectrum 360° Video</h2>
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

      {/* ── Video Gallery ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Showcase</span>
              <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Recent Videos</h2>
              <p className="mt-2 text-sm text-[var(--app-text-secondary)]">Explore our latest immersive 360° productions.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <div key={v.id} className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
                  <img src={v.image} alt={v.title} className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <PlayIcon />
                  <span className="absolute bottom-3 left-3 z-10 rounded-md bg-base-100/80 px-2 py-0.5 text-[10px] font-semibold text-base-content backdrop-blur-sm">
                    {v.duration}
                  </span>
                </div>
                <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
                  <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">{v.category}</span>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[var(--app-text-secondary)] py-16">No videos found in this category.</p>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full border-t border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">Ready to Go Immersive?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--app-text-secondary)]">
            Let's produce your next 360° video. From concept to delivery, we handle every frame.
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

export default Video360;
