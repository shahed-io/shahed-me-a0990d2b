import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-primary text-primary-foreground shadow-elevated hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)]",
  accent:
    "bg-gradient-accent text-primary-foreground shadow-elevated hover:shadow-[0_0_40px_-5px_hsl(var(--accent)/0.6)]",
  secondary:
    "glass text-foreground hover:bg-[hsl(var(--card)/0.8)]",
  outline:
    "border border-glass-border bg-transparent text-foreground hover:bg-[hsl(0_0%_100%/0.05)]",
  ghost:
    "bg-transparent text-foreground hover:bg-[hsl(0_0%_100%/0.06)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-full",
  md: "px-6 py-3 text-sm rounded-full",
  lg: "px-8 py-4 text-base rounded-full",
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
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.className = "ripple-wave";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
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
          "ripple-container inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 will-change-transform active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
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
