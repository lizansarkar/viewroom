import React from 'react';

function Button({
  children = 'Button',
  variant = 'primary', // 'primary' (grey 3d) or 'secondary' (light 3d)
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  // Base Pill 3D shape with active tactile press feedback
  const baseStyles =
    "px-6 py-2 rounded-full border-[2px] border-black font-semibold text-[15px] text-black cursor-pointer transition-all duration-150 active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)] select-none inline-flex items-center justify-center";

  // Exact match for the bottom-curved 3D shade + outer drop shadow
  const variants = {
    // Left Button: Greyish background with deep bottom bevel
    primary:
      "bg-[#cccccc] hover:bg-[#c4c4c4] shadow-[inset_0_-5px_0_0_#aaaaaa,inset_0_2px_2px_rgba(255,255,255,0.8),0_4px_6px_-1px_rgba(0,0,0,0.3)]",

    // Right Button: Off-white background with subtle grey bottom bevel
    secondary:
      "bg-[#f0f0f0] hover:bg-[#e8e8e8] shadow-[inset_0_-5px_0_0_#d8d8d8,inset_0_2px_2px_rgba(255,255,255,1),0_4px_6px_-1px_rgba(0,0,0,0.3)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;