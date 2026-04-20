import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"

import { UserForm, type UserFormSubmitValues, type UserFormValues } from "@/modules/users/forms"
import {
  createUser,
  fetchUserById,
  usersCacheKey,
  updateUserById,
} from "@/modules/users/endpoints"
import { useApolloMutation } from "@/hooks/use-apollo-mutation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const [isLoading, setIsLoading] = useState(isEditMode)
  const [error, setError] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState<Partial<UserFormValues> | undefined>(undefined)
  const saveUserMutation = useApolloMutation({
    mutationFn: async ({
      id: targetId,
      values,
    }: {
      id?: string
      values: UserFormSubmitValues
    }) => (targetId ? updateUserById(targetId, values) : createUser(values)),
    invalidateKeys: [usersCacheKey],
    toastMessages: {
      loading: ({ id: targetId }) => (targetId ? "Updating user..." : "Creating user..."),
      success: (_result, { id: targetId }) =>
        targetId ? "User updated successfully." : "User created successfully.",
      error: (submitError) =>
        submitError instanceof Error ? submitError.message : "Unable to save user.",
    },
  })

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!id) {
        setIsLoading(false)
        setError(null)
        setInitialValues(undefined)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const user = await fetchUserById(id)
        if (cancelled) {
          return
        }

        setInitialValues({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          company: user.company,
          address: user.address
            ? {
                ...user.address,
                geo: {
                  lat: user.address.geo?.lat,
                  lng: user.address.geo?.lng,
                },
              }
            : undefined,
        })
      } catch (loadError) {
        if (cancelled) {
          return
        }

        const message = loadError instanceof Error ? loadError.message : "Unable to load user."
        setError(message)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [id])

  const pageTitle = useMemo(
    () => (isEditMode ? "Edit User" : "Create User"),
    [isEditMode]
  )

  const pageDescription = useMemo(
    () =>
      isEditMode
        ? "Update user profile fields and submit changes."
        : "Fill the user profile fields and create a new record.",
    [isEditMode]
  )

  async function handleSubmit(values: UserFormSubmitValues) {
    try {
      await saveUserMutation.mutateAsync({ id, values })
      navigate("/users")
    } catch {
      return
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <Button asChild variant="outline">
          <Link to="/users">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Users
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading user...</p>
          ) : error ? (
            <div className="grid gap-3">
              <p className="text-sm text-destructive">{error}</p>
              <div>
                <Button asChild variant="outline">
                  <Link to="/users">Return to users list</Link>
                </Button>
              </div>
            </div>
          ) : (
            <UserForm
              mode={isEditMode ? "update" : "create"}
              submitLabel={isEditMode ? "Update User" : "Create User"}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
