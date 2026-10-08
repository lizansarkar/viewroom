import React, { useState, useEffect } from "react";

const CATEGORIES = ["All", "Real Estate", "Hospitality", "Museum & Heritage"];

const VIDEOS = [
  {
    id: 1,
    title: "Luxury Penthouse Walkthrough",
    category: "Real Estate",
    youtubeId: "ngn-S4qxjR0",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    duration: "3:40",
    tag: "4K Virtual Tour",
  },
  {
    id: 2,
    title: "Modern Villa 360° Walkthrough",
    category: "Real Estate",
    youtubeId: "wqIHQ1gumNI",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    duration: "4:15",
    tag: "360° VR Tour",
  },
  {
    id: 3,
    title: "Resort & Waterfront Living Tour",
    category: "Hospitality",
    youtubeId: "ROjx96zM9LM",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    duration: "3:12",
    tag: "Interactive Tour",
  },
  {
    id: 4,
    title: "Coastal Dream Estate Virtual Tour",
    category: "Real Estate",
    youtubeId: "d__GaVTyRv0",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    duration: "2:50",
    tag: "Spatial Audio",
  },
  {
    id: 5,
    title: "Historic Museum 8K Walkthrough",
    category: "Museum & Heritage",
    youtubeId: "xZUd8wh7oM0",
    image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800",
    duration: "5:20",
    tag: "8K Virtual Tour",
  },
  {
    id: 6,
    title: "Contemporary Interior & Studio Tour",
    category: "Museum & Heritage",
    youtubeId: "QCaq7LobVvI",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    duration: "4:30",
    tag: "Interior 360°",
  },
];

function Video360RecentVideos() {
  const [active, setActive] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Close modal on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    if (selectedVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  const filtered =
    active === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === active);

  return (
    <section className="w-full bg-base-100 px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
              Showcase
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight tracking-tight text-base-content">
              Recent 360° Virtual Tours
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--app-text-secondary)] max-w-xl">
              Explore immersive 360° spaces. Click any virtual tour to enter the cinema-grade viewer.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`btn btn-md rounded-lg font-heading text-xs tracking-wide uppercase font-semibold px-4 border-none transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-base-content text-base-100 shadow-sm"
                      : "bg-base-200 text-base-content hover:bg-base-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className="card group border border-[var(--app-border)] bg-base-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-base-300">
                <img
                  src={v.image}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* 360 Quality Tag Badge */}
                <span className="absolute top-3 right-3 z-10 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                  {v.tag}
                </span>

                {/* Duration */}
                <span className="absolute bottom-3 left-3 z-10 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white border border-white/10">
                  {v.duration}
                </span>

                {/* Interactive Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/20 backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 text-white translate-x-[1px]"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 flex items-center justify-between border-t border-[var(--app-border)]/20">
                <div>
                  <span className="badge badge-outline text-[10px] mb-1.5 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
                    {v.category}
                  </span>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content group-hover:opacity-80 transition-opacity">
                    {v.title}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-base-content/60 group-hover:text-base-content transition-colors">
                  <span>360°</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--app-text-secondary)] py-16">
            No virtual tours found in this category.
          </p>
        )}
      </div>

      {/* 360° Cinema Interactive Modal (Large Screen Size) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-6xl xl:max-w-7xl max-h-[96vh] bg-base-100 rounded-2xl sm:rounded-3xl shadow-2xl border border-[var(--app-border)]/30 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[var(--app-border)]/20 bg-base-200/50">
              <div className="flex items-center gap-3">
                <span className="badge badge-sm font-bold bg-base-content text-base-100">
                  {selectedVideo.category}
                </span>
                <h3 className="font-heading text-base sm:text-xl font-bold text-base-content truncate max-w-sm sm:max-w-xl">
                  {selectedVideo.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close modal"
                className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal 360 Video Player (Large Cinema Width & Height) */}
            <div className="relative w-full aspect-video max-h-[76vh] bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer / 360 Guidance */}
            <div className="px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-base-200/40 text-xs text-[var(--app-text-secondary)]">
              <div className="flex items-center gap-2 font-medium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-base-content">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <span>360° Virtual Tour: মাউস বা আঙুল দিয়ে ড্র্যাগ করে চারপাশ ঘুরে দেখুন।</span>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-base-content hover:underline"
              >
                <span>YouTube এ দেখুন</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Video360RecentVideos;
