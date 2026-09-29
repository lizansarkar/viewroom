import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBuilding,
  faCube,
  faPlus,
  faSliders,
  faSignOutAlt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ViewRoomLogoIcon } from "../reuseable/Logo";

export default function DashboardSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, user, logout }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: faChartLine },
    { id: "tours", label: "My 360° Tours", icon: faBuilding },
    { id: "products", label: "3D Product Spins", icon: faCube },
    { id: "uploader", label: "Scene & Tour Builder", icon: faPlus },
    { id: "analytics", label: "Spatial Analytics", icon: faSliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container - Positioned below sticky Navbar (lg:top-24) with zero overlap */}
      <aside
        className={`fixed lg:sticky lg:top-24 left-0 top-0 z-30 h-screen lg:h-auto min-h-[500px] w-64 lg:w-64 shrink-0 bg-base-200 border border-base-content/15 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm ${
          isOpen ? "translate-x-0 !fixed !inset-y-0 !z-50 bg-base-100 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <ViewRoomLogoIcon className="w-8 h-8 text-base-content shrink-0" />
              <span className="font-heading font-black text-sm uppercase tracking-wider text-base-content truncate">
                {user?.role ? `${user.role} DASHBOARD` : "VIEWROOM DASHBOARD"}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden opacity-70 hover:opacity-100 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="p-3.5 rounded-xl bg-base-100 border border-base-content/15 mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-base-content text-base-100 flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0 font-black">
              {user?.name ? user.name[0] : "O"}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-base-content truncate">
                {user?.name || "Owner Creator"}
              </h4>
              <span className="inline-block px-2 py-0.5 rounded-full bg-base-300 text-[9px] font-extrabold opacity-70 uppercase border border-base-content/10">
                {user?.role || "CREATOR"}
              </span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-base-content text-base-100 shadow-sm translate-x-1 font-black"
                    : "opacity-70 hover:opacity-100 hover:bg-base-300"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-sm w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-base-content/15">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider opacity-70 hover:opacity-100 hover:bg-base-300 flex items-center gap-3 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
