import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { SiteSettingsLoader } from "@/components/SiteSettingsLoader";
import { SupportWidget } from "@/components/SupportWidget";
import Index from "./pages/Index.tsx";

// Lazy-load secondary routes to keep the initial bundle small.
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Timeline = lazy(() => import("./pages/Timeline.tsx"));
const MdShahed = lazy(() => import("./pages/MdShahed.tsx"));
const ShahedBusiness = lazy(() => import("./pages/ShahedBusiness.tsx"));
const Ceo = lazy(() => import("./pages/Ceo.tsx"));
const MdShahedWebDeveloper = lazy(() => import("./pages/MdShahedWebDeveloper.tsx"));
const BangladeshWebDevelopment = lazy(() => import("./pages/BangladeshWebDevelopment.tsx"));
const DigitalConsulting = lazy(() => import("./pages/DigitalConsulting.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
    লোড হচ্ছে…
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/md-shahed" element={<MdShahed />} />
          <Route path="/shahed-business" element={<ShahedBusiness />} />
          <Route path="/ceo" element={<Ceo />} />
          <Route path="/md-shahed-web-developer" element={<MdShahedWebDeveloper />} />
          <Route path="/bangladesh-web-development" element={<BangladeshWebDevelopment />} />
          <Route path="/digital-consulting" element={<DigitalConsulting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteSettingsLoader />
        <AnimatedRoutes />
        <SupportWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
