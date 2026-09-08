import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Button({
  children = "Button",
  variant = "primary", // 'primary', 'secondary', or 'neutral'
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  // Common interactive state
  const baseInteractive = "cursor-pointer transition-all duration-150 select-none inline-flex items-center justify-center";

  // 3D Pill Base Styles (Only applied to primary & secondary)
  const pill3DStyles = "px-6 py-2 rounded-full border-[2px] border-black font-semibold text-[15px] text-black active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]";

  const variants = {
    // Left Button: Greyish background with deep bottom bevel
    primary: `${pill3DStyles} bg-[#cccccc] hover:bg-[#c4c4c4] shadow-[inset_0_-5px_0_0_#aaaaaa,inset_0_2px_2px_rgba(255,255,255,0.8),0_4px_6px_-1px_rgba(0,0,0,0.3)]`,

    // Right Button: Off-white background with subtle grey bottom bevel
    secondary: `${pill3DStyles} bg-[#f0f0f0] hover:bg-[#e8e8e8] shadow-[inset_0_-5px_0_0_#d8d8d8,inset_0_2px_2px_rgba(255,255,255,1),0_4px_6px_-1px_rgba(0,0,0,0.3)]`,

    // Neutral Button: Transparent background with CSS variable text color & built-in Chevron
    neutral: "bg-transparent text-[var(--app-text-primary)] hover:opacity-75 font-bold text-xs gap-1.5 p-0 border-none shadow-none focus:outline-none",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseInteractive} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}

      {/* Auto render ChevronRight icon only for neutral variant */}
      {variant === "neutral" && (
        <FontAwesomeIcon icon={faChevronRight} className="text-[10px] ml-0.5" />
      )}
    </button>
  );
}

export default Button;