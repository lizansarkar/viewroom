import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../reuseable/Button";

const NAV_LINKS = [
  { label: "Explore", to: "/explore" },
  { label: "Properties", to: "/properties" },
  { label: "Hotels", to: "/hotels" },
];

const HOW_IT_WORKS_LINKS = [
  { label: "How it works", to: "/how-it-works" },
  { label: "For owners", to: "/for-owners" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/faq" },
];

function SunIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-4.5 w-4.5"
      {...props}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function ChevronDown(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5.5 w-5.5"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5.5 w-5.5"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Navbar() {
  const [theme, setTheme] = useState("viewroom-light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("viewroom-theme");
    const initial = stored || "viewroom-light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setHowItWorksOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const next =
      theme === "viewroom-light" ? "viewroom-dark" : "viewroom-light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("viewroom-theme", next);
  };

  const navLinkClass = ({ isActive }) =>
    `text-[15px] font-medium transition-colors ${
      isActive
        ? "text-base-content"
        : "text-base-content/80 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/95 backdrop-blur-md border-b border-[var(--app-border)]/15">
      <nav className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-[28px] font-bold italic tracking-tight shrink-0"
          style={{ fontFamily: "'Brush Script MT', cursive" }}
        >
          Logo
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8 ml-12 mr-auto text-[15px]">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}

          {/* How it works dropdown */}
          <div className="relative inline-flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setHowItWorksOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[15px] cursor-pointer"
              aria-expanded={howItWorksOpen}
            >
              <NavLink className={navLinkClass}>
                How it works
              </NavLink>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  howItWorksOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {howItWorksOpen && (
              <div className="absolute top-full left-0 mt-3 w-52 rounded-2xl border border-[var(--app-border)]/20 bg-base-100 shadow-lg py-2 overflow-hidden z-50">
                {HOW_IT_WORKS_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setHowItWorksOpen(false)}
                    className="block px-4 py-2.5 text-sm text-base-content/80 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side (desktop) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn btn-outline btn-circle btn-sm"
          >
            {theme === "viewroom-light" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link to="/sign-in" className="">
            <Button variant="primary">Sign in</Button>
          </Link>
          <Link
            to="/explore"
            className=""
          >
            <Button variant="secondary">Explore</Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn btn-outline btn-circle btn-sm"
          >
            {theme === "viewroom-light" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="btn btn-outline btn-circle btn-sm"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-base-100 shadow-xl flex flex-col px-6 pt-6 pb-8">
            <div className="flex items-center justify-between mb-8">
              <span
                className="text-2xl font-bold italic"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                Logo
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="btn btn-outline btn-circle btn-sm"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-base font-medium border-b border-[var(--app-border)]/10 ${
                      isActive ? "text-base-content" : "text-base-content/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="py-3 border-b border-[var(--app-border)]/10">
                <p className="text-base font-medium mb-2">How it works</p>
                <div className="flex flex-col gap-2 pl-2">
                  {HOW_IT_WORKS_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-base-content/80"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="btn btn-outline w-full"
              >
                Sign in
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileOpen(false)}
                className="btn btn-outline w-full bg-base-200 border-base-300"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
