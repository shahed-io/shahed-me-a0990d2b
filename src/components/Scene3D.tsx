import { Suspense, useEffect, useRef, useState, lazy } from "react";

/**
 * Global immersive 3D background — "Floating Glass Prism" direction.
 * - Fixed full-viewport canvas rendered behind all routes.
 * - Mobile / reduced-motion / no-WebGL → static gradient + CSS fallback.
 * - Lazy-loaded so the 3D bundle never blocks first paint.
 */

const LazyR3FScene = lazy(() => import("./Scene3DCanvas"));

function useShouldRender3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const check = () => {
      if (mqMobile.matches || mqReduced.matches) {
        setEnabled(false);
        return;
      }
      // WebGL capability sniff
      try {
        const c = document.createElement("canvas");
        const gl =
          c.getContext("webgl2") ||
          c.getContext("webgl") ||
          c.getContext("experimental-webgl");
        setEnabled(!!gl);
      } catch {
        setEnabled(false);
      }
    };

    check();
    mqMobile.addEventListener("change", check);
    mqReduced.addEventListener("change", check);
    return () => {
      mqMobile.removeEventListener("change", check);
      mqReduced.removeEventListener("change", check);
    };
  }, []);

  return enabled;
}

const StaticFallback = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050510]"
  >
    {/* Ambient glows matching the prism direction */}
    <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-violet-900/20 blur-[120px] animate-pulse" />
    <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-cyan-900/10 blur-[150px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.18),transparent_60%)]" />
    {/* Static prism silhouette for mobile */}
    <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm shadow-[0_0_60px_rgba(34,211,238,0.15)]" />
  </div>
);

export const Scene3D = () => {
  const enabled = useShouldRender3D();
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (!enabled) return <StaticFallback />;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050510]"
    >
      {/* CSS atmosphere underlay (matches prototype) */}
      <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-violet-900/25 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-cyan-900/15 blur-[150px]" />

      <Suspense fallback={null}>
        <LazyR3FScene />
      </Suspense>

      {/* Subtle vignette to keep content readable */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_45%,rgba(5,5,16,0.65)_100%)]" />
    </div>
  );
};

export default Scene3D;
