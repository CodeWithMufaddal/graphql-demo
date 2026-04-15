import type { LucideIcon } from "lucide-react"
import {
  CircleDollarSignIcon,
  DatabaseZapIcon,
  FileCode2Icon,
  LayoutDashboardIcon,
  Settings2Icon,
  ShieldCheckIcon,
  UsersRoundIcon,
} from "lucide-react"

export type DashboardNavItem = {
  path: string
  title: string
  description: string
  icon: LucideIcon
  badge?: string
  group: "workspace" | "management" | "graphql"
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
    path: "/billing",
    title: "Billing",
    description: "Invoices, usage, and plan controls",
    icon: CircleDollarSignIcon,
    group: "management",
  },
  {
    path: "/settings",
    title: "Settings",
    description: "Workspace preferences and automations",
    icon: Settings2Icon,
    group: "management",
  },
  {
    path: "/query-studio",
    title: "Query Studio",
    description: "GraphQLZero query templates and controls",
    icon: DatabaseZapIcon,
    group: "graphql",
  },
  {
    path: "/mutation-studio",
    title: "Mutation Studio",
    description: "Create/update/delete operation templates",
    icon: FileCode2Icon,
    group: "graphql",
  },
]

export function resolveNavItem(pathname: string) {
  return dashboardNavItems.find((item) => pathname === item.path) ?? dashboardNavItems[0]
}

export const workspaceNavItems = dashboardNavItems.filter(
  (item) => item.group === "workspace"
)

export const managementNavItems = dashboardNavItems.filter(
  (item) => item.group === "management"
)

export const graphqlNavItems = dashboardNavItems.filter(
  (item) => item.group === "graphql"
)

export const routeHighlights = [
  {
    title: "Security posture",
    value: "98%",
    icon: ShieldCheckIcon,
  },
]
