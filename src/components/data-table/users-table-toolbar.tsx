import { CalendarDaysIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { AsyncMultiSelect } from "@/components/filters/async-multi-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type {
  FilterOptionsRequest,
  FilterOptionsResponse,
  UsersServerFilters,
} from "@/features/users/table/users-table-server"

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
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="grid gap-2 md:grid-cols-[2fr_1fr_1fr] xl:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={globalSearchInput}
            onChange={(event) => onGlobalSearchChange(event.target.value)}
            placeholder="Search name, username, email, company..."
            className="pl-8"
          />
        </div>
        <AsyncMultiSelect
          label="Roles"
          selected={filters.roles}
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
          loadOptions={(request) => loadFilterOptions("companies", request)}
          onChange={(nextSelected) =>
            onFiltersChange((previous) => ({
              ...previous,
              companies: nextSelected,
            }))
          }
        />
      </div>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <CalendarDaysIcon className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
          <Input
            type="date"
            value={filters.createdFrom}
            onChange={(event) =>
              onFiltersChange((previous) => ({
                ...previous,
                createdFrom: event.target.value,
              }))
            }
            className="pl-8"
          />
        </div>
        <div className="relative">
          <CalendarDaysIcon className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
          <Input
            type="date"
            value={filters.createdTo}
            onChange={(event) =>
              onFiltersChange((previous) => ({
                ...previous,
                createdTo: event.target.value,
              }))
            }
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={onReset}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset filters
        </Button>
      </div>
    </div>
  )
}
