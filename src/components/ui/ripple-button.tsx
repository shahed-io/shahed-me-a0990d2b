import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, { bg: string; ripple: "light" | "dark" }> = {
  primary: {
    bg: "bg-foreground text-background hover:bg-foreground/90",
    ripple: "light",
  },
  accent: {
    bg: "bg-accent text-accent-foreground hover:bg-accent/90",
    ripple: "light",
  },
  secondary: {
    bg: "bg-secondary text-foreground hover:bg-muted",
    ripple: "dark",
  },
  outline: {
    bg: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    ripple: "dark",
  },
  ghost: {
    bg: "bg-transparent text-foreground hover:bg-secondary",
    ripple: "dark",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs rounded-full",
  md: "px-6 py-3 text-sm rounded-full",
  lg: "px-8 py-4 text-sm rounded-full",
};

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant = "primary", size = "md", onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        const rect = button.getBoundingClientRect();
        const sz = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.className = `ripple-wave ${variantClasses[variant].ripple === "dark" ? "ripple-wave-dark" : ""}`;
        ripple.style.width = ripple.style.height = `${sz}px`;
        ripple.style.left = `${e.clientX - rect.left - sz / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - sz / 2}px`;
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }

      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "ripple-container inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 will-change-transform active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none uppercase",
          variantClasses[variant].bg,
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
RippleButton.displayName = "RippleButton";
