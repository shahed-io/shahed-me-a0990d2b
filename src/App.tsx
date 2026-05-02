import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/page-transition";
import { SupportWidget } from "@/components/SupportWidget";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Timeline from "./pages/Timeline.tsx";
import MdShahed from "./pages/MdShahed.tsx";
import ShahedBusiness from "./pages/ShahedBusiness.tsx";
import Ceo from "./pages/Ceo.tsx";
import MdShahedWebDeveloper from "./pages/MdShahedWebDeveloper.tsx";
import BangladeshWebDevelopment from "./pages/BangladeshWebDevelopment.tsx";
import DigitalConsulting from "./pages/DigitalConsulting.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
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
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        {/*
          Brand the support button:
          1) Easiest — edit --support-from / --support-to in src/index.css
          2) Or override per-instance:
             <SupportWidget accentClass="bg-gradient-to-br from-emerald-500 to-cyan-500" />
             <SupportWidget accentStyle={{ background: "linear-gradient(135deg,#FF5733,#900C3F)" }} />
        */}
        <SupportWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

