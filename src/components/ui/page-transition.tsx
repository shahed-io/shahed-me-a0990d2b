import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition — fades + slightly slides each route swap.
 * Re-keys content when location.pathname changes so the animation re-runs.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayKey, setDisplayKey] = useState(location.pathname);

  useEffect(() => {
    setDisplayKey(location.pathname);
  }, [location.pathname]);

  return (
    <div key={displayKey} className="animate-page-in">
      {children}
    </div>
  );
};
