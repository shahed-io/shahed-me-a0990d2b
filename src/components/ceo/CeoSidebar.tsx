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
