import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — triggers a one-shot reveal when the element scrolls into view.
 * Returns a ref to attach and a boolean indicating visibility.
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
) => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      options,
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible } as const;
};

/**
 * Reveal — wrapper component that fades + slides its children up on scroll into view.
 */
export const Reveal = ({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) => {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref as React.Ref<HTMLElement>}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
      className={[
        "transition-all duration-700 ease-out will-change-[transform,opacity]",
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[2px]",
        className,
      ].join(" ")}
    >
      {children}
    </Comp>
  );
};
