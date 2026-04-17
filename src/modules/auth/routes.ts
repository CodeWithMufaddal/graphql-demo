import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

const loadLoginPage = () =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage }))
const LoginPage = lazy(loadLoginPage)

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: createElement(LoginPage),
  },
]

export function preloadAuthRoutes() {
  return loadLoginPage()
}

export function matchesAuthRoute(pathname: string) {
  return pathname === "/login"
}
