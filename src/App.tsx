import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { SiteSettingsLoader } from "@/components/SiteSettingsLoader";
import { PageSeoLoader } from "@/components/PageSeoLoader";
// Splash handled by inline loader in index.html for instant paint
import Index from "./pages/Index.tsx";

// Lazy-load secondary routes to keep the initial bundle small.
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const LazySupportWidget = lazy(() =>
  import("@/components/SupportWidget").then(({ SupportWidget }) => ({ default: SupportWidget }))
);
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Timeline = lazy(() => import("./pages/Timeline.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const MdShahed = lazy(() => import("./pages/MdShahed.tsx"));
const ShahedBusiness = lazy(() => import("./pages/ShahedBusiness.tsx"));
const CeoLayout = lazy(() => import("./pages/ceo/CeoLayout.tsx"));
const CeoDashboard = lazy(() => import("./pages/ceo/Dashboard.tsx"));
const CeoTickets = lazy(() => import("./pages/ceo/Tickets.tsx"));
const CeoBlog = lazy(() => import("./pages/ceo/Blog.tsx"));
const SeoManager = lazy(() => import("./pages/ceo/SeoManager.tsx"));
const PageSeo = lazy(() => import("./pages/ceo/PageSeo.tsx"));
const CeoRankings = lazy(() => import("./pages/ceo/Rankings.tsx"));
const CeoSettings = lazy(() => import("./pages/ceo/Settings.tsx"));
const CeoBackup = lazy(() => import("./pages/ceo/Backup.tsx"));
const MdShahedWebDeveloper = lazy(() => import("./pages/MdShahedWebDeveloper.tsx"));
const BangladeshWebDevelopment = lazy(() => import("./pages/BangladeshWebDevelopment.tsx"));
const DigitalConsulting = lazy(() => import("./pages/DigitalConsulting.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const BlogCategory = lazy(() => import("./pages/BlogCategory.tsx"));

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
    className="min-h-screen bg-background text-foreground relative overflow-hidden px-6"
    style={{ backgroundImage: "var(--gradient-mesh)" }}
  >
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="font-heading text-2xl font-bold tracking-normal text-gradient-primary">SHAHED.</div>
        <div className="h-2 w-24 overflow-hidden rounded-pill bg-muted/50">
          <div className="h-full w-1/2 rounded-pill bg-gradient-primary animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <div className="space-y-5">
        <div className="h-16 w-full max-w-2xl rounded-pill glass-strong shimmer-soft" />
        <div className="h-4 w-full max-w-xl rounded-pill bg-muted/60 shimmer-soft" />
        <div className="h-4 w-4/5 max-w-lg rounded-pill bg-muted/40 shimmer-soft" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 rounded-lg glass shimmer-soft" />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">Preparing your experience…</p>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/md-shahed" element={<MdShahed />} />
            <Route path="/shahed-business" element={<ShahedBusiness />} />
            <Route path="/ceo" element={<CeoLayout />}>
              <Route index element={<CeoDashboard />} />
              <Route path="blog" element={<CeoBlog />} />
              <Route path="seo" element={<SeoManager />} />
              <Route path="page-seo" element={<PageSeo />} />
              <Route path="rankings" element={<CeoRankings />} />
              <Route path="tickets" element={<CeoTickets />} />
              <Route path="backup" element={<CeoBackup />} />
              <Route path="settings" element={<CeoSettings />} />
            </Route>
            <Route path="/md-shahed-web-developer" element={<MdShahedWebDeveloper />} />
            <Route path="/bangladesh-web-development" element={<BangladeshWebDevelopment />} />
            <Route path="/digital-consulting" element={<DigitalConsulting />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/category/:tag" element={<BlogCategory />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Hide the public chat widget inside the admin panel and while routes are loading */}
          {!isAdminRoute && (
            <Suspense fallback={null}>
              <LazySupportWidget />
            </Suspense>
          )}
        </Suspense>
      </PageTransition>
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
