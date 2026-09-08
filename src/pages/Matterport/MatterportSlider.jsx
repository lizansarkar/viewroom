import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper Styles Import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Unsplash থেকে হাই-কোয়ালিটি আর্কিটেকচার/ইন্টেরিয়র রিয়েল ছবিসমূহ
const sliderItems = [
  {
    id: 1,
    title: 'Modern Living Room',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Minimalist Interior',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Luxury Villa Space',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Contemporary Kitchen',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Spacious Bedroom',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Elegant Corridor',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
  },
];

function MatterportSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 px-6 sm:px-12 lg:px-20 overflow-hidden">
      
      {/* Custom Swiper Bullet Style */}
      <style>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          background: var(--app-text-secondary);
          opacity: 0.3;
          width: 7px;
          height: 7px;
          margin: 0 4px !important;
          transition: all 0.3s ease;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background: var(--app-text-primary);
          opacity: 1;
          width: 8px;
          height: 8px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-3 text-[var(--app-text-primary)]">
            STEP THROUGH
          </h2>
          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium">
            Every image is a door. Step through and look around.
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="relative w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{
              el: '.custom-swiper-pagination',
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4.1,
                spaceBetween: 24,
              },
            }}
            className="w-full !overflow-visible"
          >
            {sliderItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="w-full aspect-square rounded-2xl bg-zinc-900 flex items-center justify-center overflow-hidden cursor-pointer hover:border-zinc-500 transition-all duration-300 group shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between mt-8 pt-2">
            
            {/* Custom Pagination Dots */}
            <div className="custom-swiper-pagination flex items-center"></div>

            {/* Custom Circular Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                ref={prevRef}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-full border border-[var(--app-text-primary)]/40 hover:border-[var(--app-text-primary)] flex items-center justify-center text-[var(--app-text-primary)] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span className="text-lg leading-none mb-0.5">&larr;</span>
              </button>

              <button
                ref={nextRef}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-full border border-[var(--app-text-primary)]/40 hover:border-[var(--app-text-primary)] flex items-center justify-center text-[var(--app-text-primary)] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span className="text-lg leading-none mb-0.5">&rarr;</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default MatterportSlider;