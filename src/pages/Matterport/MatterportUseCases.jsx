import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../../components/reuseable/Button";

gsap.registerPlugin(ScrollTrigger);

function MatterportUseCases() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeTab, setActiveTab] = useState("enter");

  // ৬টি এলোমেলো (scattered/offset) কার্ডের ডাটা
  const cardsData = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      // Initial Position (এলোমেলো অফসেট)
      initX: "-18%",
      initY: "-15%",
      // Scroll Spread Position
      spreadXDesktop: -420,
      spreadYDesktop: -280,
      spreadXMobile: -150,
      spreadYMobile: -240,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      initX: "15%",
      initY: "-18%",
      spreadXDesktop: 420,
      spreadYDesktop: -280,
      spreadXMobile: 150,
      spreadYMobile: -240,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      initX: "-22%",
      initY: "12%",
      spreadXDesktop: -460,
      spreadYDesktop: 220,
      spreadXMobile: -160,
      spreadYMobile: 240,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      initX: "0%",
      initY: "18%",
      spreadXDesktop: 0,
      spreadYDesktop: 340,
      spreadXMobile: 0,
      spreadYMobile: 300,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80",
      initX: "20%",
      initY: "10%",
      spreadXDesktop: 440,
      spreadYDesktop: 240,
      spreadXMobile: 160,
      spreadYMobile: 250,
    },
    {
      id: 6,
      // ৬ নম্বর অতিরিক্ত ইমেজ
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
      initX: "2%",
      initY: "-8%",
      spreadXDesktop: 0,
      spreadYDesktop: -340,
      spreadXMobile: 0,
      spreadYMobile: -300,
    },
  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 640;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=170%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      cardsData.forEach((card, index) => {
        const el = cardsRef.current[index];
        if (el) {
          const targetX = isMobile ? card.spreadXMobile : card.spreadXDesktop;
          const targetY = isMobile ? card.spreadYMobile : card.spreadYDesktop;

          timeline.to(
            el,
            {
              x: targetX,
              y: targetY,
              scale: isMobile ? 0.8 : 0.9,
              ease: "power2.out",
            },
            0
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 flex items-center justify-center overflow-hidden"
    >
      {/* 1. CENTER TEXT CONTENT (প্রারম্ভিক অবস্থায় সম্পূর্ণ ঢেকে থাকবে) */}
      <div className="z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center select-none">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-4">
          INSIDE
        </span>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-5 text-[var(--app-text-primary)]">
          THE DOOR OPENS BEFORE YOU ARRIVE
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[var(--app-text-secondary)] font-medium max-w-md mb-8 leading-relaxed">
          A photograph shows you a room. ViewRoom puts you in it.
        </p>

        {/* SWITCHER PILL */}
        <div className="flex items-center bg-[var(--app-text-primary)]/10 border border-[var(--app-text-secondary)]/20 rounded-full p-1 shadow-md">
          <Button
            variant={activeTab === "enter" ? "primary" : "neutral"}
            onClick={() => setActiveTab("enter")}
            className="!px-6 !py-2 !text-xs !font-bold cursor-pointer"
          >
            Enter
          </Button>

          <Button
            variant={activeTab === "look" ? "primary" : "neutral"}
            onClick={() => setActiveTab("look")}
            className="!px-6 !py-2 !text-xs !font-bold cursor-pointer"
          >
            Look &gt;
          </Button>
        </div>
      </div>

      {/* 2. OVERLAPPING & SCATTERED IMAGES (Sharpe Edges - No Rounded Corners) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute w-[210px] h-[210px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-none bg-[var(--app-text-primary)]/10 border border-[var(--app-text-secondary)]/10 overflow-hidden shadow-2xl transition-colors duration-250"
            style={{
              transform: `translate(${card.initX}, ${card.initY})`,
            }}
          >
            <img
              src={card.image}
              alt="ViewRoom Spatial Twin"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MatterportUseCases;