import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

import type { RouteHandle } from "@/routes/route-metadata"

const loadNotFoundPage = () =>
  import("./pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
const NotFoundPage = lazy(loadNotFoundPage)

export const systemRoutes: RouteObject[] = [
  {
    path: "*",
    element: createElement(NotFoundPage),
    handle: {
      metadata: {
        title: "Page Not Found | Atlas Admin",
        description: "The requested route does not exist in this admin workspace.",
      },
    } satisfies RouteHandle,
  },
]

export function preloadSystemRoutes() {
  return loadNotFoundPage()
}
