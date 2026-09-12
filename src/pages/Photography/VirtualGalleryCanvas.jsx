import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

function EventsSlider() {
  const sliderRef = useRef(null);

  const eventsData = [
    {
      id: 1,
      badge: "Tour",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      date: "Sun 11 Feb 2024",
      location: "Online",
      title: "MODERN RESIDENCE WALKTHROUGH",
      description: "Step inside a three-bedroom home with the architect who designed it.",
    },
    {
      id: 2,
      badge: "Talk",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      date: "Sun 18 Feb 2024",
      location: "Sydney",
      title: "THE HONEST HOTEL",
      description: "A live look at how hotels use 360° to show real rooms.",
    },
    {
      id: 3,
      badge: "Workshop",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      date: "Thu 22 Feb 2024",
      location: "Berlin",
      title: "LIGHTING IN SPATIAL DESIGN",
      description: "Exploring mood lighting and natural daylight mapping techniques.",
    },
    {
      id: 4,
      badge: "Tour",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      date: "Fri 01 Mar 2024",
      location: "Los Angeles",
      title: "GLASS VILLA EXPERIENCE",
      description: "A guided walkthrough of luxury glass architecture and interiors.",
    },
    {
      id: 5,
      badge: "Talk",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      date: "Tue 12 Mar 2024",
      location: "Tokyo",
      title: "FUTURE OF VIRTUAL TOURS",
      description: "How 3D spatial scanning is transforming modern real estate marketing.",
    },
  ];

  // Horizontal Slide Control
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-20 px-6 sm:px-12 select-none">
      
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-12 flex flex-col items-center">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[var(--app-text-secondary)] mb-2">
          LIVE
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] mb-4">
          EVENTS
        </h2>
        <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium max-w-xl">
          Walk through spaces with the people who built them.
        </p>
      </div>

      {/* SLIDER CONTAINER WITH NAVIGATION ARROWS */}
      <div className="max-w-7xl mx-auto relative group">
        
        {/* PREV BUTTON */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--app-text-primary)] text-[var(--app-background)] flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 cursor-pointer"
          style={{ cursor: 'pointer' }}
          aria-label="Previous events"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
        </button>

        {/* NEXT BUTTON */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--app-text-primary)] text-[var(--app-background)] flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 cursor-pointer"
          style={{ cursor: 'pointer' }}
          aria-label="Next events"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </button>

        {/* 3 CARDS HORIZONTAL SCROLL TRACK */}
        <div
          ref={sliderRef}
          className="w-full flex items-stretch gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {eventsData.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col justify-between"
            >
              {/* IMAGE CONTAINER WITH BADGE */}
              <div className="relative w-full aspect-[16/10] bg-zinc-800 rounded-xl overflow-hidden mb-5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* FLOATING TOP-RIGHT BADGE */}
                <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full border border-white/80 bg-black/40 backdrop-blur-md text-xs font-semibold text-white tracking-wide">
                  {item.badge}
                </span>
              </div>

              {/* EVENT DETAILS */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  {/* DATE & LOCATION META */}
                  <div className="flex items-center gap-4 text-xs font-medium text-[var(--app-text-secondary)] mb-3">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                      {item.location}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] mb-2">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-normal leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* VIEW EVENT LINK */}
                <a
                  href="#view-event"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--app-text-primary)] hover:opacity-80 transition-opacity"
                  style={{ cursor: 'pointer' }}
                >
                  <span>View event</span>
                  <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

export default EventsSlider;