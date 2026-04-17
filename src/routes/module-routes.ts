import type { RouteObject } from "react-router-dom"

import {
  authRoutes,
  matchesAuthRoute,
  preloadAuthRoutes,
} from "@/modules/auth/routes"
import {
  dashboardRoutes,
  matchesDashboardRoute,
  preloadDashboardRoutes,
} from "@/modules/dashboard/routes"
import {
  matchesPostsRoute,
  postsRoutes,
  preloadPostsRoutes,
} from "@/modules/posts/routes"
import { preloadSystemRoutes, systemRoutes } from "@/modules/system/routes"
import {
  matchesUsersRoute,
  preloadUsersRoutes,
  usersRoutes,
} from "@/modules/users/routes"

export const publicRoutes: RouteObject[] = [...authRoutes]

export const privateRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...usersRoutes,
  ...postsRoutes,
  ...systemRoutes,
]

export function preloadCurrentRouteModules(pathname: string) {
  if (matchesAuthRoute(pathname)) {
    void preloadAuthRoutes()
    return
  }

  if (matchesDashboardRoute(pathname)) {
    void preloadDashboardRoutes()
    return
  }

  if (matchesUsersRoute(pathname)) {
    void preloadUsersRoutes()
    return
  }

  if (matchesPostsRoute(pathname)) {
    void preloadPostsRoutes()
    return
  }

  void preloadSystemRoutes()
}
