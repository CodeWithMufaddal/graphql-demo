import type { LucideIcon } from "lucide-react"
import {
  FileTextIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
} from "lucide-react"

export type DashboardNavItem = {
  path: string
  title: string
  description: string
  icon: LucideIcon
  badge?: string
  group: "workspace"
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    path: "/overview",
    title: "Overview",
    description: "Command center and KPI snapshots",
    icon: LayoutDashboardIcon,
    group: "workspace",
  },
  {
    path: "/users",
    title: "Users",
    description: "People directory, roles, and onboarding",
    icon: UsersRoundIcon,
    badge: "24",
    group: "workspace",
  },
  {
    path: "/posts",
    title: "Posts",
    description: "Content listing with author and pagination insights",
    icon: FileTextIcon,
    group: "workspace",
  },
]

export function resolveNavItem(pathname: string) {
  return (
    dashboardNavItems.find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
    ) ?? dashboardNavItems[0]
  )
}

export const workspaceNavItems = dashboardNavItems.filter(
  (item) => item.group === "workspace"
)

export const routeHighlights = [
  {
    title: "Security posture",
    value: "98%",
    icon: ShieldCheckIcon,
  },
]
