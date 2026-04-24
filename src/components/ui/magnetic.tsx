import { useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  strength?: number; // 0-1, how strongly it follows the cursor
  className?: string;
}

/**
 * Magnetic — wraps a child element so it subtly drifts toward the cursor.
 * Honors prefers-reduced-motion.
 */
export const Magnetic = ({ children, strength = 0.35, className }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    };
    const handleLeave = () => {
      cancelAnimationFrame(rafId);
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("magnetic inline-block", className)}>
      {children}
    </div>
  );
};
