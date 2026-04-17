import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

import type { RouteHandle } from "@/routes/route-metadata"

const loadOverviewPage = () =>
  import("./pages/OverviewPage").then((module) => ({
    default: module.OverviewPage,
  }))
const OverviewPage = lazy(loadOverviewPage)

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/overview",
    element: createElement(OverviewPage),
    handle: {
      metadata: {
        title: "Overview | Atlas Admin",
        description: "Command center and KPI snapshots for your GraphQL workspace.",
      },
    } satisfies RouteHandle,
  },
]

export function preloadDashboardRoutes() {
  return loadOverviewPage()
}

export function matchesDashboardRoute(pathname: string) {
  return pathname === "/" || pathname === "/overview"
}
