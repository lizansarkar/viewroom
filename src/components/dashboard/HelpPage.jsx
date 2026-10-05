import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faQuestionCircle,
  faEnvelope,
  faShieldHalved,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

export default function HelpPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("faq");
  const [openIndex, setOpenIndex] = useState(0); // First FAQ expanded by default

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
      {/* HEADER SECTION MATCHING USER IMAGE */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>HELP CENTER & DOCUMENTATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-base-content">
          ANSWERS
        </h1>
        <p className="text-sm sm:text-base font-medium text-base-content/70 mt-1">
          The door is open. Here is what you need to know before you walk through.
        </p>
      </div>

      {/* CATEGORY NAV TABS: General FAQ, Creator Guide, Admin Guide */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-base-content/10">
        <button
          onClick={() => setActiveCategory("faq")}
          className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === "faq"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200/80 text-base-content/70 hover:bg-base-200 hover:text-base-content"
          }`}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>General FAQ ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory("creator")}
          className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === "creator"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200/80 text-base-content/70 hover:bg-base-200 hover:text-base-content"
          }`}
        >
          <FontAwesomeIcon icon={faCamera} />
          <span>Creator & Hotspot Guide</span>
        </button>

        <button
          onClick={() => setActiveCategory("admin")}
          className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeCategory === "admin"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200/80 text-base-content/70 hover:bg-base-200 hover:text-base-content"
          }`}
        >
          <FontAwesomeIcon icon={faShieldHalved} />
          <span>Admin Technical Guide</span>
        </button>
      </div>

      {/* SECTION 1: GENERAL FAQ ACCORDION WITH SMOOTH EXPAND/COLLAPSE ANIMATION */}
      {activeCategory === "faq" && (
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-[22px] border-2 transition-all duration-300 overflow-hidden ${
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
                  <div
                    className={`w-8 h-8 rounded-full border border-base-content/30 flex items-center justify-center shrink-0 text-base-content text-sm transition-transform duration-300 ease-in-out ${
                      isOpen ? "rotate-180 bg-base-content text-base-100 border-base-content" : "rotate-0"
                    }`}
                  >
                    <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
                  </div>
                </button>

                {/* Smooth CSS Grid Row Height Animation */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 px-5 pb-5 sm:px-6 sm:pb-6"
                      : "grid-rows-[0fr] opacity-0 px-5 pb-0 sm:px-6 sm:pb-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed font-medium border-t border-base-content/10 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2: CREATOR 360° HOTSPOT DOCUMENTATION GUIDE */}
      {activeCategory === "creator" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faCamera} className="text-base-content/70" />
              <span>Creator Guide & 360° Hotspot Documentation</span>
            </h3>
            <p className="text-xs text-base-content/60 mt-1">
              Comprehensive guide to creating equirectangular panoramas and placing interactive pitch/yaw hotspots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                1. 360° Panorama Image Requirements
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• <strong>Aspect Ratio:</strong> Equirectangular format requires exact 2:1 aspect ratio (e.g. 4096x2048 or 8192x4096).</p>
                <p>• <strong>Format:</strong> JPEG or PNG files recommended.</p>
                <p>• <strong>HDR Lighting:</strong> Balanced exposure across all 360 degrees for smooth sphere rendering.</p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                2. Placing Pitch & Yaw Hotspots
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• Click <strong>"Add Pitch/Yaw Hotspot"</strong> on any tour scene in your 360° tours list.</p>
                <p>• In the interactive sphere viewport, click anywhere on the floor or doorway to automatically set Pitch & Yaw coordinates.</p>
                <p>• Select a target room scene to connect two rooms seamlessly.</p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                3. Interactive 3D Product Spins
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• Navigate to <strong>3D Product Spins</strong> in your Creator Dashboard.</p>
                <p>• Upload multi-angle product frames or procedural 3D model geometry.</p>
                <p>• Link 3D products directly to virtual furniture inside room scenes.</p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                4. Sharing & iFrame Embed Code
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• Every 360° tour generates a unique direct link (e.g. <code>/tour/scene_init_1</code>).</p>
                <p>• Use the <strong>Share Tour Link & Embed</strong> modal to copy clean iFrame code for external real estate portals.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ADMINISTRATOR & MODERATION TECHNICAL GUIDE */}
      {activeCategory === "admin" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-base-content/70" />
              <span>Administrator Technical Guide & Documentation</span>
            </h3>
            <p className="text-xs text-base-content/60 mt-1">
              Reference guide for platform administration, user role privileges, and content moderation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                User Role Hierarchy & Rights
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>
                  <strong className="text-base-content">ADMIN:</strong> Full control over user accounts, role promotions, content deletion, and system telemetry.
                </p>
                <p>
                  <strong className="text-base-content">CREATOR:</strong> Can publish 360° virtual tours, add hotspots, upload 3D models, and track tour analytics.
                </p>
                <p>
                  <strong className="text-base-content">CLIENT:</strong> Can browse 360° spaces, bookmark favorite tours, use AI concierge, and request Creator status.
                </p>
                <p>
                  <strong className="text-base-content">VISITOR:</strong> Unauthenticated preview mode to explore public 360° spaces and featured content.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                Quick Administrative Actions
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• To promote a user to Creator or Admin, navigate to <strong>User Management</strong> tab and use the dropdown.</p>
                <p>• To inspect or remove questionable 360° tours, use the <strong>Content Moderation</strong> tab.</p>
                <p>• To preview how the platform looks for other roles, click <strong>"Creator View"</strong> or <strong>"Client View"</strong> in Admin Overview.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STILL WONDERINGS SECTION MATCHING IMAGE 1 */}
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
