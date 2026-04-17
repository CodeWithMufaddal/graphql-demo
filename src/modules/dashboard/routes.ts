import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

const loadOverviewPage = () =>
  import("./pages/OverviewPage").then((module) => ({
    default: module.OverviewPage,
  }))
const OverviewPage = lazy(loadOverviewPage)

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/overview",
    element: createElement(OverviewPage),
  },
]

export function preloadDashboardRoutes() {
  return loadOverviewPage()
}

export function matchesDashboardRoute(pathname: string) {
  return pathname === "/" || pathname === "/overview"
}
