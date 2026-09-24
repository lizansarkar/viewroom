import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/reuseable/Button";
import Logo from "../../components/reuseable/Logo";
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

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function SparklesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

const ROLE_OPTIONS = [
  {
    id: "CLIENT",
    title: "CLIENT",
    badge: "Explorer",
    desc: "Browse 360° spaces, bookmark tours, & interact with AI Concierge.",
  },
  {
    id: "CREATOR",
    title: "CREATOR / OWNER",
    badge: "Publisher",
    desc: "Build & publish 360° virtual tours, 3D products, and analytics.",
  },
  {
    id: "VISITOR",
    title: "VISITOR GUEST",
    badge: "Public View",
    desc: "Public access for quick discovery & showcase browsing.",
  },
];

function calculatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: "", color: "bg-base-300", text: "text-base-content/40" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  switch (score) {
    case 1:
      return { score: 25, label: "Weak Password", color: "bg-rose-500", text: "text-rose-500" };
    case 2:
      return { score: 50, label: "Fair Password", color: "bg-amber-500", text: "text-amber-500" };
    case 3:
      return { score: 75, label: "Strong Password", color: "bg-cyan-500", text: "text-cyan-500" };
    case 4:
      return { score: 100, label: "Unstoppable Password", color: "bg-emerald-500", text: "text-emerald-500" };
    default:
      return { score: 15, label: "Too Short (Min 8 chars)", color: "bg-rose-500", text: "text-rose-500" };
  }
}

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CLIENT");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    const all = uppercase + lowercase + numbers + symbols;

    let gen = "";
    gen += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    gen += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    gen += numbers.charAt(Math.floor(Math.random() * numbers.length));
    gen += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 4; i < 12; i++) {
      gen += all.charAt(Math.floor(Math.random() * all.length));
    }

    setPassword(gen);
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await register({ name, email, password, role: selectedRole });
      } else {
        await login({ email, password });
      }
      navigate("/");
    } catch (err) {
      console.error("Auth submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await register({
          name: "Google User",
          email: `user_${Date.now()}@gmail.com`,
          password: "Password123!",
          role: selectedRole,
        });
      } else {
        await login({ email: "user@gmail.com", password: "Password123!" });
      }
      navigate("/");
    } catch (err) {
      console.error("Google Auth error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex flex-col justify-between transition-colors duration-250 select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col lg:flex-row items-center justify-between">
        
        {/* LEFT PANEL: AUTHENTICATION FORM CONTAINER */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-8 lg:py-12 lg:pr-10 z-10 min-h-[85vh]">
          
          {/* Top Header Branding */}
          <div className="flex items-center justify-between mb-6">
            <Logo size="md" />
            <span className="text-xs text-[var(--app-text-secondary)] font-medium">
              © ViewRoom 360° Platform
            </span>
          </div>

          {/* Form Content Area */}
          <div className="w-full max-w-md mx-auto my-auto py-6 flex flex-col items-center text-center">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-[var(--app-text-primary)]">
              {isSignUp ? "STEP INSIDE" : "WELCOME BACK"}
            </h1>

            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium mb-8 max-w-sm leading-relaxed">
              {isSignUp
                ? "Create your account and select your platform role to begin"
                : "Your 360° spatial session is waiting. Step back inside."}
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

              {/* Password Input with Show/Hide Eye Toggle */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)]">
                    Password*
                  </label>
                  {isSignUp ? (
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[11px] font-bold text-cyan-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <SparklesIcon />
                      <span>Auto-fill Strong Password</span>
                    </button>
                  ) : (
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-medium text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] transition-colors"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-5 py-3 pr-12 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)]/50 focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-base-content/60 hover:text-base-content p-1 focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Password Strength Indicator & Recommendation Bar (Sign-Up Only) */}
                {isSignUp && password && (
                  <div className="mt-1 space-y-1">
                    <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className={passwordStrength.text}>{passwordStrength.label}</span>
                      <span className="text-base-content/40">Min 8 chars, 1 uppercase, 1 number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Selection Option (Sign-Up Only, Excluding ADMIN) */}
              {isSignUp && (
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)] flex items-center justify-between">
                    <span>Select Account Role*</span>
                    <span className="text-[10px] text-base-content/50 lowercase font-medium">(Excludes Admin)</span>
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedRole === r.id
                            ? "bg-primary/10 border-primary shadow-xs"
                            : "bg-base-200/40 border-[var(--app-border)]/20 hover:bg-base-200/70"
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase text-base-content">{r.title}</span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-base-200 text-base-content/70">
                              {r.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-base-content/60 truncate mt-0.5">{r.desc}</span>
                        </div>
                        <div className="shrink-0 ml-3">
                          <input
                            type="radio"
                            name="role"
                            checked={selectedRole === r.id}
                            onChange={() => setSelectedRole(r.id)}
                            className="radio radio-xs radio-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3">
                  {isSubmitting
                    ? "Processing..."
                    : isSignUp
                    ? `Register as ${selectedRole}`
                    : "Log in"}
                </Button>

                <button
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={isSubmitting}
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

          <div className="mt-auto pt-4 text-left text-xs font-semibold text-[var(--app-text-secondary)]">
            © ViewRoom 360° Platform
          </div>

        </div>

        {/* RIGHT PANEL: ARCHITECTURAL 360 HERO SHOWCASE IMAGE */}
        <div className="hidden lg:flex lg:w-1/2 py-8 lg:py-12 lg:pl-6 relative w-full h-[650px] lg:h-[80vh]">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-base-200">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
              alt="ViewRoom Architectural 360 Space Showcase"
              className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

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
