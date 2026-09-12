import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faExpand,
  faBuilding,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

function VirtualGallery() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    'ALL',
    'INDUSTRIAL',
    'AERIAL',
    'PRODUCT',
    'HOTEL & RESORTS',
    'LIFESTYLE',
    'FOOD',
    'REAL ESTATE',
  ];

  const galleryData = [
    {
      id: 1,
      category: 'HOTEL & RESORTS',
      title: 'Grand Dome Lobby & Interior',
      location: 'Cox’s Bazar, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      span: 'row-span-2',
    },
    {
      id: 2,
      category: 'PRODUCT',
      title: 'Flatlay Collection Showcase',
      location: 'Dhaka, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 3,
      category: 'AERIAL',
      title: 'Commercial Zone Top View',
      location: 'Sylhet, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 4,
      category: 'INDUSTRIAL',
      title: 'Architectural Brick Samples',
      location: 'Chittagong, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 5,
      category: 'INDUSTRIAL',
      title: 'Garments Production Floor',
      location: 'Gazipur, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 6,
      category: 'PRODUCT',
      title: 'Product Packaging Shoot',
      location: 'Studio Session',
      image:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 7,
      category: 'LIFESTYLE',
      title: 'Handcrafted Earring Editorial',
      location: 'Dhaka, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      span: 'row-span-2',
    },
    {
      id: 8,
      category: 'HOTEL & RESORTS',
      title: 'Night View Poolside Experience',
      location: 'Cox’s Bazar, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 9,
      category: 'REAL ESTATE',
      title: 'Modern Terrace Garden Architecture',
      location: 'Dhaka, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 10,
      category: 'HOTEL & RESORTS',
      title: 'Sunset Beach Frontage',
      location: 'Cox’s Bazar, Bangladesh',
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? galleryData
      : galleryData.filter((item) => item.category === activeCategory);

  return (
    <section className="relative w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 px-4 sm:px-8 select-none">
      
      {/* 1. TOP CATEGORY BUTTONS */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-md ${
                  isActive
                    ? 'bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)] shadow-md scale-105'
                    : 'bg-[var(--app-text-primary)]/5 text-[var(--app-text-secondary)] border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/50 hover:text-[var(--app-text-primary)]'
                }`}
                style={{ cursor: 'pointer' }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GALLERY GRID SECTION */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group relative overflow-hidden cursor-pointer ${item.span}`}
              style={{ cursor: 'pointer' }}
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* HOVER OVERLAY WITH DATA */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  {item.category}
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-tight text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 mb-3">
                  {item.location}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-bold text-white tracking-wider border-t border-white/20 pt-2">
                  <FontAwesomeIcon icon={faExpand} className="text-xs" />
                  <span>VIEW DETAILS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BLUR MODAL FOR DETAILS */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 transition-all duration-300">
          
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 text-white text-xl p-3 bg-white/10 hover:bg-white/20 border border-white/20 transition-all z-50"
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {/* MODAL CONTENT BOX */}
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
            
            {/* LARGE IMAGE PREVIEW */}
            <div className="w-full md:w-2/3 h-[45vh] md:h-auto bg-black relative flex items-center justify-center">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* DETAILS PANEL */}
            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-zinc-900 text-white border-t md:border-t-0 md:border-l border-zinc-800">
              <div>
                <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 text-[9px] font-black uppercase tracking-widest text-zinc-300 mb-4">
                  {selectedItem.category}
                </span>

                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                  {selectedItem.title}
                </h2>

                <div className="space-y-3 my-6 text-xs text-zinc-300 border-y border-zinc-800 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Client Name:</span>
                    <span className="font-bold text-white">{selectedItem.client}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Location:</span>
                    <span className="font-bold text-white">{selectedItem.location}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  High-resolution spatial capture providing full visual coverage and structural clarity for visual documentation.
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 mt-6 bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

export default VirtualGallery;