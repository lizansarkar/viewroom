import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faHeadset, faEnvelope, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function HelpPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0); // First item expanded by default

  const faqs = [
    {
      question: "Do I need anything?",
      answer:
        "No downloads and no special equipment. A phone or a laptop is enough. The room opens directly in your browser with full 360° pan, tilt, and zoom capabilities.",
    },
    {
      question: "Is it real 360° spatial capture?",
      answer:
        "Every space is captured with 360° equirectangular photography. The walls hold their true distance. The light falls where it falls. Experience true depth and proportion before visiting in person.",
    },
    {
      question: "Can I move between rooms?",
      answer:
        "Yes. Hotspots sit at doors and openings. Click one and you are in the next room with seamless camera swoosh transitions. No menus and no loading screens.",
    },
    {
      question: "What spaces exist on ViewRoom?",
      answer:
        "Homes, apartments, hotels, rooms, buildings, offices, and interactive 3D product spins. If it has walls and a floor, it can be walked.",
    },
    {
      question: "Who made ViewRoom and how does Voice AI work?",
      answer:
        "ViewRoom was built for people tired of being lied to by wide angles and bright edits. We wanted to stand in a room before we arrived. Now you can too — powered by Google Gemini Voice AI for hands-free navigation.",
    },
    {
      question: "How do I become a 360° Creator and publish tours?",
      answer:
        "You can upgrade your account to Creator status for free directly from your dashboard. Upload equirectangular 360° panoramas, link room floor portals, and share interactive tour links or iFrame embeds.",
    },
    {
      question: "Can I attach 3D product spins to virtual rooms?",
      answer:
        "Yes! Use the 3D Product Spins tool in your Creator Dashboard to link interactive 360° product models directly to virtual room furniture and real estate listings.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>HELP CENTER & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-base-content">
          ANSWERS
        </h1>
        <p className="text-sm sm:text-base font-medium text-base-content/70 mt-1">
          The door is open. Here is what you need to know before you walk through.
        </p>
      </div>

      {/* ACCORDION LIST matching image design */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-[22px] border-2 transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-base-content bg-base-100 shadow-md"
                  : "border-base-content/60 bg-base-100/90 hover:border-base-content"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <h3 className="font-extrabold text-base sm:text-lg text-base-content leading-snug">
                  {faq.question}
                </h3>
                <div className="w-8 h-8 rounded-full border border-base-content/30 flex items-center justify-center shrink-0 text-base-content text-sm transition-transform duration-200">
                  <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-base-content/80 leading-relaxed font-medium animate-in fade-in duration-200 border-t border-base-content/10 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* STILL WONDERINGS SECTION */}
      <div className="pt-6 border-t border-base-content/10">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-base-content">
          STILL WONDERINGS?
        </h2>
        <p className="text-xs sm:text-sm font-medium text-base-content/70 mt-1 mb-5">
          Ask us anything. The door is always open.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => navigate("/contact")} className="!px-6 !py-2.5">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xs" />
            Contact
          </Button>
          <button
            onClick={() => navigate("/explore")}
            className="px-6 py-2.5 rounded-full border-2 border-base-content/30 hover:border-base-content text-xs font-bold text-base-content transition-colors cursor-pointer"
          >
            Explore 360° Spaces
          </button>
        </div>
      </div>
    </div>
  );
}
