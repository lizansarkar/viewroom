import React from "react";
import Button from "../../components/reuseable/Button";

const propertyData = [
  {
    id: 1,
    title: "The Glass Pavilion Penthouse",
    tag: "360° Tour • 4 Rooms",
    price: "Free",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Horizon Coastal Villa",
    tag: "360° Tour • Oceanfront",
    price: "Free",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Metropolitan Luxury Hotel",
    tag: "360° Tour • Boutique Suite",
    price: "Free",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Minimalist Skyline Loft",
    tag: "360° Tour • Open Space",
    price: "Free",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Alpine Mountain Sanctuary",
    tag: "360° Tour • 5 Rooms",
    price: "Free",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Architectural Design Studio",
    tag: "360° Tour • Creative Studio",
    price: "Free",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
  },
];

function Properties() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              PROPERTIES
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              SPACES
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Walk through homes, hotels and rooms before you go.
            </p>
          </div>

          <Button variant="primary">
            View all
          </Button>
        </div>

        {/* 3 Columns x 2 Rows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between group cursor-pointer p-4 sm:p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-md hover:border-[var(--app-border)]/60 transition-all duration-300"
            >
              {/* Card Image Container */}
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden mb-4 bg-base-200 shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* 360 Badge Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-bold tracking-wider text-white uppercase">
                    360° TOUR
                  </span>
                </div>
              </div>

              {/* Title & Price Info */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase">
                  {item.title}
                </h3>
                <span className="text-sm font-bold text-[var(--app-text-primary)]">
                  {item.price}
                </span>
              </div>

              {/* Sub-tag */}
              <span className="text-xs text-[var(--app-text-secondary)] font-medium mb-4 block">
                {item.tag}
              </span>

              {/* Explore Button */}
              <div>
                <Button variant="secondary" className="w-full">
                  <span>Explore 360°</span>
                  <span className="text-sm ml-1">→</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Properties;