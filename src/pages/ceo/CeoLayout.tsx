import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Bell, ExternalLink, LogOut, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CeoSidebar } from "@/components/ceo/CeoSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { GlobalSearch, useGlobalSearch } from "@/components/GlobalSearch";

const CeoLayout = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { open: searchOpen, setOpen: setSearchOpen } = useGlobalSearch();

  // No loading screen — if we don't yet know the user, redirect to login only after auth resolves.
  if (!authLoading && !user) return <Navigate to="/login" replace />;
  // Show denied screen only once role check completed and confirmed not admin.
  if (!authLoading && !roleLoading && user && !isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <SEO title="Access Denied" description="Admin only" />
        <h1 className="text-3xl font-bold">🔒 Access Denied</h1>
        <p className="text-muted-foreground">এই panel শুধু admin-এর জন্য।</p>
        <Button asChild><Link to="/">Home-এ ফিরে যান</Link></Button>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <SEO title="Admin Dashboard — Shahed" description="Admin control panel" canonical="https://shahed.com.bd/ceo" />
      <div className="flex min-h-screen w-full text-foreground" style={{ backgroundImage: "var(--gradient-mesh)" }}>
        <CeoSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-transparent px-3 backdrop-blur-xl">
            <SidebarTrigger />
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 max-w-sm flex-1 h-9 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-left text-sm text-muted-foreground hover:bg-white/10 hover:border-white/20 transition-colors"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate">Search anything…</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">Ctrl+K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/"><ExternalLink className="mr-1 h-4 w-4" /> View Site</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
};

export default CeoLayout;
