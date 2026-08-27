import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../../components/reuseable/Button'

gsap.registerPlugin(ScrollTrigger)

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function LocationPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PropertyShowcase() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Cinematic slow zoom on the backdrop */
      gsap.fromTo(
        '[data-backdrop]',
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      /* Text parallax movement */
      textRef.current.querySelectorAll('[data-speed]').forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed)
        gsap.fromTo(
          layer,
          { y: 50 * speed },
          {
            y: -30 * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      })

      /* Content fade in */
      gsap.fromTo(
        textRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-base-100"
      style={{ perspective: '1200px' }}
    >
      {/* Full-width cinematic backdrop */}
      <div className="relative h-[90svh] min-h-[620px] w-full overflow-hidden">
        {/* Zoomable image */}
        <div data-backdrop className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(130% 90% at 25% 30%, #2a2118 0%, #4a3528 45%, #16100b 100%)',
            }}
          />
          {/* Architectural detail */}
          <div
            className="absolute inset-0 mix-blend-overlay opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: 'clamp(120px, 20vw, 260px) clamp(120px, 20vw, 260px)',
            }}
          />
          {/* Light sweep vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-black/70" />
        </div>

        {/* Content overlay */}
        <div className="pointer-events-none relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
            <div ref={textRef} className="max-w-2xl">
              <span
                data-speed="1.5"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Featured Property
              </span>

              <h2
                data-speed="1"
                className="mt-5 text-[clamp(2.5rem,7vw,6rem)] leading-[1.02] text-white"
              >
                Modern
                <br />
                <span className="italic text-white/70">Residence</span>
              </h2>

              <p
                data-speed="0.7"
                className="mt-4 flex items-center gap-2 text-sm text-white/70 sm:text-base"
              >
                <LocationPin />
                Bel Air, Los Angeles, CA
              </p>

              <div
                data-speed="0.5"
                className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80 sm:text-base"
              >
                <span className="font-medium">3 Bedrooms</span>
                <span className="opacity-40">·</span>
                <span className="font-medium">2 Bathrooms</span>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  360°
                </span>
              </div>

              <div
                data-speed="0.4"
                className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
              >
                <Link to="/explore" className="[&>button]:px-8 [&>button]:py-3 [&>button]:text-base">
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    Enter Virtual Tour
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PropertyShowcase
