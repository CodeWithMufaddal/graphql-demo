import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from "@/App"
import { AppProviders } from "@/providers/AppProviders"
import "@/providers/ThemeProvider"

import "./index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
