import React from "react";
import { Ellipsis, Home as HomeIcon, Target } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/assets";
import { DIFFERENTIATORS } from "@/data/siteContent";

const ICONS = [Ellipsis, Target, HomeIcon];

export default function DifferentVoiceSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Image
          src={IMAGES.thoughtfulTeen}
          alt="A teenager sitting by a window, looking thoughtfully away from the camera"
          className="h-72 w-full rounded-2xl object-cover sm:h-96"
        />

        <div>
          <h2
            className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
          >
            Why it works when you've run out of road
          </h2>
          <p className="measure-wide mt-6 text-mid">
            Parents are the most important influence in a young person's life. That never changes.
          </p>
          <p className="measure-wide mt-4 text-mid">
            But there's a well-documented truth in mentoring: young people often hear guidance more
            clearly when it comes from someone outside the family. Not because they love you less —
            but because the relationship carries no history, no disappointment, and no unfinished
            arguments.
          </p>
          <p className="measure-wide mt-4 text-mid">
            A WordCompass mentor isn't a replacement for you. We're an extra voice — one that
            reinforces your values using language your child can actually absorb.
          </p>

          <ul className="mt-9 space-y-6">
            {DIFFERENTIATORS.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <li key={item.title} className="flex gap-4">
                  <Icon className="mt-0.5 h-6 w-6 flex-none text-teal" aria-hidden="true" />
                  <div>
                    <p className="font-heading text-lg font-bold text-charcoal">{item.title}</p>
                    <p className="measure-wide text-mid">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
