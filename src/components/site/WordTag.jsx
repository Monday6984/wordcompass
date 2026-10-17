import React from "react";
import { cn } from "@/lib/utils";

const tones = {
  purple: { background: "rgba(139,92,246,0.14)", color: "#5b21b6", border: "1px solid rgba(139,92,246,0.4)" },
  sky: { background: "rgba(14,165,233,0.14)", color: "#075985", border: "1px solid rgba(14,165,233,0.4)" },
  light: { background: "rgba(255,255,255,0.10)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" },
  lightPurple: { background: "rgba(139,92,246,0.28)", color: "#ffffff", border: "1px solid rgba(196,181,253,0.6)" },
  lightSky: { background: "rgba(14,165,233,0.28)", color: "#ffffff", border: "1px solid rgba(125,211,252,0.6)" },
};

export default function WordTag({ children, tone = "purple", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 font-body text-sm font-semibold",
        className
      )}
      style={tones[tone] || tones.purple}
    >
      {children}
    </span>
  );
}
