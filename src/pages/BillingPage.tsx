import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export function BillingPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Plan Utilization</CardTitle>
          <CardDescription>Enterprise Growth tier</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Monthly usage</p>
            <p className="text-2xl font-semibold">$4,280 / $6,000</p>
            <Progress value={71} className="mt-3" />
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Seats</p>
            <p className="text-2xl font-semibold">38 / 50</p>
            <Progress value={76} className="mt-3" />
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">API quota</p>
            <p className="text-2xl font-semibold">2.1M / 3M requests</p>
            <Progress value={70} className="mt-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Ready for GraphQL billing history</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
