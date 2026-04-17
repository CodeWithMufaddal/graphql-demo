import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

import type { RouteHandle } from "@/routes/route-metadata"

const loadPostsPage = () =>
  import("./pages/PostPage").then((module) => ({ default: module.PostsPage }))
const PostsPage = lazy(loadPostsPage)

export const postsRoutes: RouteObject[] = [
  {
    path: "/posts",
    element: createElement(PostsPage),
    handle: {
      metadata: {
        title: "Posts | Atlas Admin",
        description: "Content listing with author and pagination insights",
      },
    } satisfies RouteHandle,
  },
]

export function preloadPostsRoutes() {
  return loadPostsPage()
}

export function matchesPostsRoute(pathname: string) {
  return pathname.startsWith("/posts")
}
