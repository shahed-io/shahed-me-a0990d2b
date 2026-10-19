import { useEffect, useRef } from "react";

/**
 * CustomCursor — Desktop-only ultra-fast & smooth custom cursor.
 * Features:
 * - 0ms instant inner dot (moves immediately with mouse)
 * - Fluid trailing outer glow ring (RAF-based lerp)
 * - Automatic interaction state (hover on links/buttons, text input mode)
 * - Click feedback (tactile pulse)
 * - 100% GPU accelerated (translate3d, will-change: transform)
 * - Zero React re-renders during mouse movement
 * - Completely disabled on mobile/touch devices
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices with a mouse / fine pointer
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    // Inject cursor style to hide native cursor on pointer devices
    const styleId = "__custom_cursor_styles__";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `
        @media (hover: hover) and (pointer: fine) {
          body, a, button, [role="button"], label, select, summary, [tabindex], [data-clickable] {
            cursor: none !important;
          }
          input, textarea, [contenteditable="true"] {
            cursor: text !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let isText = false;
    let isClicking = false;
    let rafId = 0;

    const updateRingClasses = () => {
      if (!ring || !dot) return;
      if (isText) {
        ring.style.opacity = "0";
        dot.style.opacity = "0";
      } else if (isVisible) {
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }

      if (isHovering) {
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.borderColor = "hsl(330 90% 65% / 0.9)";
        ring.style.background = "radial-gradient(circle, hsl(265 90% 65% / 0.15) 0%, hsl(330 90% 65% / 0.08) 100%)";
        ring.style.boxShadow = "0 0 24px 6px hsl(330 90% 65% / 0.35), 0 0 45px 10px hsl(265 90% 65% / 0.25)";
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1.3)`;
        dot.style.background = "linear-gradient(135deg, hsl(330 90% 70%), hsl(265 90% 65%))";
      } else {
        ring.style.width = isClicking ? "26px" : "36px";
        ring.style.height = isClicking ? "26px" : "36px";
        ring.style.borderColor = "hsl(265 90% 65% / 0.7)";
        ring.style.background = "transparent";
        ring.style.boxShadow = "0 0 16px 3px hsl(265 90% 65% / 0.35), 0 0 32px 6px hsl(195 95% 55% / 0.18)";
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.7 : 1})`;
        dot.style.background = "linear-gradient(135deg, hsl(265 90% 75%), hsl(195 95% 60%))";
      }
    };

    // Snappy Lerp loop for trailing ring
    const render = () => {
      // 0.22 gives an extremely responsive yet silky smooth trail
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }

      // Instant lead dot - zero lag
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.3 : isClicking ? 0.7 : 1})`;

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const textTarget = target.closest("input, textarea, [contenteditable='true']");
        const nextIsText = !!textTarget;

        const clickableTarget = target.closest("a, button, [role='button'], input[type='submit'], input[type='button'], select, summary, [data-clickable]");
        const nextIsHovering = !!clickableTarget && !nextIsText;

        if (nextIsText !== isText || nextIsHovering !== isHovering) {
          isText = nextIsText;
          isHovering = nextIsHovering;
          updateRingClasses();
        }
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      updateRingClasses();
    };

    const onMouseUp = () => {
      isClicking = false;
      updateRingClasses();
    };

    const onMouseLeave = () => {
      isVisible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.getElementById(styleId)?.remove();
    };
  }, []);

  return (
    <>
      {/* Outer fluid trailing ring with aurora glow */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999999,
          opacity: 0,
          border: "1.5px solid hsl(265 90% 65% / 0.7)",
          boxShadow: "0 0 16px 3px hsl(265 90% 65% / 0.35), 0 0 32px 6px hsl(195 95% 55% / 0.18)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          transition: "opacity 0.2s ease, width 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), height 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
          willChange: "transform",
        }}
      />

      {/* Inner instant lead dot (0ms delay) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000000,
          opacity: 0,
          background: "linear-gradient(135deg, hsl(265 90% 75%), hsl(195 95% 60%))",
          boxShadow: "0 0 8px 2px hsl(265 90% 65% / 0.8)",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          transition: "opacity 0.15s ease, background 0.15s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
