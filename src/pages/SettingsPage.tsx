import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function SettingsPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Workspace Preferences</CardTitle>
          <CardDescription>Form UI ready for GraphQL mutation wiring</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="workspace-name" className="text-xs font-medium text-muted-foreground">
                Workspace name
              </label>
              <Input id="workspace-name" defaultValue="Atlas Admin" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="workspace-url" className="text-xs font-medium text-muted-foreground">
                Workspace URL
              </label>
              <Input id="workspace-url" defaultValue="atlas-admin.local" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="timezone" className="text-xs font-medium text-muted-foreground">
              Default timezone
            </label>
            <Select defaultValue="ist">
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-xs font-medium text-muted-foreground">
              Admin notes
            </label>
            <Textarea id="notes" placeholder="Future mutation body goes here..." />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Automation Toggles</CardTitle>
          <CardDescription>Functional controls only for now</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">Daily summary email</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">Anomaly alerts</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">Auto-close stale tasks</span>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
