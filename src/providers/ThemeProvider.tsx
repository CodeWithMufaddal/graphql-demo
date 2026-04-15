import { create } from "zustand"

export type ThemeMode = "light" | "dark" | "system"
export type ThemePreset = "aurora" | "ocean" | "graphite"

type ThemeState = {
  mode: ThemeMode
  preset: ThemePreset
  setMode: (mode: ThemeMode) => void
  setPreset: (preset: ThemePreset) => void
}

const THEME_MODE_KEY = "dashboard.theme.mode"
const THEME_PRESET_KEY = "dashboard.theme.preset"

const validModes: ThemeMode[] = ["light", "dark", "system"]
const validPresets: ThemePreset[] = ["aurora", "ocean", "graphite"]

function readThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system"
  }

  const saved = localStorage.getItem(THEME_MODE_KEY)
  return validModes.includes(saved as ThemeMode) ? (saved as ThemeMode) : "system"
}

function readThemePreset(): ThemePreset {
  if (typeof window === "undefined") {
    return "aurora"
  }

  const saved = localStorage.getItem(THEME_PRESET_KEY)
  return validPresets.includes(saved as ThemePreset) ? (saved as ThemePreset) : "aurora"
}

function resolveSystemMode() {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(mode: ThemeMode, preset: ThemePreset) {
  if (typeof window === "undefined") {
    return
  }

  const root = document.documentElement
  const resolvedMode = mode === "system" ? resolveSystemMode() : mode

  root.classList.toggle("dark", resolvedMode === "dark")
  root.dataset.theme = preset
}

const initialMode = readThemeMode()
const initialPreset = readThemePreset()

export const useTheme = create<ThemeState>((set, get) => ({
  mode: initialMode,
  preset: initialPreset,
  setMode: (mode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_MODE_KEY, mode)
    }

    set({ mode })
    applyTheme(mode, get().preset)
  },
  setPreset: (preset) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_PRESET_KEY, preset)
    }

    set({ preset })
    applyTheme(get().mode, preset)
  },
}))

declare global {
  interface Window {
    __dashboardThemeListenerAttached?: boolean
  }
}

if (typeof window !== "undefined") {
  applyTheme(initialMode, initialPreset)

  if (!window.__dashboardThemeListenerAttached) {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", () => {
      const { mode, preset } = useTheme.getState()
      if (mode === "system") {
        applyTheme(mode, preset)
      }
    })
    window.__dashboardThemeListenerAttached = true
  }
}
