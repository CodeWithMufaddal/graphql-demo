import { Link } from "react-router-dom"
import { DatabaseZapIcon, FileCode2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { activityFeed, campaigns, metrics } from "@/features/dashboard/mock-data"
import { statusVariant } from "@/features/dashboard/ui-utils"

export function OverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="border-b">
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex items-center gap-2">
                <Badge variant={metric.positive ? "secondary" : "destructive"}>
                  {metric.delta}
                </Badge>
                <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
              </div>
              <Progress value={metric.progress} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Ready for list query + pagination</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.name}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.owner}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{campaign.spend}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Live Activity</CardTitle>
            <CardDescription>Feed UI for subscriptions later</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <ScrollArea className="h-[260px] pr-3">
              <div className="flex flex-col gap-3">
                {activityFeed.map((item) => (
                  <div key={`${item.actor}-${item.time}`} className="rounded-lg border bg-background/80 p-3">
                    <p className="text-sm">
                      <span className="font-medium">{item.actor}</span> {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <DatabaseZapIcon className="size-5" />
              Query Studio
            </CardTitle>
            <CardDescription>All GraphQLZero fetch operations prepared</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <Button asChild>
              <Link to="/query-studio">Open Query Studio</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <FileCode2Icon className="size-5" />
              Mutation Studio
            </CardTitle>
            <CardDescription>Create, update, and delete operation templates</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <Button asChild variant="outline">
              <Link to="/mutation-studio">Open Mutation Studio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
