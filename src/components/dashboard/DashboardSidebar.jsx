import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBuilding,
  faCube,
  faPlus,
  faSliders,
  faUserGear,
  faSignOutAlt,
  faXmark,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

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

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-base-200/90 border-r border-[var(--app-border)]/20 p-6 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-base-content text-base-100 flex items-center justify-center font-bold text-xs shadow-md">
                360°
              </div>
              <span className="font-heading font-black text-sm uppercase tracking-wider text-[var(--app-text-primary)]">
                OWNER DASHBOARD
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="p-3.5 rounded-xl bg-base-100 border border-[var(--app-border)]/30 mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user?.name ? user.name[0] : "O"}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-[var(--app-text-primary)] truncate">
                {user?.name || "Owner Creator"}
              </h4>
              <span className="inline-block px-2 py-0.5 rounded-full bg-base-300 text-[9px] font-extrabold text-[var(--app-text-secondary)] uppercase">
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
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all ${
                  activeTab === item.id
                    ? "bg-base-content text-base-100 shadow-md translate-x-1"
                    : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] hover:bg-base-300/50"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-sm w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-[var(--app-border)]/20">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
