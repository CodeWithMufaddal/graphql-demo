import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

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
  },
  {
    path: "/users/new",
    element: createElement(UserEditorPage),
  },
  {
    path: "/users/:id/edit",
    element: createElement(UserEditorPage),
  },
]

export function preloadUsersRoutes() {
  return Promise.all([loadUsersPage(), loadUserEditorPage()])
}

export function matchesUsersRoute(pathname: string) {
  return pathname.startsWith("/users")
}
