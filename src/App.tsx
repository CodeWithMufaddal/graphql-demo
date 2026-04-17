import { Suspense, lazy, useEffect, useMemo } from "react"
import { Navigate, useLocation, useRoutes } from "react-router-dom"

import { resolveNavItem } from "@/navigation/dashboard-nav"
import { privateRoutes, preloadCurrentRouteModules, publicRoutes } from "@/routes/module-routes"
import { RequireAuth } from "@/routes/RequireAuth"

const loadAdminLayoutModule = () => import("@/layouts/AdminLayout")

const AdminLayout = lazy(() =>
  loadAdminLayoutModule().then((module) => ({ default: module.AdminLayout }))
)

if (typeof window !== "undefined") {
  if (window.location.pathname !== "/login") {
    void loadAdminLayoutModule()
  }

  preloadCurrentRouteModules(window.location.pathname)
}

function RouteLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card/80 p-5 text-center text-sm text-muted-foreground">
        Loading route...
      </div>
    </div>
  )
}

type RouteMetadata = {
  title: string
  description: string
}

function resolveRouteMetadata(pathname: string): RouteMetadata {
  if (pathname === "/login") {
    return {
      title: "Sign In | Atlas Admin",
      description: "Sign in to access the Atlas Admin GraphQL workspace.",
    }
  }

  if (pathname === "/users/new") {
    return {
      title: "Create User | Atlas Admin",
      description: "Create a new user record with validated profile, company, and address details.",
    }
  }

  if (/^\/users\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit User | Atlas Admin",
      description: "Update existing user profile data in Atlas Admin.",
    }
  }

  if (pathname === "/") {
    return {
      title: "Overview | Atlas Admin",
      description: "Command center and KPI snapshots for your GraphQL workspace.",
    }
  }

  const navItem = resolveNavItem(pathname)
  const isKnownRoute =
    pathname === navItem.path || pathname.startsWith(`${navItem.path}/`)

  if (isKnownRoute) {
    return {
      title: `${navItem.title} | Atlas Admin`,
      description: navItem.description,
    }
  }

  return {
    title: "Page Not Found | Atlas Admin",
    description: "The requested route does not exist in this admin workspace.",
  }
}

function RouteMetadataManager() {
  const { pathname } = useLocation()
  const metadata = useMemo(() => resolveRouteMetadata(pathname), [pathname])

  useEffect(() => {
    document.title = metadata.title

    let descriptionTag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    )

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta")
      descriptionTag.name = "description"
      document.head.appendChild(descriptionTag)
    }

    descriptionTag.content = metadata.description
  }, [metadata])

  return null
}

function App() {
  const routeConfig = useMemo(
    () => [
      ...publicRoutes,
      {
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/overview" replace /> },
          ...privateRoutes,
        ],
      },
    ],
    []
  )
  const routeElements = useRoutes(routeConfig)

  return (
    <>
      <RouteMetadataManager />
      <Suspense fallback={<RouteLoader />}>
        {routeElements}
      </Suspense>
    </>
  )
}

export default App
