import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  const uid = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/80">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${uid}-button-${index}`;
        const panelId = `${uid}-panel-${index}`;
        return (
          <div key={item.q} className="border-b border-black/10 last:border-b-0">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left"
              >
                <span className="font-heading text-lg font-bold leading-snug text-charcoal">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 h-5 w-5 flex-none text-teal transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-6">
                <p className="measure-wide text-mid">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
