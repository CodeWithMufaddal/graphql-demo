import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

const loadNotFoundPage = () =>
  import("./pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
const NotFoundPage = lazy(loadNotFoundPage)

export const systemRoutes: RouteObject[] = [
  {
    path: "*",
    element: createElement(NotFoundPage),
  },
]

export function preloadSystemRoutes() {
  return loadNotFoundPage()
}
