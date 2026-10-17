import React from "react";
import { Image } from "@/components/ui/image";
import PlaceholderImage from "./PlaceholderImage";
import { cn } from "@/lib/utils";

export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
  image,
  imageAlt,
  imageLabel,
  media: customMedia,
  breadcrumb,
}) {
  const media = customMedia ? (
    customMedia
  ) : image ? (
    <Image
      src={image}
      alt={imageAlt || ""}
      loading="eager"
      className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-[26rem]"
    />
  ) : imageLabel ? (
    <PlaceholderImage label={imageLabel} ratio="4 / 3" />
  ) : null;

  return (
    <section className="border-b border-black/5 bg-cream py-14 sm:py-20">
      <div className={cn("wrap", media && "grid items-center gap-12 lg:grid-cols-2")}>
        <div>
          {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1
            className="mt-4 font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          {intro && <p className="measure mt-6 text-lg leading-[1.7] text-mid">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {media}
      </div>
    </section>
  );
}
