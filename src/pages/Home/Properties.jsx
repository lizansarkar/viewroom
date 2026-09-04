import React from 'react';
import Button from '../../components/reuseable/Button';

const propertyData = [
  {
    id: 1,
    title: "Modern Residence",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Harbor Apartment",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "The Grand Hotel",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Modern Residence",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Harbor Apartment",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "The Grand Hotel",
    tag: "360°",
    price: "Free",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
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
            <div key={item.id} className="flex flex-col group">
              {/* Card Image */}
              <div className="w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden mb-4 bg-base-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Price Info */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight">
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
              <Button variant="secondary" className="">
                <span>Explore 360°</span>
                <span className="text-sm">→</span>
              </Button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Properties;