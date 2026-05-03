import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Search as SearchIcon, Globe, LifeBuoy, Settings, Home,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  { label: "Overview", items: [{ title: "Dashboard", url: "/ceo", icon: LayoutDashboard }] },
  { label: "Content & SEO", items: [
    { title: "Blog", url: "/ceo/blog", icon: BookOpen },
    { title: "SEO Manager", url: "/ceo/seo", icon: SearchIcon },
    { title: "Page SEO Overrides", url: "/ceo/page-seo", icon: Globe },
  ]},
  { label: "Inbox", items: [
    { title: "Support Tickets", url: "/ceo/tickets", icon: LifeBuoy },
  ]},
  { label: "System", items: [
    { title: "Settings", url: "/ceo/settings", icon: Settings },
  ]},
];

export function CeoSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) => (url === "/ceo" ? pathname === "/ceo" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 [&>div]:!bg-transparent bg-transparent backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/10 px-3 py-3">
        <NavLink
          to="/ceo"
          className="group relative flex items-center gap-2.5 rounded-2xl p-1.5 overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent backdrop-blur-xl shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.6)]"
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute -inset-8 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground font-bold shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25),0_6px_20px_-6px_hsl(var(--primary)/0.7)] ring-1 ring-white/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
            <span className="text-base tracking-tight">S</span>
            <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background shadow-[0_0_10px_hsl(142_76%_56%/0.8)] animate-pulse" />
          </div>

          {!collapsed && (
            <div className="relative leading-tight min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground truncate">Shahed Admin</span>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider bg-gradient-to-r from-primary/30 to-accent/30 text-primary border border-primary/30">
                  Pro
                </span>
              </div>
              <div className="text-[10px] font-medium text-muted-foreground/80 tracking-wider truncate">
                SHAHED.COM.BD
              </div>
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
                {g.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={
                          active
                            ? "!bg-gradient-to-r !from-primary/25 !via-accent/15 !to-secondary/15 !text-foreground border border-white/15 backdrop-blur-md shadow-[0_0_20px_-6px_hsl(var(--primary)/0.5)]"
                            : "!bg-transparent hover:!bg-white/5"
                        }
                      >
                        <NavLink to={item.url} end={item.url === "/ceo"} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
