import React, { useState, useEffect } from 'react';

const galleryItems = [
  // Left Column
  { id: 1, title: 'Living Space', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-square', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Master Bedroom', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-square', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800' },

  // Center Column (Top Small, Middle Small, Bottom Large)
  { id: 3, title: 'Kitchen Area', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-[4/3]', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Dining Space', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-[4/3]', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Balcony View', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-square md:aspect-[4/5]', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },

  // Right Column
  { id: 6, title: 'Modern Bathroom', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-square', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'Home Office', colSpan: 'col-span-12 md:col-span-4', aspect: 'aspect-square', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800' },
];

// Pure SVG Icon Components
function ImageIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Gallery() {
  const [activeItem, setActiveItem] = useState(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveItem(null);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = galleryItems.findIndex((i) => i.id === activeItem.id);
        const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        setActiveItem(galleryItems[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = galleryItems.findIndex((i) => i.id === activeItem.id);
        const nextIndex = (currentIndex + 1) % galleryItems.length;
        setActiveItem(galleryItems[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeItem]);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!activeItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setActiveItem(galleryItems[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!activeItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setActiveItem(galleryItems[nextIndex]);
  };

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-[var(--app-text-primary)]">
            WALK THROUGH
          </h2>
          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium">
            Every image is a door. Step through and look around.
          </p>
        </div>

        {/* 3-Column Asymmetric Grid Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          
          {/* Left Column (2 Large Cards) */}
          <div className="flex flex-col gap-5">
            {[galleryItems[0], galleryItems[1]].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-800/80 dark:bg-zinc-800/90 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Fallback Icon Overlay if image is loading */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <ImageIcon className="w-10 h-10 text-white opacity-80" />
                </div>
              </div>
            ))}
          </div>

          {/* Center Column (2 Small Rectangles + 1 Tall/Square Card) */}
          <div className="flex flex-col gap-5">
            {[galleryItems[2], galleryItems[3]].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800/80 dark:bg-zinc-800/90 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <ImageIcon className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>
            ))}

            {/* Bottom Card in Center Column */}
            <div
              onClick={() => setActiveItem(galleryItems[4])}
              className="group relative w-full aspect-square sm:aspect-[4/4.5] rounded-2xl overflow-hidden bg-zinc-800/80 dark:bg-zinc-800/90 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
            >
              <img
                src={galleryItems[4].img}
                alt={galleryItems[4].title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                <ImageIcon className="w-10 h-10 text-white opacity-80" />
              </div>
            </div>
          </div>

          {/* Right Column (2 Large Cards) */}
          <div className="flex flex-col gap-5">
            {[galleryItems[5], galleryItems[6]].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-800/80 dark:bg-zinc-800/90 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <ImageIcon className="w-10 h-10 text-white opacity-80" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        >
          {/* Top Bar / Close Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-3">
            <button
              onClick={() => setActiveItem(null)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg hover:scale-105 active:scale-95"
              aria-label="Close Preview"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg hover:scale-105 active:scale-95"
            aria-label="Previous Image"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg hover:scale-105 active:scale-95"
            aria-label="Next Image"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Center Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[88vh] w-full flex flex-col items-center justify-center"
          >
            <img
              src={activeItem.img}
              alt={activeItem.title}
              className="max-h-[74vh] sm:max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
            />
            {/* Title & Counter */}
            <div className="mt-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide shadow-md">
              <span className="uppercase">{activeItem.title}</span>
              <span className="opacity-40">•</span>
              <span className="text-white/70 text-xs">
                {galleryItems.findIndex((i) => i.id === activeItem.id) + 1} / {galleryItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;