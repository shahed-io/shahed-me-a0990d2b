import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Package, Tags, Users, Wallet, LifeBuoy, MessageSquare, Mail,
  Image as ImageIcon, Flame, Star, Megaphone, BellRing, FileText, Palette, Ticket, Gift,
  Share2, Handshake, Rocket, Facebook, Target, BarChart3, Pin, BookOpen, HelpCircle,
  Search as SearchIcon, ShieldCheck, LineChart, Plug, Sparkles, Bot, UserCog, Lock, Database, Settings,
  Home,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  { label: "Overview", items: [{ title: "Dashboard", url: "/ceo", icon: LayoutDashboard }] },
  { label: "Sales", items: [
    { title: "Orders", url: "/ceo/orders", icon: ShoppingCart },
  ]},
  { label: "Catalog", items: [
    { title: "Products", url: "/ceo/products", icon: Package },
    { title: "Categories", url: "/ceo/categories", icon: Tags },
  ]},
  { label: "Customers", items: [
    { title: "All Customers", url: "/ceo/customers", icon: Users },
    { title: "Wallet", url: "/ceo/wallet", icon: Wallet },
    { title: "Support Tickets", url: "/ceo/tickets", icon: LifeBuoy },
    { title: "Live Chat", url: "/ceo/live-chat", icon: MessageSquare },
    { title: "Newsletter", url: "/ceo/newsletter", icon: Mail },
  ]},
  { label: "Storefront", items: [
    { title: "Hero Banner", url: "/ceo/hero-banner", icon: ImageIcon },
    { title: "Flash Sale", url: "/ceo/flash-sale", icon: Flame },
    { title: "Testimonials", url: "/ceo/testimonials", icon: Star },
    { title: "Announcement Bar", url: "/ceo/announcement", icon: Megaphone },
    { title: "Popup Banner", url: "/ceo/popup", icon: BellRing },
    { title: "Pages", url: "/ceo/pages", icon: FileText },
    { title: "Footer Settings", url: "/ceo/footer", icon: Pin },
    { title: "Themes", url: "/ceo/themes", icon: Palette },
  ]},
  { label: "Marketing", items: [
    { title: "Coupons", url: "/ceo/coupons", icon: Ticket },
    { title: "Welcome Discount", url: "/ceo/welcome-discount", icon: Gift },
    { title: "Referrals", url: "/ceo/referrals", icon: Share2 },
    { title: "Affiliates", url: "/ceo/affiliates", icon: Handshake },
    { title: "Marketing Hub", url: "/ceo/marketing-hub", icon: Rocket },
    { title: "Facebook Pixel", url: "/ceo/fb-pixel", icon: Facebook },
    { title: "FB Custom Audiences", url: "/ceo/fb-audiences", icon: Target },
    { title: "Google Ads", url: "/ceo/google-ads", icon: BarChart3 },
    { title: "Other Pixels", url: "/ceo/other-pixels", icon: Megaphone },
  ]},
  { label: "Content & SEO", items: [
    { title: "Blog", url: "/ceo/blog", icon: BookOpen },
    { title: "Help Center", url: "/ceo/help-center", icon: HelpCircle },
    { title: "Media Library", url: "/ceo/media", icon: ImageIcon },
    { title: "SEO Manager", url: "/ceo/seo", icon: SearchIcon },
    { title: "Site Verification", url: "/ceo/verification", icon: ShieldCheck },
  ]},
  { label: "Reports", items: [
    { title: "Analytics & Reports", url: "/ceo/analytics", icon: LineChart },
  ]},
  { label: "Integrations", items: [
    { title: "Integrations", url: "/ceo/integrations", icon: Plug },
  ]},
  { label: "AI Tools", items: [
    { title: "AI Assistant", url: "/ceo/ai-assistant", icon: Sparkles },
    { title: "AI API Config", url: "/ceo/ai-config", icon: Bot },
  ]},
  { label: "System", items: [
    { title: "Staff Management", url: "/ceo/staff", icon: UserCog },
    { title: "Admin Roles", url: "/ceo/roles", icon: Lock },
    { title: "Backup", url: "/ceo/backup", icon: Database },
    { title: "General Settings", url: "/ceo/settings", icon: Settings },
  ]},
];

export function CeoSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) => (url === "/ceo" ? pathname === "/ceo" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-3 py-3">
        <NavLink to="/ceo" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold">
            S
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-bold">Shahed Admin</div>
              <div className="text-[10px] text-muted-foreground">SHAHED.COM.BD</div>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} end={item.url === "/ceo"} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Site">
                  <NavLink to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span className="text-sm">View Site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
