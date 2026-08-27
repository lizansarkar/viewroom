import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SPACE_TYPES = [
  {
    name: 'Homes',
    tagline: 'Whole houses, whole stories',
    gradient:
      'radial-gradient(120% 90% at 20% 10%, #2b2118 0%, #4a3528 45%, #1a130d 100%)',
    accent: '#c99b66',
    span: 'lg:col-span-7 lg:row-span-2',
    aspect: 'aspect-[4/5] lg:aspect-auto',
    copy: 'Living',
  },
  {
    name: 'Apartments',
    tagline: 'Compact, considered, complete',
    gradient:
      'radial-gradient(120% 90% at 85% 20%, #1d2433 0%, #37445c 50%, #0f141d 100%)',
    accent: '#8fb3d9',
    span: 'lg:col-span-5',
    aspect: 'aspect-[4/3]',
    copy: 'Cozy',
  },
  {
    name: 'Hotels',
    tagline: 'Stay from every angle',
    gradient:
      'radial-gradient(120% 90% at 30% 0%, #241c10 0%, #4d3c20 55%, #15100a 100%)',
    accent: '#e0c28a',
    span: 'lg:col-span-5',
    aspect: 'aspect-[4/3]',
    copy: 'Stay',
  },
  {
    name: 'Rooms',
    tagline: 'One space, many moods',
    gradient:
      'radial-gradient(120% 90% at 60% 25%, #2a1626 0%, #4b2140 50%, #15080f 100%)',
    accent: '#d98ab8',
    span: 'lg:col-span-4',
    aspect: 'aspect-[4/3]',
    copy: 'Space',
  },
  {
    name: 'Living Rooms',
    tagline: 'Where every day begins',
    gradient:
      'radial-gradient(120% 90% at 75% 15%, #232a1a 0%, #3c4a2e 55%, #11170c 100%)',
    accent: '#a8c98f',
    span: 'lg:col-span-4',
    aspect: 'aspect-[4/3]',
    copy: 'Gather',
  },
  {
    name: 'Bedrooms',
    tagline: 'Rest, replayed in detail',
    gradient:
      'radial-gradient(120% 90% at 30% 35%, #281f2e 0%, #4a3d5c 50%, #140f1a 100%)',
    accent: '#b79fe0',
    span: 'lg:col-span-4',
    aspect: 'aspect-[4/3]',
    copy: 'Rest',
  },
  {
    name: 'Kitchens',
    tagline: 'Crafted to cook in',
    gradient:
      'radial-gradient(120% 90% at 40% 20%, #332820 0%, #5c4636 55%, #1c1510 100%)',
    accent: '#e0a97f',
    span: 'lg:col-span-5',
    aspect: 'aspect-[4/3]',
    copy: 'Craft',
  },
  {
    name: 'Bathrooms',
    tagline: 'Calm in clean lines',
    gradient:
      'radial-gradient(120% 90% at 15% 60%, #17323a 0%, #2f5c66 55%, #0d1d22 100%)',
    accent: '#8fd4e0',
    span: 'lg:col-span-4',
    aspect: 'aspect-[4/3]',
    copy: 'Calm',
  },
  {
    name: 'Workspaces',
    tagline: 'Focus, framed better',
    gradient:
      'radial-gradient(120% 90% at 85% 70%, #2a2118 0%, #52402e 55%, #17110b 100%)',
    accent: '#d9b38a',
    span: 'lg:col-span-3',
    aspect: 'aspect-[4/3]',
    copy: 'Focus',
  },
]

function ArrowIcon() {
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
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function Features() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Headline reveal */
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 1,
          },
        }
      )

      /* Text movement (parallax) */
      headlineRef.current.querySelectorAll('[data-speed]').forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed)
        gsap.fromTo(
          layer,
          { y: 60 * speed },
          {
            y: -40 * speed,
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

      /* Tile image zoom on scroll-in (scrub) */
      gsap.utils.toArray('[data-tile]').forEach((tile) => {
        const img = tile.querySelector('[data-img]')
        if (!img) return
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: tile,
              start: 'top 100%',
              end: 'top 35%',
              scrub: 1,
            },
          }
        )
      })

      /* Tile content parallax (text movement within each tile) */
      gsap.utils.toArray('[data-tile]').forEach((tile) => {
        const content = tile.querySelector('[data-content]')
        if (!content) return
        gsap.fromTo(
          content,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: tile,
              start: 'top 92%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-base-100"
      style={{ perspective: '1200px' }}
    >
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:py-32 lg:py-40">
        {/* ── Headline ── */}
        <div ref={headlineRef} className="max-w-3xl">
          <div data-speed="1.6">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-base-content/40 sm:text-xs">
              Browse by Space
              <span className="h-px w-8 bg-[var(--app-border)]/40" />
            </span>
          </div>
          <h2
            data-speed="1"
            className="mt-4 text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.02] text-base-content"
          >
            Explore spaces.
            <br />
            <span className="italic text-base-content/40">Your way.</span>
          </h2>
        </div>

        {/* ── Asymmetric Cinematic Grid ── */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5"
        >
          {SPACE_TYPES.map((space, i) => (
            <Link
              key={space.name}
              to="/explore"
              data-tile
              className={`group relative block overflow-hidden rounded-2xl border bg-base-200 shadow-lg ${space.aspect} ${space.span} border-[var(--app-border)]/25 ring-1 ring-inset ring-black/10`}
            >
              {/* Zoomable image */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  data-img
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  style={{
                    background: space.gradient,
                    transformOrigin: 'center center',
                  }}
                />
                {/* Decorative architectural silhouettes */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={arch(space)} />
              </div>

              {/* Vignette for legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

              {/* Content */}
              <div
                data-content
                className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm"
                    style={{ borderColor: `${space.accent}33` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm"
                  >
                    Type
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {space.name}
                  </h3>
                  <p
                    className="mt-1 text-sm capitalize tracking-wide sm:text-base"
                    style={{ color: space.accent }}
                  >
                    {space.tagline}
                  </p>
                </div>
              </div>

              {/* Arrow reveal on hover */}
              <div className="pointer-events-none absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all duration-300 group-hover:opacity-100 [transform:translateY(8px)] group-hover:[transform:translateY(0)]">
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Decor — subtle window / line motifs generated per-tile */
function arch(space) {
  return {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
      ${space.gradient}
    `,
    backgroundSize: 'clamp(90px, 18vw, 200px) clamp(90px, 18vw, 200px), clamp(90px, 18vw, 200px) clamp(90px, 18vw, 200px), auto',
  }
}

export default Features
