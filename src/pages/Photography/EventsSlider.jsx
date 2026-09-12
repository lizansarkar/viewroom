import React, { useRef, useEffect } from 'react';
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

  // Horizontal Scroll Controller
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

      if (direction === 'right') {
        if (sliderRef.current.scrollLeft >= maxScroll - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (sliderRef.current.scrollLeft <= 10) {
          sliderRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  // Autoplay functionality (Loop every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      handleScroll('right');
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-20 px-6 sm:px-12 select-none">
      
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER & TOP-RIGHT CONTROLS */}
        <div className="flex items-end justify-between mb-12 border-b border-[var(--app-text-secondary)]/10 pb-6">
          {/* LEFT HEADER CONTENT */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[var(--app-text-secondary)] mb-2">
              LIVE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--app-text-primary)] mb-2">
              EVENTS
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium">
              Walk through spaces with the people who built them.
            </p>
          </div>

          {/* TOP RIGHT PREV/NEXT NAVIGATION BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--app-text-secondary)]/20 bg-[var(--app-text-primary)]/5 text-[var(--app-text-primary)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--app-text-primary)] hover:text-[var(--app-background)] active:scale-95 cursor-pointer"
              style={{ cursor: 'pointer' }}
              aria-label="Previous events"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs sm:text-sm" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--app-text-secondary)]/20 bg-[var(--app-text-primary)]/5 text-[var(--app-text-primary)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--app-text-primary)] hover:text-[var(--app-background)] active:scale-95 cursor-pointer"
              style={{ cursor: 'pointer' }}
              aria-label="Next events"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

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