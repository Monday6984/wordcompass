import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Btn from "./Btn";
import { BRAND } from "@/data/assets";
import { NAV, SITE } from "@/data/siteContent";
import { cn } from "@/lib/utils";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/85 backdrop-blur-md">
      <div className="wrap flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img
            src={BRAND.logo}
            alt="WordCompass Coaching and Mentoring"
            width={BRAND.logoWidth}
            height={BRAND.logoHeight}
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={pathname === item.path ? "page" : undefined}
              className={cn(
                "font-body text-base font-medium transition-colors duration-200 hover:text-teal",
                pathname === item.path ? "text-teal" : "text-charcoal"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Btn
            to="/book-a-call"
            variant="gold"
            size="sm"
            className="whitespace-nowrap px-4 py-2 text-sm sm:px-5 sm:py-2.5"
          >
            <span className="sm:hidden">Book a Call</span>
            <span className="hidden sm:inline">Book a Free Call</span>
          </Btn>
          <button
            type="button"
            className="rounded-full p-1.5 text-charcoal lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-black/5 bg-cream lg:hidden">
          <nav aria-label="Mobile" className="wrap flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="py-3 font-body text-lg text-charcoal hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="py-3 font-body text-lg text-charcoal hover:text-teal"
            >
              Pricing
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              onClick={() => setOpen(false)}
              className="py-3 font-body text-base text-mid hover:text-teal"
            >
              {SITE.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
