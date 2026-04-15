import { Suspense, lazy, useEffect, useMemo } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { resolveNavItem } from "@/navigation/dashboard-nav"
import { RequireAuth } from "@/routes/RequireAuth"

const loadAdminLayoutModule = () => import("@/layouts/AdminLayout")
const loadBillingModule = () => import("@/modules/billing")
const loadAuthModule = () => import("@/modules/auth")
const loadStudioModule = () => import("@/modules/studio")
const loadSystemModule = () => import("@/modules/system")
const loadDashboardModule = () => import("@/modules/dashboard")
const loadSettingsModule = () => import("@/modules/settings")
const loadUsersModule = () => import("@/modules/users")

const AdminLayout = lazy(() =>
  loadAdminLayoutModule().then((module) => ({ default: module.AdminLayout }))
)
const BillingPage = lazy(() =>
  loadBillingModule().then((module) => ({
    default: module.BillingPage,
  }))
)
const LoginPage = lazy(() =>
  loadAuthModule().then((module) => ({ default: module.LoginPage }))
)
const MutationStudioPage = lazy(() =>
  loadStudioModule().then((module) => ({
    default: module.MutationStudioPage,
  }))
)
const NotFoundPage = lazy(() =>
  loadSystemModule().then((module) => ({
    default: module.NotFoundPage,
  }))
)
const OverviewPage = lazy(() =>
  loadDashboardModule().then((module) => ({
    default: module.OverviewPage,
  }))
)
const QueryStudioPage = lazy(() =>
  loadStudioModule().then((module) => ({
    default: module.QueryStudioPage,
  }))
)
const SettingsPage = lazy(() =>
  loadSettingsModule().then((module) => ({
    default: module.SettingsPage,
  }))
)
const UsersPage = lazy(() =>
  loadUsersModule().then((module) => ({ default: module.UsersPage }))
)
const UserEditorPage = lazy(() =>
  loadUsersModule().then((module) => ({ default: module.UserEditorPage }))
)

function preloadCurrentRouteModules(pathname: string) {
  if (pathname === "/login") {
    void loadAuthModule()
    return
  }

  void loadAdminLayoutModule()

  if (pathname === "/" || pathname === "/overview") {
    void loadDashboardModule()
    return
  }

  if (pathname.startsWith("/users")) {
    void loadUsersModule()
    return
  }

  if (pathname === "/billing") {
    void loadBillingModule()
    return
  }

  if (pathname === "/settings") {
    void loadSettingsModule()
    return
  }

  if (pathname === "/query-studio" || pathname === "/mutation-studio") {
    void loadStudioModule()
    return
  }

  void loadSystemModule()
}

if (typeof window !== "undefined") {
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
  return (
    <>
      <RouteMetadataManager />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserEditorPage />} />
            <Route path="/users/:id/edit" element={<UserEditorPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/query-studio" element={<QueryStudioPage />} />
            <Route path="/mutation-studio" element={<MutationStudioPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
