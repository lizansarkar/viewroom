import React from 'react'

function Video360Hero() {
  return (
          {/* ── Video Gallery ── */}
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
                      ? "bg-base-content text-base-100 border-base-content hover:bg-base-content hover:text-base-100"
                      : "text-base-content border-[var(--app-border)]/40 hover:border-base-content hover:text-base-content"
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

export default Video360Hero