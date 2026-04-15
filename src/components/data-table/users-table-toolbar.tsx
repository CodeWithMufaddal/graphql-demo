import { CalendarDaysIcon, RotateCcwIcon, SearchIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { AsyncMultiSelect } from "@/components/filters/async-multi-select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type {
  FilterOptionsRequest,
  FilterOptionsResponse,
  UsersServerFilters,
} from "@/features/users/table/users-table-server"

function parseFilterDate(value: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function formatDateFilterLabel(range: DateRange | undefined) {
  if (!range?.from && !range?.to) {
    return "Created date"
  }

  if (range?.from && range?.to) {
    return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`
  }

  return range?.from ? `From ${format(range.from, "MMM d, yyyy")}` : "Created date"
}

type UsersTableToolbarProps = {
  globalSearchInput: string
  onGlobalSearchChange: (value: string) => void
  filters: UsersServerFilters
  onFiltersChange: (updater: (previous: UsersServerFilters) => UsersServerFilters) => void
  onReset: () => void
  loadFilterOptions: (
    kind: "roles" | "statuses" | "companies",
    request: FilterOptionsRequest
  ) => Promise<FilterOptionsResponse>
}

export function UsersTableToolbar({
  globalSearchInput,
  onGlobalSearchChange,
  filters,
  onFiltersChange,
  onReset,
  loadFilterOptions,
}: UsersTableToolbarProps) {
  const selectedRange: DateRange | undefined =
    filters.createdFrom || filters.createdTo
      ? {
          from: parseFilterDate(filters.createdFrom),
          to: parseFilterDate(filters.createdTo),
        }
      : undefined

  return (
    <div className="rounded-lg border bg-card p-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <SearchIcon className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={globalSearchInput}
            onChange={(event) => onGlobalSearchChange(event.target.value)}
            placeholder="Search name, username, email, company..."
            className="h-9 pl-8"
          />
        </div>
        <AsyncMultiSelect
          label="Roles"
          selected={filters.roles}
          className="h-9 min-w-[8.25rem] px-2"
          loadOptions={(request) => loadFilterOptions("roles", request)}
          onChange={(nextSelected) =>
            onFiltersChange((previous) => ({
              ...previous,
              roles: nextSelected,
            }))
          }
        />
        <AsyncMultiSelect
          label="Statuses"
          selected={filters.statuses}
          className="h-9 min-w-[8.75rem] px-2"
          loadOptions={(request) => loadFilterOptions("statuses", request)}
          onChange={(nextSelected) =>
            onFiltersChange((previous) => ({
              ...previous,
              statuses: nextSelected,
            }))
          }
        />
        <AsyncMultiSelect
          label="Companies"
          selected={filters.companies}
          className="h-9 min-w-[9rem] px-2"
          loadOptions={(request) => loadFilterOptions("companies", request)}
          onChange={(nextSelected) =>
            onFiltersChange((previous) => ({
              ...previous,
              companies: nextSelected,
            }))
          }
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 min-w-[12rem] justify-start px-3 text-left">
              <CalendarDaysIcon data-icon="inline-start" />
              <span className="truncate">{formatDateFilterLabel(selectedRange)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={selectedRange}
              onSelect={(nextRange) =>
                onFiltersChange((previous) => ({
                  ...previous,
                  createdFrom: nextRange?.from ? format(nextRange.from, "yyyy-MM-dd") : "",
                  createdTo: nextRange?.to ? format(nextRange.to, "yyyy-MM-dd") : "",
                }))
              }
              defaultMonth={selectedRange?.from}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm" onClick={onReset} className="h-9 px-3">
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      </div>
    </div>
  )
}
