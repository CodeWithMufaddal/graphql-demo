import { PlusIcon, UserRoundPlusIcon, UsersRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsersQuery } from "@/features/users/hooks/useUsersQuery"
import { statusVariant } from "@/features/dashboard/ui-utils"

const roles = ["Admin", "Manager", "Analyst", "Support"] as const

export function UsersPage() {
  const { data, loading, error } = useUsersQuery({ page: 1, limit: 12 })
  const users = data?.users.data ?? []

  const usersWithUiFields = users.map((user, index) => {
    const status = index % 6 === 0 ? "Invited" : "Active"

    return {
      ...user,
      role: roles[index % roles.length],
      status,
    }
  })

  const totalSeats = Math.max(50, usersWithUiFields.length + 12)
  const pendingInvites = usersWithUiFields.filter(
    (user) => user.status === "Invited"
  ).length
  const activeUsers = usersWithUiFields.filter((user) => user.status === "Active").length
  const onboardingScore =
    usersWithUiFields.length === 0
      ? 0
      : Math.round((activeUsers / usersWithUiFields.length) * 100)

  
  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Total seats</CardDescription>
              <CardTitle>{totalSeats}</CardTitle>
            </CardHeader>
            <CardContent className="py-4 text-sm text-muted-foreground">
              {usersWithUiFields.length} seats currently assigned
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Pending invites</CardDescription>
              <CardTitle>{pendingInvites}</CardTitle>
            </CardHeader>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Backed by GraphQL users data
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Onboarding score</CardDescription>
              <CardTitle>{onboardingScore}%</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Progress value={onboardingScore} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Powered by GraphQLZero `users(options: PageQueryOptions)`
            </CardDescription>
            <CardAction>
              <Button size="sm">
                <PlusIcon data-icon="inline-start" />
                Invite User
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive">
                      {error.message}
                    </TableCell>
                  </TableRow>
                ) : usersWithUiFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No users returned from API.
                    </TableCell>
                  </TableRow>
                ) : (
                  usersWithUiFields.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.company?.name ?? "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Access Rules</CardTitle>
            <CardDescription>UI toggles for future mutations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Enforce 2FA for admins</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Auto-provision default role</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">Require manager approval</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Team Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <UsersRoundIcon className="size-4" />
              24 active collaborators this week
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <UserRoundPlusIcon className="size-4" />
              6 invites pending acceptance
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
