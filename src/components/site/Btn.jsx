import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-teal-dark text-white hover:bg-teal-light hover:text-charcoal",
  gold: "bg-gold text-charcoal hover:bg-teal-light hover:text-charcoal",
  outline:
    "border border-teal-dark/35 bg-transparent text-charcoal hover:border-teal-dark hover:bg-white",
  quiet: "bg-white/12 text-white border border-white/30 hover:bg-white/20",
};

const sizes = {
  md: "px-7 py-3.5 text-base",
  sm: "px-5 py-2.5 text-sm",
};

export default function Btn({
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
