import React from "react";
import Button from "../../components/reuseable/Button";

const TOUR_PROPERTIES = [
  {
    id: 1,
    title: "The Glass Pavilion Penthouse",
    tag: "360° Tour • 4 Rooms",
    details: "4,200 sq ft • Floor 42",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Horizon Coastal Villa",
    tag: "360° Tour • 6 Rooms",
    details: "6,500 sq ft • Oceanfront",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "The Grand Metropolitan Hotel",
    tag: "360° Tour • 8 Suites",
    details: "Luxury Resort • Boutique",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Industrial Design Studio",
    tag: "360° Tour • Open Loft",
    details: "3,100 sq ft • Creative Workspace",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Minimalist Alpine Sanctuary",
    tag: "360° Tour • 5 Rooms",
    details: "5,400 sq ft • Mountain View",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Skyline Duplex Loft",
    tag: "360° Tour • 3 Rooms",
    details: "2,800 sq ft • Downtown",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
  },
];

function VirtualTourShowcase() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              CURATED VIRTUAL TOURS
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              FEATURED SPACES
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Walk through real estate homes, luxury hotels, and commercial venues.
            </p>
          </div>

          <Button variant="primary">
            View All Tours
          </Button>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOUR_PROPERTIES.map((item) => (
            <div key={item.id} className="flex flex-col group cursor-pointer">
              {/* Card Image */}
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden mb-4 bg-base-200 shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* 360 Badge */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="text-xs font-bold tracking-wider text-white uppercase">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Title & Details */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase">
                  {item.title}
                </h3>
              </div>

              <span className="text-xs text-[var(--app-text-secondary)] font-medium mb-3 block">
                {item.details}
              </span>

              {/* Action Button */}
              <div>
                <Button variant="secondary" className="w-full">
                  <span>Explore Tour 360°</span>
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

export default VirtualTourShowcase;
