import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "wordcompass-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "acknowledged");
    } catch {
      // storage unavailable — the banner simply reappears next visit
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-warm">
      <div className="wrap flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="measure-wide text-base text-charcoal">
          We use essential cookies to make this site work, and nothing else without asking. Read our{" "}
          <Link to="/cookies" className="font-semibold text-teal underline underline-offset-4">
            Cookie Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="flex-none rounded-full bg-teal-dark px-6 py-3 font-body font-semibold text-white transition-colors duration-200 hover:bg-teal-light hover:text-charcoal"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
