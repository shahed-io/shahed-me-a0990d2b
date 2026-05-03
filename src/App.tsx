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
const CeoLayout = lazy(() => import("./pages/ceo/CeoLayout.tsx"));
const CeoDashboard = lazy(() => import("./pages/ceo/Dashboard.tsx"));
const CeoOrders = lazy(() => import("./pages/ceo/Orders.tsx"));
const CeoProducts = lazy(() => import("./pages/ceo/Products.tsx"));
const CeoCustomers = lazy(() => import("./pages/ceo/Customers.tsx"));
const CeoTickets = lazy(() => import("./pages/ceo/Tickets.tsx"));
const CeoCoupons = lazy(() => import("./pages/ceo/Coupons.tsx"));
const CeoBlog = lazy(() => import("./pages/ceo/Blog.tsx"));
const ph = (name: string) => lazy(() => import("./pages/ceo/PlaceholderPages.tsx").then(m => ({ default: (m as any)[name] })));
const Categories = ph("Categories");
const WalletPage = ph("WalletPage");
const LiveChat = ph("LiveChat");
const Newsletter = ph("Newsletter");
const HeroBanner = ph("HeroBanner");
const FlashSale = ph("FlashSale");
const Testimonials = ph("Testimonials");
const Announcement = ph("Announcement");
const Popup = ph("Popup");
const Pages = ph("Pages");
const Footer = ph("Footer");
const Themes = ph("Themes");
const WelcomeDiscount = ph("WelcomeDiscount");
const Referrals = ph("Referrals");
const Affiliates = ph("Affiliates");
const MarketingHub = ph("MarketingHub");
const FbPixel = ph("FbPixel");
const FbAudiences = ph("FbAudiences");
const GoogleAds = ph("GoogleAds");
const OtherPixels = ph("OtherPixels");
const HelpCenter = ph("HelpCenter");
const MediaLibrary = ph("MediaLibrary");
const SeoManager = lazy(() => import("./pages/ceo/SeoManager.tsx"));
const Verification = ph("Verification");
const Analytics = ph("Analytics");
const Integrations = ph("Integrations");
const AiAssistant = ph("AiAssistant");
const AiConfig = ph("AiConfig");
const Staff = ph("Staff");
const Roles = ph("Roles");
const Backup = ph("Backup");
const GeneralSettings = ph("GeneralSettings");
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
          <Route path="/ceo" element={<CeoLayout />}>
            <Route index element={<CeoDashboard />} />
            <Route path="orders" element={<CeoOrders />} />
            <Route path="products" element={<CeoProducts />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customers" element={<CeoCustomers />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="tickets" element={<CeoTickets />} />
            <Route path="live-chat" element={<LiveChat />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="hero-banner" element={<HeroBanner />} />
            <Route path="flash-sale" element={<FlashSale />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="announcement" element={<Announcement />} />
            <Route path="popup" element={<Popup />} />
            <Route path="pages" element={<Pages />} />
            <Route path="footer" element={<Footer />} />
            <Route path="themes" element={<Themes />} />
            <Route path="coupons" element={<CeoCoupons />} />
            <Route path="welcome-discount" element={<WelcomeDiscount />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="affiliates" element={<Affiliates />} />
            <Route path="marketing-hub" element={<MarketingHub />} />
            <Route path="fb-pixel" element={<FbPixel />} />
            <Route path="fb-audiences" element={<FbAudiences />} />
            <Route path="google-ads" element={<GoogleAds />} />
            <Route path="other-pixels" element={<OtherPixels />} />
            <Route path="blog" element={<CeoBlog />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="verification" element={<Verification />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="ai-config" element={<AiConfig />} />
            <Route path="staff" element={<Staff />} />
            <Route path="roles" element={<Roles />} />
            <Route path="backup" element={<Backup />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>
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
