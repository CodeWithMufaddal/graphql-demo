import { Link } from "react-router-dom"
import { DatabaseZapIcon, FileCode2Icon } from "lucide-react"

import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
          <MetricCard
            key={metric.title}
            label={metric.title}
            value={metric.value}
            footer={
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={metric.positive ? "secondary" : "destructive"}>
                    {metric.delta}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
                </div>
                <Progress
                  value={metric.progress}
                  aria-label={`${metric.title} progress`}
                />
              </div>
            }
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <DashboardSectionCard
          title="Campaign Performance"
          description="Ready for list query + pagination"
        >
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
        </DashboardSectionCard>

        <DashboardSectionCard title="Live Activity" description="Feed UI for subscriptions later">
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
        </DashboardSectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardSectionCard
          title={
            <span className="flex items-center gap-2">
              <DatabaseZapIcon className="size-5" />
              Query Studio
            </span>
          }
          description="All GraphQLZero fetch operations prepared"
        >
            <Button asChild>
              <Link to="/query-studio">Open Query Studio</Link>
            </Button>
        </DashboardSectionCard>
        <DashboardSectionCard
          title={
            <span className="flex items-center gap-2">
              <FileCode2Icon className="size-5" />
              Mutation Studio
            </span>
          }
          description="Create, update, and delete operation templates"
        >
            <Button asChild variant="outline">
              <Link to="/mutation-studio">Open Mutation Studio</Link>
            </Button>
        </DashboardSectionCard>
      </div>
    </div>
  )
}
