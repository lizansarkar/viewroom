import React, { useRef, useEffect } from 'react';
import Button from '../../components/reuseable/Button';

function Video360Hero() {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // YouTube Video Embed URL (Autoplay, Mute, Loop, Enable JS API)
  const embedUrl =
    'https://www.youtube.com/embed/FXDjMJJDbqo?autoplay=1&mute=1&loop=1&playlist=FXDjMJJDbqo&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1';

  // IntersectionObserver to handle Scroll Pause & Play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!iframeRef.current || !iframeRef.current.contentWindow) return;

        if (entry.isIntersecting) {
          // Play video when visible on screen
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        } else {
          // Pause video when scrolled away
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
            '*'
          );
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 select-none">
      
      {/* 1. TOP VIDEO SECTION (FULL WIDTH - AUTOPLAYS IMMEDIATELY) */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video sm:aspect-[21/9] lg:h-[70vh]"
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Matterport Demo Video"
          className="w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 2. BOTTOM TEXT & BUTTONS CONTENT SECTION */}
      <div className="w-full bg-[var(--app-background)] py-12 sm:py-20 px-6 sm:px-12 border-t border-[var(--app-text-secondary)]/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
          
          {/* LEFT HEADING */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] text-[var(--app-text-primary)]">
              WALK THROUGH <br className="hidden sm:inline" />
              BEFORE YOU EVER <br className="hidden sm:inline" />
              ARRIVE
            </h1>
          </div>

          {/* RIGHT DESCRIPTION & BUTTONS */}
          <div className="flex flex-col items-start space-y-6 max-w-md">
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium leading-relaxed">
              The door opens from anywhere. Step inside a real space and move through it at your own pace.
            </p>

            {/* BUTTONS GROUP */}
            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary">
                Enter
              </Button>

              <Button variant="secondary">
                Create
              </Button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

export default Video360Hero;