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
import { users } from "@/features/dashboard/mock-data"
import { statusVariant } from "@/features/dashboard/ui-utils"

export function UsersPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Total seats</CardDescription>
              <CardTitle>50</CardTitle>
            </CardHeader>
            <CardContent className="py-4 text-sm text-muted-foreground">
              38 seats currently assigned
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Pending invites</CardDescription>
              <CardTitle>6</CardTitle>
            </CardHeader>
            <CardContent className="py-4 text-sm text-muted-foreground">
              4 accepted this week
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardDescription>Onboarding score</CardDescription>
              <CardTitle>88%</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <Progress value={88} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Replace with GraphQL users query</CardDescription>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
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
