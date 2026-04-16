import { useMemo } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BellIcon,
  ChartColumnIncreasingIcon,
  LogOutIcon,
  MonitorCogIcon,
  MoonStarIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/AuthProvider"
import { useTheme } from "@/providers/ThemeProvider"
import {
  resolveNavItem,
  workspaceNavItems,
} from "@/navigation/dashboard-nav"

function NavigationGroup({
  title,
  items,
  pathname,
}: {
  title: string
  items: typeof workspaceNavItems
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
            <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.path || pathname.startsWith(`${item.path}/`)}
              tooltip={item.title}
            >
              <NavLink to={item.path}>
                <item.icon />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
            {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const { setMode } = useTheme()
  const currentNav = useMemo(() => resolveNavItem(pathname), [pathname])

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider defaultOpen>
      <a
        href="#main-content"
        className="sr-only fixed top-2 left-2 z-[60] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only"
      >
        Skip to main content
      </a>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="gap-3">
          <Link to="/overview" className="flex items-center gap-2 rounded-lg border bg-sidebar-accent/40 px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <ChartColumnIncreasingIcon />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">Atlas Admin</span>
              <span className="truncate text-xs text-sidebar-foreground/70">Navigation Architecture</span>
            </div>
          </Link>
          <SidebarInput placeholder="Search routes..." aria-label="Search routes" />
        </SidebarHeader>

        <SidebarContent>
          <nav aria-label="Primary">
            <NavigationGroup title="Workspace" items={workspaceNavItems} pathname={pathname} />
          </nav>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-2">
            <Avatar>
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((segment) => segment.charAt(0))
                  .join("")
                  .slice(0, 2) ?? "YN"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? "You"}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user?.email ?? "GraphQL Learner"}</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="dashboard-canvas">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/85 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/overview">Admin</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={currentNav.path}>{currentNav.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <SearchIcon className="pointer-events-none absolute top-2 left-2 size-4 text-muted-foreground" />
              <Input
                className="w-64 pl-8"
                placeholder="Search users, posts..."
                aria-label="Search users or posts"
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Open notifications">
              <BellIcon />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 px-2.5">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((segment) => segment.charAt(0))
                        .join("")
                        .slice(0, 2) ?? "YN"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>View profile</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setMode("light")}>
                    <SunIcon />
                    Light mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMode("dark")}>
                    <MoonStarIcon />
                    Dark mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMode("system")}>
                    <MonitorCogIcon />
                    System mode
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main
          id="main-content"
          className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 md:p-6"
        >
          <h1 className="sr-only">{currentNav.title}</h1>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
