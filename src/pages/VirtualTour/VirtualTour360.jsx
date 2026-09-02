import React, { useState, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Link } from "react-router-dom";
import * as THREE from "three";
import Button from "../../components/reuseable/Button";

const PANORAMA_URL =
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2400&q=80";

const stats = [
  { value: "500+", label: "Virtual Tours" },
  { value: "120+", label: "Happy Clients" },
  { value: "50+", label: "Cities Covered" },
  { value: "99%", label: "Satisfaction" },
];

const features = [
  {
    title: "Immersive 360° Views",
    desc: "Step inside any space and look around freely. Our tours capture every angle so you never miss a detail.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Navigation",
    desc: "Move seamlessly through rooms, floors and buildings with smooth, intuitive controls.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    title: "Cinematic Quality",
    desc: "Shot in high resolution with professional lighting. Every tour feels like a film-grade walkthrough.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
        <path d="m21 2-9.6 9.6" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </svg>
    ),
  },
  {
    title: "Cross-Platform Ready",
    desc: "Tours work flawlessly on desktop, tablet and mobile — no app install required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
];

const categories = ["All", "Residential", "Commercial", "Hospitality", "Cultural"];

const tours = [
  {
    id: 1,
    title: "Modern Penthouse Suite",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    desc: "A panoramic view of luxury living.",
  },
  {
    id: 2,
    title: "Grand Hotel Lobby",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&q=80&w=800",
    desc: "Walk through an opulent hotel entrance.",
  },
  {
    id: 3,
    title: "Corporate Headquarters",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    desc: "Explore a modern office environment.",
  },
  {
    id: 4,
    title: "Fine Dining Restaurant",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    desc: "Experience the ambience before you arrive.",
  },
  {
    id: 5,
    title: "Art Gallery Exhibition",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&q=80&w=800",
    desc: "Browse exhibitions from anywhere in the world.",
  },
  {
    id: 6,
    title: "Mountain Resort Villa",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    desc: "Tour a serene retreat nestled in nature.",
  },
];

/* ── 360° Panorama Viewer ─────────────────────────────────── */

function Panorama() {
  const texture = useTexture(PANORAMA_URL);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[30, 64, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} toneMapped={false} />
    </mesh>
  );
}

function ViewerControls() {
  const ref = useRef();
  useEffect(() => () => { if (ref.current) ref.current.dispose?.(); }, []);

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.4}
      autoRotate
      autoRotateSpeed={0.35}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  );
}

function DragIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 animate-bounce" {...props}>
      <path d="M12 2.5v2" />
      <path d="m8 7.5 4-4 4 4" />
      <rect x="5.5" y="10.5" width="13" height="10" rx="6.5" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Tour Card ────────────────────────────────────────────── */

function TourCard({ tour }) {
  return (
    <div className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 translate-x-[1px]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
        <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
          {tour.category}
        </span>
        <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">
          {tour.title}
        </h3>
        <p className="text-xs mt-1 text-[var(--app-text-secondary)]">{tour.desc}</p>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */

function VirtualTour360() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? tours : tours.filter((t) => t.category === active);

  return (
    <div className="w-full">
      {/* ── Panorama Hero ── */}
      <section className="relative h-[calc(100svh-72px)] min-h-[560px] w-full overflow-hidden">
        <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
          <Canvas
            camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 0.1] }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            flat
          >
            <Suspense fallback={null}>
              <Panorama />
            </Suspense>
            <ViewerControls />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

        {/* Floating info card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-10 lg:px-16">
          <div className="pointer-events-auto mx-auto max-w-xl rounded-2xl border border-white/10 bg-base-100/80 p-6 backdrop-blur-md sm:p-8">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)] mb-3">
              360° Virtual Tour
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-base-content sm:text-4xl md:text-5xl">
              Explore Spaces
              <br />
              <span className="text-[var(--app-text-secondary)]">Like Never Before</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-[var(--app-text-secondary)]">
              Step inside immersive 3D environments. Drag around to look inside the room and discover every detail.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link to="/explore">
                <Button variant="primary">View All Tours</Button>
              </Link>
              <Link to="/create">
                <Button variant="secondary">Create One</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* drag hint */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-white/50">
          <DragIcon />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="w-full border-y border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4 gap-6 px-5 py-10 sm:px-8 lg:px-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-base-content sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs tracking-wide text-[var(--app-text-secondary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              Why ViewRoom
            </span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">
              Built for Immersion
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--app-text-secondary)]">
              Every feature is designed to make virtual tours feel indistinguishable from being there in person.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card border border-[var(--app-border)]/20 bg-base-100 p-6 text-center transition-colors hover:border-base-content/30"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content">
                  {f.icon}
                </div>
                <h3 className="font-heading text-base font-semibold text-base-content">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tour Gallery ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
                Gallery
              </span>
              <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">
                Featured Tours
              </h2>
              <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
                Browse our curated collection of immersive 360° experiences.
              </p>
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
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[var(--app-text-secondary)] py-16">
              No tours found in this category.
            </p>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="w-full border-t border-[var(--app-border)]/15 bg-base-200/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">
            Start Your Virtual Tour Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--app-text-secondary)]">
            Create immersive 360° experiences for your properties, spaces and events. No technical skills required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create">
              <Button variant="primary">Create a Tour</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VirtualTour360;
