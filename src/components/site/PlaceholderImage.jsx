import React from "react";
import { cn } from "@/lib/utils";

export default function PlaceholderImage({ label, ratio = "4 / 3", className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-[#e8e4de] p-6 text-center",
        className
      )}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label}
    >
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-mid">{label}</span>
    </div>
  );
}
