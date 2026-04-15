import { create } from "zustand"

type AuthUser = {
  name: string
  email: string
}

type LoginPayload = {
  email: string
  password: string
}

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AUTH_STORAGE_KEY = "dashboard.auth.user"

function readPersistedUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null
  }

  const persisted = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!persisted) {
    return null
  }

  try {
    return JSON.parse(persisted) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") {
    return
  }

  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

const initialUser = readPersistedUser()

export const useAuth = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  login: async ({ email, password }) => {
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

    persistUser(resolvedUser)
    set({
      user: resolvedUser,
      isAuthenticated: true,
    })
  },
  logout: () => {
    persistUser(null)
    set({
      user: null,
      isAuthenticated: false,
    })
  },
}))
