export function statusVariant(status: string) {
  if (status === "Active" || status === "Paid") return "default"
  if (status === "Review" || status === "Invited") return "secondary"
  if (status === "Paused" || status === "Suspended") return "destructive"
  return "outline"
}
