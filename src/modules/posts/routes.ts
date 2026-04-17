import { createElement, lazy } from "react"
import type { RouteObject } from "react-router-dom"

const loadPostsPage = () =>
  import("./pages/PostPage").then((module) => ({ default: module.PostsPage }))
const PostsPage = lazy(loadPostsPage)

export const postsRoutes: RouteObject[] = [
  {
    path: "/posts",
    element: createElement(PostsPage),
  },
]

export function preloadPostsRoutes() {
  return loadPostsPage()
}

export function matchesPostsRoute(pathname: string) {
  return pathname.startsWith("/posts")
}
