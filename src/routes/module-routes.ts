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

const routePreloadRegistry = [
  { matches: matchesAuthRoute, preload: preloadAuthRoutes },
  { matches: matchesDashboardRoute, preload: preloadDashboardRoutes },
  { matches: matchesUsersRoute, preload: preloadUsersRoutes },
  { matches: matchesPostsRoute, preload: preloadPostsRoutes },
]

export function preloadCurrentRouteModules(pathname: string) {
  const target = routePreloadRegistry.find((entry) => entry.matches(pathname))
  void (target?.preload() ?? preloadSystemRoutes())
}
