import { Suspense, lazy, useEffect, useMemo } from "react"
import {
  Navigate,
  matchRoutes,
  useLocation,
  useRoutes,
  type RouteObject,
} from "react-router-dom"

import { privateRoutes, preloadCurrentRouteModules, publicRoutes } from "@/routes/module-routes"
import { defaultRouteMetadata, readRouteMetadata } from "@/routes/route-metadata"
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

function resolveRouteMetadata(routes: RouteObject[], pathname: string) {
  const matches = matchRoutes(routes, pathname)

  if (!matches?.length) {
    return defaultRouteMetadata
  }

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const metadata = readRouteMetadata(matches[index].route)

    if (metadata) {
      return metadata
    }
  }

  return defaultRouteMetadata
}

function RouteMetadataManager({ routes }: { routes: RouteObject[] }) {
  const { pathname } = useLocation()
  const metadata = useMemo(
    () => resolveRouteMetadata(routes, pathname),
    [routes, pathname]
  )

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
  const routeConfig = useMemo<RouteObject[]>(
    () => [
      ...publicRoutes,
      {
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/overview" replace />,
            handle: {
              metadata: {
                title: "Overview | Atlas Admin",
                description: "Command center and KPI snapshots for your GraphQL workspace.",
              },
            },
          },
          ...privateRoutes,
        ],
      },
    ],
    []
  )
  const routeElements = useRoutes(routeConfig)

  return (
    <>
      <RouteMetadataManager routes={routeConfig} />
      <Suspense fallback={<RouteLoader />}>
        {routeElements}
      </Suspense>
    </>
  )
}

export default App
