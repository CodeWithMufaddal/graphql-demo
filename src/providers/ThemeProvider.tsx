import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"

export type ThemeMode = "light" | "dark" | "system"
export type ThemePreset = "aurora" | "ocean" | "graphite"

type ThemeContextValue = {
  mode: ThemeMode
  preset: ThemePreset
  setMode: (mode: ThemeMode) => void
  setPreset: (preset: ThemePreset) => void
}

const THEME_MODE_KEY = "dashboard.theme.mode"
const THEME_PRESET_KEY = "dashboard.theme.preset"

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveSystemMode() {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(mode: ThemeMode, preset: ThemePreset) {
  const root = document.documentElement
  const resolvedMode = mode === "system" ? resolveSystemMode() : mode

  root.classList.toggle("dark", resolvedMode === "dark")
  root.dataset.theme = preset
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null
    return saved ?? "system"
  })
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem(THEME_PRESET_KEY) as ThemePreset | null
    return saved ?? "aurora"
  })

  useEffect(() => {
    applyTheme(mode, preset)
    localStorage.setItem(THEME_MODE_KEY, mode)
    localStorage.setItem(THEME_PRESET_KEY, preset)
  }, [mode, preset])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (mode === "system") {
        applyTheme(mode, preset)
      }
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [mode, preset])

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode)
  }, [])

  const setPreset = useCallback((nextPreset: ThemePreset) => {
    setPresetState(nextPreset)
  }, [])

  const value = useMemo(
    () => ({
      mode,
      preset,
      setMode,
      setPreset,
    }),
    [mode, preset, setMode, setPreset]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
