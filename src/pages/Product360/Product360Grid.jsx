import React from "react";
import Button from "../../components/reuseable/Button";

const PRODUCT_ITEMS = [
  {
    id: 1,
    title: "Aero Chronograph 360",
    tag: "8K 360° Spin",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Spatial Audio Headset",
    tag: "360° + AR Model",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Eames Silhouette Lounge",
    tag: "360° Spin",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Cinema Drone X8",
    tag: "3D Object Capture",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Pro Mirrorless System",
    tag: "8K 360° Spin",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Craftsman Leather Boots",
    tag: "360° Spin",
    status: "Studio Ready",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
  },
];

function Product360Grid() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              CATALOG GALLERY
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              FEATURED 360° OBJECTS
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Explore high-fidelity 360° product photography created for leading brands.
            </p>
          </div>

          <Button variant="primary">
            View All Products
          </Button>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCT_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col group cursor-pointer">
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
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Title & Status */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase">
                  {item.title}
                </h3>
                <span className="text-xs font-semibold text-[var(--app-text-secondary)]">
                  {item.status}
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <Button variant="secondary" className="w-full">
                  <span>Spin 360°</span>
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

export default Product360Grid;
