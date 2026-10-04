import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
  faAngleRight,
  faTicket,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/reuseable/Button';

function EventsSlider() {
  const sliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState('View all');
  const [savedSpots, setSavedSpots] = useState({});

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

  // Schedule List Data matching User Reference Image 2
  const scheduleCategories = ['View all', 'Virtual Tours', 'Architectural Talks', 'Live Workshops', 'Exhibitions'];

  const scheduleEvents = [
    {
      id: 101,
      category: 'Virtual Tours',
      dayOfWeek: 'Fri',
      dayNum: '09',
      monthYear: 'Feb 2024',
      title: 'LUXURY PENTHOUSE SPATIAL WALKTHROUGH',
      statusBadge: 'Sold out',
      location: 'Grand Ballroom, Cox’s Bazar',
      description: 'Join master photographer Sarah Jenkins as she demonstrates 8K equirectangular spatial scanning techniques.',
    },
    {
      id: 102,
      category: 'Architectural Talks',
      dayOfWeek: 'Sat',
      dayNum: '10',
      monthYear: 'Feb 2024',
      title: 'LIGHTING & SHADOWS IN VIRTUAL REAL ESTATE',
      statusBadge: 'Limited seats',
      location: 'Studio 4, Gulshan, Dhaka',
      description: 'An interactive seminar focusing on ambient occlusion, volumetric lighting, and natural daylight simulation.',
    },
    {
      id: 103,
      category: 'Live Workshops',
      dayOfWeek: 'Sun',
      dayNum: '11',
      monthYear: 'Feb 2024',
      title: 'COMMERCIAL PROPERTY 3D SCAN MASTERCLASS',
      statusBadge: null,
      location: 'Radisson Blu, Chittagong',
      description: 'Hands-on workshop demonstrating floor plan alignment, drone mesh mapping, and Matterport integration.',
    },
    {
      id: 104,
      category: 'Exhibitions',
      dayOfWeek: 'Thu',
      dayNum: '15',
      monthYear: 'Feb 2024',
      title: 'SPATIAL ARCHITECTURE & DIGITAL TWINS SHOWCASE',
      statusBadge: 'Filling fast',
      location: 'Virtual Auditorium & Live Stream',
      description: 'Explore futuristic digital twin models of real estate developments from top South Asian architects.',
    },
  ];

  const filteredSchedule = activeTab === 'View all'
    ? scheduleEvents
    : scheduleEvents.filter((item) => item.category === activeTab);

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

  const toggleSaveSpot = (eventId) => {
    setSavedSpots((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  return (
    <section className="relative w-full bg-base-100 text-base-content transition-colors duration-250 py-20 px-4 sm:px-8 select-none">
      
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* SECTION 1: FEATURED EVENTS CAROUSEL SLIDER */}
        <div>
          {/* SECTION HEADER & TOP-RIGHT CONTROLS */}
          <div className="flex items-end justify-between mb-10 border-b border-base-content/15 pb-6">
            <div className="flex flex-col items-start">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-1">
                FEATURED EXPERIENCE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-base-content">
                LIVE SPATIAL EVENTS
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 font-medium mt-1">
                Walk through spaces with the visionary architects and photographers who built them.
              </p>
            </div>

            {/* TOP RIGHT PREV/NEXT NAVIGATION BUTTONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleScroll('left')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-base-content/20 bg-base-200 text-base-content flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer shadow-sm"
                aria-label="Previous events"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs sm:text-sm" />
              </button>

              <button
                onClick={() => handleScroll('right')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-base-content/20 bg-base-200 text-base-content flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary active:scale-95 cursor-pointer shadow-sm"
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
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col justify-between p-4 rounded-3xl bg-base-200/50 border border-base-content/10 hover:border-primary/40 transition-all shadow-sm"
              >
                {/* IMAGE CONTAINER WITH BADGE */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* FLOATING TOP-RIGHT BADGE */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full border border-white/60 bg-black/50 backdrop-blur-md text-xs font-bold text-white tracking-wide">
                    {item.badge}
                  </span>
                </div>

                {/* EVENT DETAILS */}
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    {/* DATE & LOCATION META */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-base-content/70 mb-2">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="text-primary text-xs" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faLocationDot} className="text-primary text-xs" />
                        {item.location}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-base-content mb-1.5">
                      {item.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-base-content/70 font-normal leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* VIEW EVENT LINK */}
                  <a
                    href="#view-event"
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                    style={{ cursor: 'pointer' }}
                  >
                    <span>View event details</span>
                    <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: EVENT SCHEDULE LIST (Matching User Reference Image 2) */}
        <div className="pt-8 border-t border-base-content/15">
          
          {/* CATEGORY FILTER PILLS */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {scheduleCategories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border ${
                    isActive
                      ? 'bg-base-content text-base-100 border-base-content shadow-md scale-105'
                      : 'bg-base-200/80 text-base-content/70 border-base-content/20 hover:border-base-content hover:text-base-content'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* LIST OF EVENT CARDS */}
          <div className="space-y-4">
            {filteredSchedule.map((ev) => {
              const isSaved = savedSpots[ev.id];
              return (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-base-100 border-2 border-base-content/20 hover:border-base-content/40 transition-all duration-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* LEFT DATE COLUMN WITH SEPARATOR BAR */}
                  <div className="flex items-center gap-4 shrink-0 pr-4 md:border-r border-base-content/20 min-w-[140px]">
                    <div className="flex flex-col text-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                        {ev.dayOfWeek}
                      </span>
                      <span className="text-3xl font-black text-base-content leading-none my-0.5">
                        {ev.dayNum}
                      </span>
                      <span className="text-[11px] font-extrabold text-base-content/60">
                        {ev.monthYear}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE CONTENT */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-heading font-black text-base sm:text-lg uppercase tracking-tight text-base-content">
                        {ev.title}
                      </h3>
                      {ev.statusBadge && (
                        <span className="px-3 py-0.5 rounded-full border border-base-content/30 bg-base-200 text-base-content font-extrabold text-[10px] uppercase">
                          {ev.statusBadge}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-base-content/60 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faLocationDot} className="text-primary text-[11px]" />
                      <span>{ev.location}</span>
                    </div>

                    <p className="text-xs text-base-content/70 font-normal leading-relaxed max-w-2xl">
                      {ev.description}
                    </p>
                  </div>

                  {/* RIGHT ACTION BUTTON (3D PILL BUTTON) */}
                  <div className="shrink-0 w-full md:w-auto">
                    <Button
                      variant={isSaved ? "primary" : "secondary"}
                      onClick={() => toggleSaveSpot(ev.id)}
                      className="w-full md:w-auto px-6 py-3 text-xs"
                    >
                      <FontAwesomeIcon icon={isSaved ? faCheckCircle : faTicket} className="mr-2" />
                      {isSaved ? "Spot Reserved!" : "Save my spot"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
}

export default EventsSlider;