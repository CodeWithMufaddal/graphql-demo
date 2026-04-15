import { Navigate, Route, Routes } from "react-router-dom"

import { AdminLayout } from "@/layouts/AdminLayout"
import { BillingPage } from "@/pages/BillingPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { OverviewPage } from "@/pages/OverviewPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { UsersPage } from "@/pages/UsersPage"

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
