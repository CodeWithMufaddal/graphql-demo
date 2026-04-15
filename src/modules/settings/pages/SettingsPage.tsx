import { LogOutIcon, MonitorCogIcon, MoonStarIcon, SunIcon } from "lucide-react"

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
import { useAuth } from "@/providers/AuthProvider"
import { type ThemeMode, type ThemePreset, useTheme } from "@/providers/ThemeProvider"

export function SettingsPage() {
  const { logout, user } = useAuth()
  const { mode, preset, setMode, setPreset } = useTheme()

  function setThemeMode(nextMode: ThemeMode) {
    setMode(nextMode)
  }

  function setThemePreset(nextPreset: ThemePreset) {
    setPreset(nextPreset)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
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
            <CardTitle>Theme & Appearance</CardTitle>
            <CardDescription>Switch themes directly from settings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Mode</label>
              <div className="grid gap-2 sm:grid-cols-3">
                <Button variant={mode === "light" ? "default" : "outline"} onClick={() => setThemeMode("light")}>
                  <SunIcon data-icon="inline-start" />
                  Light
                </Button>
                <Button variant={mode === "dark" ? "default" : "outline"} onClick={() => setThemeMode("dark")}>
                  <MoonStarIcon data-icon="inline-start" />
                  Dark
                </Button>
                <Button variant={mode === "system" ? "default" : "outline"} onClick={() => setThemeMode("system")}>
                  <MonitorCogIcon data-icon="inline-start" />
                  System
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Preset</label>
              <Select value={preset} onValueChange={(value) => setThemePreset(value as ThemePreset)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="aurora">Aurora</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="graphite">Graphite</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Active session</p>
            <p className="mt-1 text-sm font-medium">{user?.email ?? "No active session"}</p>
          </div>
          <Button variant="destructive" onClick={logout}>
            <LogOutIcon data-icon="inline-start" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
