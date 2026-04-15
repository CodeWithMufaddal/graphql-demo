import { useMemo, useState } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BellIcon,
  ChartColumnIncreasingIcon,
  FilterIcon,
  LogOutIcon,
  MonitorCogIcon,
  MoonStarIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/providers/AuthProvider"
import { type ThemeMode, useTheme } from "@/providers/ThemeProvider"
import {
  graphqlNavItems,
  managementNavItems,
  resolveNavItem,
  routeHighlights,
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
            <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
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
  const { mode, setMode, preset } = useTheme()
  const [sheetOpen, setSheetOpen] = useState(false)
  const currentNav = useMemo(() => resolveNavItem(pathname), [pathname])

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  function renderModeIcon(modeValue: ThemeMode) {
    if (modeValue === "light") {
      return <SunIcon />
    }

    if (modeValue === "dark") {
      return <MoonStarIcon />
    }

    return <MonitorCogIcon />
  }

  return (
    <SidebarProvider defaultOpen>
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
          <SidebarInput placeholder="Search routes..." />
        </SidebarHeader>

        <SidebarContent>
          <NavigationGroup title="Workspace" items={workspaceNavItems} pathname={pathname} />
          <SidebarSeparator />
          <NavigationGroup title="Management" items={managementNavItems} pathname={pathname} />
          <SidebarSeparator />
          <NavigationGroup title="GraphQL Studio" items={graphqlNavItems} pathname={pathname} />
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium">
                <SparklesIcon className="size-4" />
                GraphQL Learning Mode
              </div>
              <Progress value={68} />
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-2">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/100?img=16" alt="You" />
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
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/85 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <span className="text-muted-foreground">Admin</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentNav.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden lg:block">
                <SearchIcon className="pointer-events-none absolute top-2 left-2 size-4 text-muted-foreground" />
                <Input className="w-64 pl-8" placeholder="Search users, campaigns..." />
              </div>
              <Select defaultValue="30d">
                <SelectTrigger className="hidden min-w-28 md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant="outline" className="hidden sm:inline-flex">
                <FilterIcon data-icon="inline-start" />
                Filter
              </Button>
              <Button onClick={() => setSheetOpen(true)}>
                <PlusIcon data-icon="inline-start" />
                New
              </Button>
              <Button variant="outline" size="icon">
                <BellIcon />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 px-2.5">
                    <Avatar size="sm">
                      <AvatarImage src="https://i.pravatar.cc/100?img=16" alt="You" />
                      <AvatarFallback>YN</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Notification settings</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Theme & appearance</Link>
                    </DropdownMenuItem>
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

          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-xl border bg-card/80 p-4">
                <h1 className="text-balance">{currentNav.title}</h1>
                <p className="text-sm text-muted-foreground">{currentNav.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {routeHighlights.map((item) => (
                  <div key={item.title} className="rounded-xl border bg-card/80 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <item.icon className="size-4" />
                      {item.title}
                    </div>
                    <p className="text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-xl border bg-card/80 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">Route: {currentNav.path}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {renderModeIcon(mode)}
                      {mode} / {preset}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </main>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Create Campaign</SheetTitle>
              <SheetDescription>UI-only form for now. Add a GraphQL mutation later.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <Input placeholder="Campaign name" />
              <Textarea placeholder="Brief..." />
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setSheetOpen(false)}>Create Draft</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
