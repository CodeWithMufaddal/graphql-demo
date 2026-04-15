import { useState, type SubmitEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LockKeyholeIcon, LogInIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/AuthProvider"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState("learner@graphql.dev")
  const [password, setPassword] = useState("graphqlzero")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const destination = (location.state as { from?: string } | null)?.from ?? "/overview"

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(destination, { replace: true })
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/15 via-background to-accent/10">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-3xl">GraphQL Admin Workspace</CardTitle>
            <CardDescription className="text-base">
              Built to map directly to GraphQLZero query and mutation workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 py-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card/80 p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Queries</p>
                <p className="text-sm">`users`, `posts`, `todos`, `albums`, `photos`, `comments`</p>
              </div>
              <div className="rounded-lg border bg-card/80 p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Mutations</p>
                <p className="text-sm">`create`, `update`, `delete` for all entities</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card/80 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Learning flow</p>
              <p className="text-sm">
                Keep UI ready, then replace mock blocks with Apollo hooks one route at a time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <LockKeyholeIcon className="size-5" />
              Sign in
            </CardTitle>
            <CardDescription>UI-auth only for now. Swap with real auth later.</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
              <Button type="submit" disabled={isLoading}>
                <LogInIcon data-icon="inline-start" />
                {isLoading ? "Signing in..." : "Login"}
              </Button>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <SparklesIcon className="size-3.5" />
                Default values are prefilled so you can continue quickly.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
