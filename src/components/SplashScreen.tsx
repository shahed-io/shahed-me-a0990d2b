import { useEffect, useState } from "react";
import profilePhoto from "@/assets/profile-portrait.jpg";

const STORAGE_KEY = "splash_shown_v1";

export const SplashScreen = ({ minDuration = 1400 }: { minDuration?: number }) => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return;
    const start = performance.now();

    // Animated progress (eases toward 95% before page-ready completes it)
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const target = Math.min(95, (elapsed / minDuration) * 100);
      setProgress((p) => (target > p ? target : p));
      if (target < 95) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        setProgress(100);
        setLeaving(true);
        setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {}
        }, 600);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      // Safety net so the splash never sticks forever
      const safety = setTimeout(finish, 5000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(safety);
        window.removeEventListener("load", finish);
      };
    }
    return () => cancelAnimationFrame(raf);
  }, [show, minDuration]);

  // Lock body scroll while splash is visible
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Shahed.com.bd"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundImage: "var(--gradient-mesh)" }}
    >
      {/* Aurora glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-primary/25 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/3 w-[360px] h-[360px] rounded-full bg-accent/20 blur-[100px] animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* Photo with rotating gradient ring */}
      <div className="relative mb-8">
        <div
          className="absolute -inset-3 rounded-full opacity-90"
          style={{
            background:
              "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)))",
            animation: "spin 2.4s linear infinite",
            filter: "blur(2px)",
          }}
        />
        <div className="absolute -inset-6 rounded-full bg-gradient-aurora blur-2xl opacity-60" />
        <div className="relative p-1 rounded-full bg-background">
          <img
            src={profilePhoto}
            alt="MD Shahed"
            width={140}
            height={140}
            fetchPriority="high"
            decoding="async"
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-background animate-fade-in"
          />
        </div>
        {/* Pulsing dot */}
        <span className="absolute bottom-1 right-1 flex h-4 w-4">
          <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-70" />
          <span className="relative h-4 w-4 rounded-full bg-secondary border-2 border-background" />
        </span>
      </div>

      {/* Brand */}
      <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-foreground">
        SHAHED<span className="text-gradient">.</span>
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground mb-8 tracking-wide font-mono">
        Loading experience…
      </p>

      {/* Progress bar */}
      <div className="w-56 md:w-72 h-1 rounded-full bg-white/5 overflow-hidden border border-white/10 backdrop-blur-md">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-[10px] font-mono text-muted-foreground/70 tabular-nums">
        {Math.round(progress)}%
      </p>
    </div>
  );
};
