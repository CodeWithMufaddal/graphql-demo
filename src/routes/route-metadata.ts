import type { RouteObject } from "react-router-dom"

export type RouteMetadata = {
  title: string
  description: string
}

export type RouteHandle = {
  metadata?: RouteMetadata
}

export const defaultRouteMetadata: RouteMetadata = {
  title: "Page Not Found | Atlas Admin",
  description: "The requested route does not exist in this admin workspace.",
}

export function readRouteMetadata(route: RouteObject) {
  const handle = (route as RouteObject & { handle?: RouteHandle }).handle
  return handle?.metadata
}
