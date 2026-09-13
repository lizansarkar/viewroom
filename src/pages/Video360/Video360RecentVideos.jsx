import React, { useState } from 'react'

const categories = ['All', 'Real Estate', 'Hospitality', 'Events', 'Tourism']

const videos = [
  { id: 1, title: 'Penthouse Walkthrough', category: 'Real Estate', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', duration: '2:34' },
  { id: 2, title: 'Resort Poolside Tour', category: 'Hospitality', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', duration: '3:12' },
  { id: 3, title: 'Music Festival Coverage', category: 'Events', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800', duration: '4:48' },
  { id: 4, title: 'Historic Cathedral Tour', category: 'Tourism', image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800', duration: '5:20' },
  { id: 5, title: 'Beachfront Villa Preview', category: 'Real Estate', image: 'https://images.unsplash.com/photo-1499793983394-12dec4e2e3c8?auto=format&fit=crop&q=80&w=800', duration: '3:55' },
  { id: 6, title: 'Mountain Lodge Experience', category: 'Tourism', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=800', duration: '6:10' }
]

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/80 bg-black/10 backdrop-blur-[1px] transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 sm:h-7 sm:w-7 translate-x-[1px]">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}

function Video360RecentVideos() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? videos : videos.filter((v) => v.category === active)

  return (
    <section className="w-full px-5 sm:px-8 lg:px-10 py-16 border-t border-[var(--app-border)]/15">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">Showcase</span>
            <h2 className="font-heading mt-4 text-3xl font-bold text-base-content sm:text-4xl">Recent Videos</h2>
            <p className="mt-2 text-sm text-[var(--app-text-secondary)]">Explore our latest immersive 360° productions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`btn btn-sm rounded-md font-heading text-[11px] tracking-wide font-semibold px-4 border transition-colors duration-200 ${
                  active === cat
                    ? 'bg-base-content text-base-100 border-base-content hover:bg-base-content hover:text-base-100'
                    : 'text-base-content border-[var(--app-border)]/40 hover:border-base-content hover:text-base-content'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div key={v.id} className="card group border border-[var(--app-border)]/20 bg-base-100 cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl rounded-b-none">
                <img src={v.image} alt={v.title} className="h-full w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <PlayIcon />
                <span className="absolute bottom-3 left-3 z-10 rounded-md bg-base-100/80 px-2 py-0.5 text-[10px] font-semibold text-base-content backdrop-blur-sm">
                  {v.duration}
                </span>
              </div>
              <div className="px-4 py-4 border-t border-[var(--app-border)]/20">
                <span className="badge badge-outline text-[10px] mb-2 border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">{v.category}</span>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-base-content">{v.title}</h3>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-[var(--app-text-secondary)] py-16">No videos found in this category.</p>
        )}
      </div>
    </section>
  )
}

export default Video360RecentVideos;