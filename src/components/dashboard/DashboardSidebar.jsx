import React from "react";

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1.5" />
      <rect width="7" height="5" x="14" y="3" rx="1.5" />
      <rect width="7" height="9" x="14" y="12" rx="1.5" />
      <rect width="7" height="5" x="3" y="16" rx="1.5" />
    </svg>
  );
}

function ToursIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 10h2" />
      <path d="M9 14h2" />
      <path d="M13 10h2" />
      <path d="M13 14h2" />
    </svg>
  );
}

function ProductIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function BuilderIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function AnalyticsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HelpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5 shrink-0" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function DashboardSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, user, logout }) {
  const navSections = [
    {
      title: "Overview",
      items: [
        { id: "overview", label: "Dashboard", icon: DashboardIcon },
        { id: "tours", label: "My 360° Tours", icon: ToursIcon },
      ],
    },
    {
      title: "Content",
      items: [
        { id: "products", label: "3D Product Spins", icon: ProductIcon },
        { id: "uploader", label: "Scene & Tour Builder", icon: BuilderIcon },
      ],
    },
    {
      title: "Analytics",
      items: [
        { id: "analytics", label: "Spatial Analytics", icon: AnalyticsIcon },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container - Exact design matching reference image */}
      <aside
        className={`fixed lg:sticky lg:top-24 left-0 top-0 z-30 h-screen lg:h-[calc(100vh-7rem)] w-64 shrink-0 bg-base-100 border border-base-content/10 rounded-[28px] p-4 flex flex-col justify-between transition-all duration-300 shadow-xs ${
          isOpen ? "translate-x-0 !fixed !inset-y-0 !z-50 bg-base-100 shadow-2xl rounded-none w-72" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-base-content/10">
            <span className="font-bold text-xs uppercase tracking-wider text-base-content/70">
              Dashboard Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-base-200 text-base-content/70 hover:text-base-content cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Nav Sections matching reference image */}
          {navSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <div className="px-3 text-[11px] font-medium text-base-content/50 mb-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold flex items-center gap-3 transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-base-200 text-base-content font-bold shadow-xs"
                        : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${
                        isActive ? "text-base-content" : "text-base-content/60"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Section: Settings, Help, Log out matching reference image */}
        <div className="flex flex-col gap-2 pt-4 border-t border-base-content/10 mt-4">
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-base-200 text-base-content font-bold shadow-xs"
                : "bg-base-200/60 hover:bg-base-200 text-base-content/80 hover:text-base-content"
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-base-content/70" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("help");
              setIsOpen(false);
            }}
            className={`w-full px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "help"
                ? "bg-base-200 text-base-content font-bold shadow-xs"
                : "bg-base-200/60 hover:bg-base-200 text-base-content/80 hover:text-base-content"
            }`}
          >
            <HelpIcon className="w-4 h-4 text-base-content/70" />
            <span>Help</span>
          </button>

          <button
            onClick={() => {
              if (logout) logout();
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-base-content/70 hover:text-error hover:bg-error/10 flex items-center gap-3 transition-all cursor-pointer mt-1"
          >
            <LogoutIcon className="w-4 h-4 text-base-content/70" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
