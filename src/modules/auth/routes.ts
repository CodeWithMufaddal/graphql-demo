import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

import type { RouteHandle } from "@/routes/route-metadata"

const loadLoginPage = () =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage }))
const LoginPage = lazy(loadLoginPage)

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: createElement(LoginPage),
    handle: {
      metadata: {
        title: "Sign In | Atlas Admin",
        description: "Sign in to access the Atlas Admin GraphQL workspace.",
      },
    } satisfies RouteHandle,
  },
]

export function preloadAuthRoutes() {
  return loadLoginPage()
}

export function matchesAuthRoute(pathname: string) {
  return pathname === "/login"
}
