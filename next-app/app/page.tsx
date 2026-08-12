import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-10 ring-1 ring-white/5 backdrop-blur-xl shadow-soft-glow">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">
              ViewRoom Demo
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              360° Virtual Tour Experience
            </h1>
            <p className="mt-4 max-w-3xl text-slate-400">
              A demo viewer based on the requested reference UI — full-screen
              panorama, embedded hotspots, GSAP transitions, and a thumbnail
              scene strip.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/property/demo-house/view"
              className="rounded-3xl bg-emerald-500 px-6 py-5 text-center font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              View Demo House Tour
            </Link>
            <Link
              href="/property/demo-house/view?debug=1"
              className="rounded-3xl border border-slate-700 px-6 py-5 text-center text-slate-200 transition hover:border-emerald-400 hover:text-white"
            >
              View Demo (Debug Mode)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
