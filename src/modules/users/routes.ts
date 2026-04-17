import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

import type { RouteHandle } from "@/routes/route-metadata"

const loadUsersPage = () =>
  import("./pages/UsersPage").then((module) => ({ default: module.UsersPage }))
const loadUserEditorPage = () =>
  import("./pages/UserEditorPage").then((module) => ({
    default: module.UserEditorPage,
  }))
const UsersPage = lazy(loadUsersPage)
const UserEditorPage = lazy(loadUserEditorPage)

export const usersRoutes: RouteObject[] = [
  {
    path: "/users",
    element: createElement(UsersPage),
    handle: {
      metadata: {
        title: "Users | Atlas Admin",
        description: "People directory, roles, and onboarding",
      },
    } satisfies RouteHandle,
  },
  {
    path: "/users/new",
    element: createElement(UserEditorPage),
    handle: {
      metadata: {
        title: "Create User | Atlas Admin",
        description:
          "Create a new user record with validated profile, company, and address details.",
      },
    } satisfies RouteHandle,
  },
  {
    path: "/users/:id/edit",
    element: createElement(UserEditorPage),
    handle: {
      metadata: {
        title: "Edit User | Atlas Admin",
        description: "Update existing user profile data in Atlas Admin.",
      },
    } satisfies RouteHandle,
  },
]

export function preloadUsersRoutes() {
  return Promise.all([loadUsersPage(), loadUserEditorPage()])
}

export function matchesUsersRoute(pathname: string) {
  return pathname.startsWith("/users")
}
