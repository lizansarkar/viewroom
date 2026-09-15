import React, { useState } from "react";

const categories = ["All", "Real Estate", "Hospitality", "Events", "Tourism"];

const videos = [
  {
    id: 1,
    title: "Penthouse Walkthrough",
    category: "Real Estate",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    duration: "2:34",
  },
  {
    id: 2,
    title: "Resort Poolside Tour",
    category: "Hospitality",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    duration: "3:12",
  },
  {
    id: 3,
    title: "Music Festival Coverage",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
    duration: "4:48",
  },
  {
    id: 4,
    title: "Historic Cathedral Tour",
    category: "Tourism",
    image:
      "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800",
    duration: "5:20",
  },
  {
    id: 5,
    title: "Beachfront Villa Preview",
    category: "Real Estate",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    duration: "3:55",
  },
  {
    id: 6,
    title: "Mountain Lodge Experience",
    category: "Tourism",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=800",
    duration: "6:10",
  },
];

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/80 bg-black/10 backdrop-blur-[1px] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="h-6 w-6 sm:h-7 sm:w-7 translate-x-[1px]"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

function Video360RecentVideos() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? videos : videos.filter((v) => v.category === active);

  return (
    <section className="w-full bg-base-100 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="w-full flex justify-between gap-6 sm:gap-8 lg:gap-10">
          {/* Heading — matched to the label + big-heading pattern used across the other sections */}
          <div className="mb-10 sm:mb-12">
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
              Showcase
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-base-content">
              Recent Videos
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[var(--app-text-secondary)] max-w-xl leading-relaxed">
              Explore our latest immersive 360° productions.
            </p>
          </div>

          {/* Category pills — same rounded-full pattern as HomeCategories.jsx */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`btn btn-sm sm:btn-md rounded-md font-heading text-[11px] sm:text-xs tracking-wide uppercase font-semibold px-4 sm:px-5 border-none transition-colors duration-200 ${
                    isActive
                      ? "bg-base-content text-base-100 hover:bg-base-content hover:text-base-100"
                      : "bg-base-200 text-base-content hover:bg-base-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video grid — left exactly as before */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
                <img
                  src={v.image}
                  alt={v.title}
                  className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <PlayIcon />
                <span className="absolute bottom-3 left-3 z-10 rounded-md bg-base-100/80 px-2 py-0.5 text-[10px] font-semibold text-base-content backdrop-blur-sm">
                  {v.duration}
                </span>
              </div>
              <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
                <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
                  {v.category}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">
                  {v.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--app-text-secondary)] py-16">
            No videos found in this category.
          </p>
        )}
      </div>
    </section>
  );
}

export default Video360RecentVideos;
