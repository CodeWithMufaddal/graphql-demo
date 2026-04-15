import { Badge } from "@/components/ui/badge"
import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { invoiceRows } from "@/features/dashboard/mock-data"
import { statusVariant } from "@/features/dashboard/ui-utils"

function UsageMeter({
  label,
  value,
  progress,
}: {
  label: string
  value: string
  progress: number
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <Progress
        value={progress}
        className="mt-3"
        aria-label={`${label} progress`}
      />
    </div>
  )
}

const usageMetrics = [
  { label: "Monthly usage", value: "$4,280 / $6,000", progress: 71 },
  { label: "Seats", value: "38 / 50", progress: 76 },
  { label: "API quota", value: "2.1M / 3M requests", progress: 70 },
]

export function BillingPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardSectionCard title="Plan Utilization" description="Enterprise Growth tier" contentClassName="flex flex-col gap-4">
        {usageMetrics.map((metric) => (
          <UsageMeter
            key={metric.label}
            label={metric.label}
            value={metric.value}
            progress={metric.progress}
          />
        ))}
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Recent Invoices"
        description="Ready for GraphQL billing history"
      >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
      </DashboardSectionCard>
    </div>
  )
}
