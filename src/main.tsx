import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { TooltipProvider } from "@/components/ui/tooltip"
import App from "@/App"
import { AppProviders } from "@/providers/AppProviders"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"

import "./index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppProviders>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </AppProviders>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
