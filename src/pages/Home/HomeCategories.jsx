import React, { useState } from "react";

const categories = [
  "All",
  "Factories",
  "Office Spaces",
  "Real Estate",
  "Hotel & Resorts",
  "Documentation",
  "Restaurant",
  "Activities & Events",
  "Showroom",
  "Education",
  "Aerial",
  "Interior",
  "Tourism",
  "Voice Guided Tour",
];

const items = [
  {
    id: 1,
    title: "Novo Nordisk Insulin Unit",
    category: "Factories",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Alo Exhibition | Prothom Alo",
    category: "Activities & Events",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Gazipur Plant | Coats Bangladesh",
    category: "Factories",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Chittagong Plant | Coats Bangladesh",
    category: "Factories",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "GoldenTex Knitting Co. Ltd. | BETTEX China",
    category: "Factories",
    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Jining Aisee Garment Co. Ltd. | BETTEX China",
    category: "Factories",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "BETTEX | China Office",
    category: "Office Spaces",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "BETTEX | Bangladesh Office",
    category: "Office Spaces",
    image:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=800&auto=format&fit=crop",
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

function HomeCategories() {
  const [active, setActive] = useState("All");

  const filteredItems =
    active === "All"
      ? items
      : items.filter((item) => item.category === active);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-10">
      {/* Category pill buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`btn btn-sm sm:btn-md rounded-md font-heading text-[11px] sm:text-xs tracking-wide font-semibold px-4 sm:px-5 border transition-colors duration-200 ${
                isActive
                  ? "bg-base-content text-base-100 border-base-content hover:bg-base-content hover:text-base-100"
                  : "text-base-content border-[var(--app-border)]/40 hover:border-base-content hover:text-base-content"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <PlayIcon />
            </div>
            <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
              <h3 className="font-heading text-sm sm:text-base font-semibold text-center text-base-content">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-[var(--app-text-secondary)] py-16">
          No tours found in this category.
        </p>
      )}
    </section>
  );
}

export default HomeCategories;