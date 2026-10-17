import React from "react";

export default function StepTimeline({ steps, showImages = false }) {
  return (
    <ol className="mt-12 space-y-10">
      {steps.map((step, index) => (
        <li key={step.number} className="relative flex gap-6 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold font-mono text-sm font-bold text-charcoal">
              {step.number}
            </span>
            {index < steps.length - 1 && (
              <span className="mt-3 w-px flex-1 bg-teal-light" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <h3 className="font-heading text-xl font-bold text-charcoal sm:text-2xl">
              {step.title}
            </h3>
            <p className="measure-wide mt-3 text-mid">{step.body}</p>
            {showImages && step.imageLabel && (
              <div
                className="mt-6 flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-[#e8e4de] px-6 text-center sm:h-56"
                role="img"
                aria-label={step.imageLabel}
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-mid">
                  {step.imageLabel}
                </span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
