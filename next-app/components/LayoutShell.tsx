import React from "react";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {children}
    </div>
  );
}
