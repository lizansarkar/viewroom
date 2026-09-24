import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/reuseable/Button";
import { useAuth } from "../../context/AuthContext";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignUpPath = location.pathname === "/sign-up";
  const [isSignUp, setIsSignUp] = useState(isSignUpPath);

  useEffect(() => {
    setIsSignUp(location.pathname === "/sign-up");
  }, [location.pathname]);

  const toggleAuthMode = () => {
    if (isSignUp) {
      navigate("/sign-in");
    } else {
      navigate("/sign-up");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleGoogleSubmit = async () => {
    try {
      if (isSignUp) {
        await register({ name: "Google User", email: "user@gmail.com", password: "Password123!" });
      } else {
        await login({ email: "user@gmail.com", password: "Password123!" });
      }
      navigate("/");
    } catch (err) {
      console.error("Google Auth error:", err);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex flex-col justify-between transition-colors duration-250 select-none">
      {/* Container aligned with max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col lg:flex-row items-center justify-between">
        
        {/* LEFT PANEL: AUTHENTICATION FORM CONTAINER */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-8 lg:py-12 lg:pr-10 z-10 min-h-[85vh]">
          
          {/* Top Header Branding */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="text-3xl font-bold italic tracking-tight"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Logo
            </Link>
            <span className="text-xs text-[var(--app-text-secondary)] font-medium">
              © ViewRoom
            </span>
          </div>

          {/* Form Content Area */}
          <div className="w-full max-w-md mx-auto my-auto py-6 flex flex-col items-center text-center">
            
            {/* Raleway Bold Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-[var(--app-text-primary)]">
              {isSignUp ? "STEP INSIDE" : "WELCOME BACK"}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium mb-8 max-w-sm leading-relaxed">
              {isSignUp
                ? "Create your account and walk through your first space"
                : "Your last room is waiting. Step back inside."}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
              
              {/* Name Input (Sign-Up Only) */}
              {isSignUp && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)]">
                    Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)]/50 focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)]">
                  Email*
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)]/50 focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)]">
                    Password*
                  </label>
                  {!isSignUp && (
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-medium text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] transition-colors"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)]/50 focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                {/* Primary Button */}
                <Button type="submit" variant="primary" className="w-full py-3">
                  {isSignUp ? "Sign up" : "Log in"}
                </Button>

                {/* Google SSO Button */}
                <button
                  type="button"
                  onClick={handleGoogleSubmit}
                  className="w-full py-2.5 px-6 rounded-full bg-[#f0f0f0] hover:bg-[#e8e8e8] text-black font-semibold text-sm border-[2px] border-black shadow-[inset_0_-4px_0_0_#d8d8d8,0_3px_5px_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-all flex items-center justify-center cursor-pointer"
                >
                  <GoogleIcon />
                  <span>{isSignUp ? "Sign up with Google" : "Log in with Google"}</span>
                </button>
              </div>

            </form>

            {/* Mode Switcher Footer Link */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-xs sm:text-sm font-semibold text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] transition-colors cursor-pointer"
              >
                {isSignUp ? (
                  <>
                    Already have an account? <span className="underline font-bold text-[var(--app-text-primary)]">Log in</span>
                  </>
                ) : (
                  <>
                    Don't have an account? <span className="underline font-bold text-[var(--app-text-primary)]">Register / Sign up</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Bottom Copyright Watermark */}
          <div className="mt-auto pt-4 text-left text-xs font-semibold text-[var(--app-text-secondary)]">
            © ViewRoom
          </div>

        </div>

        {/* RIGHT PANEL: ARCHITECTURAL 360 HERO SHOWCASE IMAGE (Full Height) */}
        <div className="hidden lg:flex lg:w-1/2 py-8 lg:py-12 lg:pl-6 relative w-full h-[650px] lg:h-[80vh]">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-base-200">
            {/* High-Resolution Architectural 360 Space Showcase Image */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
              alt="ViewRoom Architectural 360 Space Showcase"
              className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            
            {/* Vignette Ambient Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Badge Tag on Hero Image */}
            <div className="absolute bottom-8 left-8 right-8 z-10 text-white max-w-md">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-3 inline-block">
                IMMERSIVE SPATIAL TOURS
              </span>
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight mb-2">
                STEP INSIDE REAL SPACES BEFORE YOU ARRIVE.
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                Explore homes, hotels, and architectural venues worldwide with 8K 360° panoramic precision.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Auth;
