import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop",
    title: "IMMERSIVE",
    subtitle: "NOT A PHOTO. A PLACE YOU CAN EXPLORE.",
    desc: "The space moves with you. Scroll to walk deeper into the room and feel the scale of every wall, floor and opening.",
  },
  {
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    title: "EXPANSIVE",
    subtitle: "WHERE LIGHT MEETS ARCHITECTURE.",
    desc: "Experience the fluid transition between closed private spaces and open communal areas designed for modern living.",
  },
];

export default function ImmersiveScroll() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, { perspective: 1200 });

      sectionsRef.current.forEach((section) => {
        // Nest: image reveals upward + content slides up from the bottom
        const imageWrap = section.querySelector(".is-image");
        const contentWrap = section.querySelector(".is-content");

        // 1) The image unfolds upward from the bottom of the viewport as it enters
        gsap.fromTo(
          imageWrap,
          { yPercent: 45, scale: 1.15 },
          {
            yPercent: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 30%",
              scrub: 1.5,
            },
          }
        );

        // 2) The text + button rise up from below the fold
        gsap.fromTo(
          contentWrap,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "center 55%",
              scrub: 1.5,
            },
          }
        );

        // 3) Earlier slides darken/scale as they move out the top
        gsap.fromTo(
          section,
          { filter: "brightness(1)" },
          {
            filter: "brightness(0.65)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "center 40%",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-black">
      {scenes.map((scene, index) => (
        <section
          key={index}
          ref={(el) => (sectionsRef.current[index] = el)}
          className="relative h-screen w-full overflow-hidden will-change-transform"
        >
          {/* background image layer */}
          <div className="is-image absolute top-0 left-0 w-full h-[60%]">
            <img
              src={scene.img}
              alt={`Scene ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* gradient seam blending image into black */}
          <div className="absolute top-[48%] left-0 w-full h-[24%] bg-gradient-to-b from-transparent to-black z-[2]" />

          {/* subtle dark overlay */}
          <div className="absolute inset-0 bg-black/30 z-[1]" />

          {/* bottom content layer */}
          <div className="absolute bottom-0 left-0 w-full h-[50%] z-10 flex items-end justify-center overflow-hidden">
            <div className="is-content w-full text-center p-8 md:p-16 pb-12 md:pb-20">
              <div className="max-w-4xl mx-auto">
                <p className="text-sm md:text-base font-semibold tracking-[0.2em] text-white/60 mb-3 uppercase">
                  {scene.subtitle}
                </p>
                <h2 className="text-white text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-6">
                  {scene.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                  {scene.desc}
                </p>

                <div className="flex items-center justify-center gap-5">
                  <button className="btn btn-primary btn-sm md:btn-md rounded-full px-8 shadow-lg shadow-primary/20">
                    Enter
                  </button>
                  <span className="text-white/50 text-sm font-medium flex items-center gap-2 group cursor-pointer">
                    Drag to explore
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
