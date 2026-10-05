import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faExpand,
  faLocationDot,
  faUser,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/reuseable/Button';

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
      client: 'Sayeman Beach Resort',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      span: 'row-span-2',
    },
    {
      id: 2,
      category: 'PRODUCT',
      title: 'Flatlay Collection Showcase',
      location: 'Dhaka, Bangladesh',
      client: 'Aarong Leather Studio',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 3,
      category: 'AERIAL',
      title: 'Commercial Zone Top View',
      location: 'Sylhet, Bangladesh',
      client: 'North East Horizon',
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 4,
      category: 'INDUSTRIAL',
      title: 'Architectural Brick Samples',
      location: 'Chittagong, Bangladesh',
      client: 'KSRM Steel Industry',
      image:
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 5,
      category: 'INDUSTRIAL',
      title: 'Garments Production Floor',
      location: 'Gazipur, Bangladesh',
      client: 'Ha-Meem Group Ltd.',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 6,
      category: 'PRODUCT',
      title: 'Product Packaging Shoot',
      location: 'Studio Session',
      client: 'Shajgoj Beauty Bar',
      image:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 7,
      category: 'LIFESTYLE',
      title: 'Handcrafted Earring Editorial',
      location: 'Dhaka, Bangladesh',
      client: 'Crafts of Bengal',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      span: 'row-span-2',
    },
    {
      id: 8,
      category: 'HOTEL & RESORTS',
      title: 'Night View Poolside Experience',
      location: 'Cox’s Bazar, Bangladesh',
      client: 'Ocean Paradise Hotel',
      image:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 9,
      category: 'REAL ESTATE',
      title: 'Modern Terrace Garden Architecture',
      location: 'Dhaka, Bangladesh',
      client: 'Shanta Holdings Ltd.',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      span: 'row-span-1',
    },
    {
      id: 10,
      category: 'HOTEL & RESORTS',
      title: 'Sunset Beach Frontage',
      location: 'Cox’s Bazar, Bangladesh',
      client: 'Long Beach Resort',
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
    <section className="relative w-full min-h-screen bg-base-100 text-base-content transition-colors duration-250 py-16 px-4 sm:px-8 select-none">

      {/* 1. TOP CATEGORY BUTTONS */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-300 rounded-md border ${isActive
                    ? 'bg-primary text-white border-primary shadow-md scale-105'
                    : 'bg-base-200/80 text-base-content/70 border-base-content/15 hover:border-primary hover:text-base-content hover:bg-base-200'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[240px]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group relative overflow-hidden rounded-3xl border border-base-content/10 shadow-md cursor-pointer ${item.span} transition-all duration-300 hover:shadow-2xl hover:border-primary/40`}
              style={{ cursor: 'pointer' }}
            >
              {/* VIBRANT CRISP IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* SLEEK GLASSMORPHIC HOVER CAPTION BADGE WITH ALL-WHITE HIGH CONTRAST TEXT */}
              <div className="absolute inset-x-3 bottom-3 z-10 p-3.5 rounded-2xl bg-black/80 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: '#ffffff' }}>
                  {item.category}
                </span>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight truncate mb-1" style={{ color: '#ffffff' }}>
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] font-semibold mt-1.5 border-t border-white/20 pt-1.5" style={{ color: '#ffffff' }}>
                  <span className="flex items-center gap-1.5 truncate" style={{ color: '#ffffff' }}>
                    <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" style={{ color: '#ffffff' }} />
                    {item.location}
                  </span>
                  <span className="shrink-0 flex items-center gap-1 font-extrabold" style={{ color: '#ffffff' }}>
                    <FontAwesomeIcon icon={faExpand} className="text-[10px]" style={{ color: '#ffffff' }} /> View
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. LIGHT/DARK THEME COMPATIBLE LUXURY MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 transition-all duration-300 animate-in fade-in">

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-lg transition-all z-50 cursor-pointer shadow-xl"
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {/* MODAL CONTENT CONTAINER */}
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-white/95 dark:bg-base-200/95 backdrop-blur-2xl border border-white/40 dark:border-base-content/20 rounded-3xl shadow-2xl overflow-hidden text-base-content">

            {/* LARGE IMAGE PREVIEW */}
            <div className="w-full md:w-2/3 h-[45vh] md:h-auto bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* DETAILS PANEL */}
            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-base-100/80 dark:bg-base-200/80 backdrop-blur-md text-base-content border-t md:border-t-0 md:border-l border-base-content/15">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                  {selectedItem.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-base-content mb-2">
                  {selectedItem.title}
                </h2>

                <div className="space-y-3 my-6 text-xs text-base-content/80 border-y border-base-content/15 py-4">
                  <div className="flex justify-between items-center">
                    <span className="opacity-70 font-medium flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUser} className="text-primary text-[11px]" /> Client Name:
                    </span>
                    <span className="font-extrabold text-base-content">{selectedItem.client}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70 font-medium flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faLocationDot} className="text-primary text-[11px]" /> Location:
                    </span>
                    <span className="font-extrabold text-base-content">{selectedItem.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70 font-medium flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCamera} className="text-primary text-[11px]" /> Format:
                    </span>
                    <span className="font-extrabold text-base-content">Ultra HD 8K Spatial Capture</span>
                  </div>
                </div>

                <p className="text-xs text-base-content/70 leading-relaxed font-normal">
                  High-resolution spatial capture providing full visual coverage and structural clarity for visual documentation and virtual showcases.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 text-xs"
                >
                  Close Details
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

export default VirtualGallery;