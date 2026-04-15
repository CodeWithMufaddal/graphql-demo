import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { RequireAuth } from "@/routes/RequireAuth"

const AdminLayout = lazy(() =>
  import("@/layouts/AdminLayout").then((module) => ({ default: module.AdminLayout }))
)
const BillingPage = lazy(() =>
  import("@/pages/BillingPage").then((module) => ({ default: module.BillingPage }))
)
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage }))
)
const MutationStudioPage = lazy(() =>
  import("@/pages/MutationStudioPage").then((module) => ({
    default: module.MutationStudioPage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage }))
)
const OverviewPage = lazy(() =>
  import("@/pages/OverviewPage").then((module) => ({ default: module.OverviewPage }))
)
const QueryStudioPage = lazy(() =>
  import("@/pages/QueryStudioPage").then((module) => ({ default: module.QueryStudioPage }))
)
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((module) => ({ default: module.SettingsPage }))
)
const UsersPage = lazy(() =>
  import("@/pages/UsersPage").then((module) => ({ default: module.UsersPage }))
)

function RouteLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card/80 p-5 text-center text-sm text-muted-foreground">
        Loading route...
      </div>
    </div>
  )
}

function App() {
  return (
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
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/query-studio" element={<QueryStudioPage />} />
          <Route path="/mutation-studio" element={<MutationStudioPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
