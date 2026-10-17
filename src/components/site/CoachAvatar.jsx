import React from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export const firstName = (coach) => coach.name.trim().split(/\s+/)[0];

// The coach's photo in a circle, or their initials on teal-dark until a photo is added.
export default function CoachAvatar({ coach, className, textClassName, loading }) {
  if (coach.photo) {
    return (
      <Image
        src={coach.photo}
        alt={`Portrait of ${coach.name}`}
        loading={loading}
        className={cn("aspect-square flex-none rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-square flex-none select-none items-center justify-center rounded-full bg-teal-dark font-heading font-bold text-white",
        className
      )}
    >
      <span className={textClassName}>{getInitials(coach.name)}</span>
    </div>
  );
}
