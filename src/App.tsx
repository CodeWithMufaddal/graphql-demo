import { Navigate, Route, Routes } from "react-router-dom"

import { AdminLayout } from "@/layouts/AdminLayout"
import { BillingPage } from "@/pages/BillingPage"
import { LoginPage } from "@/pages/LoginPage"
import { MutationStudioPage } from "@/pages/MutationStudioPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { OverviewPage } from "@/pages/OverviewPage"
import { QueryStudioPage } from "@/pages/QueryStudioPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { UsersPage } from "@/pages/UsersPage"
import { RequireAuth } from "@/routes/RequireAuth"

function App() {
  return (
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
  )
}

export default App
