import type { ReactNode } from "react"

import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  label: ReactNode
  value: ReactNode
  icon?: ReactNode
  helperText?: ReactNode
  footer?: ReactNode
  className?: string
  valueClassName?: string
  contentClassName?: string
}

export function MetricCard({
  label,
  value,
  icon,
  helperText,
  footer,
  className,
  valueClassName,
  contentClassName,
}: MetricCardProps) {
  return (
    <DashboardSectionCard
      className={className}
      title={<span className={cn("text-2xl", valueClassName)}>{value}</span>}
      description={label}
      action={icon}
      contentClassName={cn("text-sm text-muted-foreground", contentClassName)}
    >
      {footer ?? helperText}
    </DashboardSectionCard>
  )
}
