import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { SiteSettingsLoader } from "@/components/SiteSettingsLoader";
import { PageSeoLoader } from "@/components/PageSeoLoader";
import { SupportWidget } from "@/components/SupportWidget";
// Splash handled by inline loader in index.html for instant paint
import Index from "./pages/Index.tsx";

// Lazy-load secondary routes to keep the initial bundle small.
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Timeline = lazy(() => import("./pages/Timeline.tsx"));
const MdShahed = lazy(() => import("./pages/MdShahed.tsx"));
const ShahedBusiness = lazy(() => import("./pages/ShahedBusiness.tsx"));
const CeoLayout = lazy(() => import("./pages/ceo/CeoLayout.tsx"));
const CeoDashboard = lazy(() => import("./pages/ceo/Dashboard.tsx"));
const CeoTickets = lazy(() => import("./pages/ceo/Tickets.tsx"));
const CeoBlog = lazy(() => import("./pages/ceo/Blog.tsx"));
const SeoManager = lazy(() => import("./pages/ceo/SeoManager.tsx"));
const PageSeo = lazy(() => import("./pages/ceo/PageSeo.tsx"));
const CeoSettings = lazy(() => import("./pages/ceo/Settings.tsx"));
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
  <div
    role="status"
    aria-label="Loading page"
    className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden"
    style={{ backgroundImage: "var(--gradient-mesh)" }}
  >
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] rounded-full bg-accent/15 blur-[100px] animate-pulse" style={{ animationDelay: "0.8s" }} />
    </div>
    <div className="relative flex flex-col items-center gap-5">
      <div className="relative">
        <div
          className="absolute -inset-2 rounded-full opacity-80"
          style={{
            background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)))",
            animation: "spin 1.4s linear infinite",
            filter: "blur(2px)",
          }}
        />
        <div className="relative w-12 h-12 rounded-full bg-background flex items-center justify-center border border-white/10">
          <span className="font-heading font-bold text-lg text-foreground">S</span>
        </div>
      </div>
      <p className="text-xs font-mono text-muted-foreground tracking-wider">Loading…</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/ceo");
  return (
    <>
      <PageTransition>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/md-shahed" element={<MdShahed />} />
            <Route path="/shahed-business" element={<ShahedBusiness />} />
            <Route path="/ceo" element={<CeoLayout />}>
              <Route index element={<CeoDashboard />} />
              <Route path="blog" element={<CeoBlog />} />
              <Route path="seo" element={<SeoManager />} />
              <Route path="page-seo" element={<PageSeo />} />
              <Route path="tickets" element={<CeoTickets />} />
              <Route path="settings" element={<CeoSettings />} />
            </Route>
            <Route path="/md-shahed-web-developer" element={<MdShahedWebDeveloper />} />
            <Route path="/bangladesh-web-development" element={<BangladeshWebDevelopment />} />
            <Route path="/digital-consulting" element={<DigitalConsulting />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      {/* Hide the public chat widget inside the admin panel */}
      {!isAdminRoute && <SupportWidget />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteSettingsLoader />
        <PageSeoLoader />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
