import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor — desktop-only (pointer: fine).
 *
 * Two-layer design:
 *   • Inner dot  — follows the real cursor instantly (no lag, transform only)
 *   • Outer ring — smooth trailing glow that chases the dot with lerp
 *
 * Hides the native cursor on the whole page, shows it back for
 * <input>, <textarea>, <select> and [contenteditable] so text editing
 * still shows the correct I-beam.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isText, setIsText] = useState(false);

  // Lerp targets for the outer ring
  const ring = useRef({ x: -200, y: -200 });
  const target = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Only activate on true pointer devices (mouse/trackpad)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    // --- Hide native cursor site-wide via a stylesheet ---
    const style = document.createElement("style");
    style.id = "__custom-cursor-hide__";
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      input, textarea, select, [contenteditable] { cursor: text !important; }
      a, button, [role="button"], label, [tabindex] { cursor: none !important; }
    `;
    document.head.appendChild(style);

    // --- Smooth animation loop for the outer ring ---
    const LERP = 0.14; // 0 = no movement, 1 = instant (tweak for feel)
    const animate = () => {
      ring.current.x += (target.current.x - ring.current.x) * LERP;
      ring.current.y += (target.current.y - ring.current.y) * LERP;

      const el = ringRef.current;
      if (el) {
        el.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    // --- Mouse move: update dot instantly, ring target lazily ---
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Dot is instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      // Ring target updated here; lerp happens in the RAF loop
      target.current = { x, y };

      if (!visible) setVisible(true);

      // Detect element type under cursor
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (el) {
        const tag = el.tagName.toLowerCase();
        const isTextInput =
          (tag === "input" && el.getAttribute("type") !== "button" && el.getAttribute("type") !== "submit" && el.getAttribute("type") !== "reset" && el.getAttribute("type") !== "checkbox" && el.getAttribute("type") !== "radio") ||
          tag === "textarea" ||
          el.isContentEditable;

        const isBtn =
          tag === "a" ||
          tag === "button" ||
          el.getAttribute("role") === "button" ||
          !!el.closest("a, button, [role='button']");

        setIsText(isTextInput);
        setIsPointer(isBtn && !isTextInput);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.getElementById("__custom-cursor-hide__")?.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // SSR / touch guard
  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999999,
          pointerEvents: "none",
          willChange: "transform",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
          width: isPointer ? 48 : isText ? 28 : 36,
          height: isPointer ? 48 : isText ? 28 : 36,
          borderRadius: "50%",
          border: isText
            ? "1.5px solid hsl(195 95% 55% / 0.6)"
            : isPointer
            ? "1.5px solid hsl(330 90% 65% / 0.9)"
            : "1.5px solid hsl(265 90% 65% / 0.7)",
          boxShadow: isPointer
            ? "0 0 18px 4px hsl(330 90% 65% / 0.35), 0 0 36px 8px hsl(265 90% 65% / 0.2)"
            : isText
            ? "0 0 10px 2px hsl(195 95% 55% / 0.3)"
            : "0 0 14px 3px hsl(265 90% 65% / 0.3), 0 0 28px 6px hsl(195 95% 55% / 0.15)",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
        }}
      />

      {/* Inner solid dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000000,
          pointerEvents: "none",
          willChange: "transform",
          opacity: visible && !isText ? 1 : 0,
          transition: "opacity 0.2s ease, width 0.15s ease, height 0.15s ease",
          width: clicked ? 6 : isPointer ? 10 : 6,
          height: clicked ? 6 : isPointer ? 10 : 6,
          borderRadius: "50%",
          background: isPointer
            ? "linear-gradient(135deg, hsl(330 90% 70%), hsl(265 90% 65%))"
            : "linear-gradient(135deg, hsl(265 90% 75%), hsl(195 95% 60%))",
          boxShadow: isPointer
            ? "0 0 8px 2px hsl(330 90% 65% / 0.8)"
            : "0 0 6px 1px hsl(265 90% 65% / 0.7)",
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
        }}
      />
    </>
  );
}
