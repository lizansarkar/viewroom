import React, { useState, useRef } from 'react';
import Button from '../../components/reuseable/Button';

function ClockIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3" />
      <path d="M2 12h20M12 2v20" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Benefits() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Toggle Video Play / Pause on user click
  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Text Content & Benefits */}
        <div className="lg:col-span-6 flex flex-col items-start">
          
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)] mb-4">
            BENEFITS
          </span>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6 text-[var(--app-text-primary)]">
            KNOW THE TRUTH <br />
            BEFORE YOU ARRIVE
          </h2>

          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed max-w-xl mb-8">
            Photos lie. A panorama does not. Walk the actual floor, see the real light and understand the true scale of a place before you commit to it.
          </p>

          {/* Benefits Points */}
          <div className="flex flex-col gap-5 mb-10 w-full">
            <div className="flex items-center gap-3">
              <ClockIcon />
              <span className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)]">
                Save time on visits that never should have happened
              </span>
            </div>

            <div className="flex items-center gap-3">
              <EyeIcon />
              <span className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)]">
                See the real layout, not a wide-angle illusion
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MoveIcon />
              <span className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)]">
                Move through rooms at your own pace
              </span>
            </div>
          </div>

          {/* Reusable Custom Buttons (Primary & Secondary Variant) */}
          <div className="flex items-center gap-4">
            <Button variant="primary">
              Start
            </Button>
            
            <Button variant="secondary" className="flex items-center gap-2">
              <span>Explore</span>
              <span className="text-base">&gt;</span>
            </Button>
          </div>

        </div>

        {/* RIGHT COLUMN: Video Player Viewport */}
        <div 
          onClick={handleVideoToggle}
          className="lg:col-span-6 w-full h-[320px] sm:h-[420px] lg:h-[480px] relative rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl flex items-center justify-center group cursor-pointer"
        >
          {/* Video Container */}
          <video
            ref={videoRef}
            src="/video/home.mp4"
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-3xl"
          />

          {/* Play Button Overlay (Visible when Video is Paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-all duration-300 group-hover:bg-black/30">
              <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-2xl bg-white/60 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-black/80 transition-all duration-300 shadow-2xl">
                <PlayIcon />
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default Benefits;