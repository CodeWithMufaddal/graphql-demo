import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"

type AuthUser = {
  name: string
  email: string
}

type LoginPayload = {
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AUTH_STORAGE_KEY = "dashboard.auth.user"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const persisted = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!persisted) {
      return null
    }

    try {
      return JSON.parse(persisted) as AuthUser
    } catch {
      return null
    }
  })

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    if (!email || !password) {
      throw new Error("Email and password are required.")
    }

    const displayName = email.split("@")[0]?.replaceAll(".", " ") ?? "User"
    const resolvedUser = {
      name: displayName
        .split(" ")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" "),
      email,
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(resolvedUser))
    setUser(resolvedUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
