import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckList({ items, className, tone = "dark" }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check
            className={cn(
              "mt-1 h-5 w-5 flex-none",
              tone === "light" ? "text-teal-light" : "text-teal"
            )}
            aria-hidden="true"
          />
          <span className={cn("text-base leading-[1.6]", tone === "light" && "text-white/90")}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
