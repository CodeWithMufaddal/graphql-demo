import { CalendarDaysIcon, RotateCcwIcon, SearchIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import {
  AsyncMultiSelect,
  type AsyncSelectOption,
  type AsyncSelectRequest,
  type AsyncSelectResponse,
} from "@/components/filters/async-multi-select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { StateUpdater } from "@/hooks/use-data-table"

type SelectFilterField<TFilters> = {
  type: "select"
  name: keyof TFilters & string
  label: string
  options?: AsyncSelectOption[]
  placeholder?: string
  className?: string
}

type AsyncSelectFilterField<TFilters> = {
  type: "asyncSelect"
  name: keyof TFilters & string
  label: string
  loadOptions: (request: AsyncSelectRequest) => Promise<AsyncSelectResponse>
  placeholder?: string
  className?: string
}

type DateRangeFilterField<TFilters> = {
  type: "dateRange"
  name: string
  label: string
  fromKey?: keyof TFilters & string
  toKey?: keyof TFilters & string
  className?: string
}

export type TableToolbarField<TFilters> =
  | SelectFilterField<TFilters>
  | AsyncSelectFilterField<TFilters>
  | DateRangeFilterField<TFilters>

type TableToolbarProps<TFilters extends Record<string, unknown>> = {
  globalSearchInput: string
  onGlobalSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters: TFilters
  onFiltersChange: (updater: StateUpdater<TFilters>) => void
  onReset: () => void
  fields: TableToolbarField<TFilters>[]
}

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

function formatDateFilterLabel(label: string, range: DateRange | undefined) {
  if (!range?.from && !range?.to) {
    return label
  }

  if (range?.from && range?.to) {
    return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`
  }

  return range?.from ? `From ${format(range.from, "MMM d, yyyy")}` : label
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === "string")
}

function readString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function loadStaticOptions(
  options: AsyncSelectOption[] | undefined,
  request: AsyncSelectRequest
): Promise<AsyncSelectResponse> {
  const source = options ?? []
  const normalizedQuery = request.search.trim().toLowerCase()

  const filtered = source.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  )

  const start = request.page * request.pageSize
  const page = filtered.slice(start, start + request.pageSize)

  return Promise.resolve({
    options: page,
    hasMore: start + request.pageSize < filtered.length,
  })
}

function getSelectedLabelMap(options: AsyncSelectOption[] | undefined) {
  if (!options || options.length === 0) {
    return undefined
  }

  return options.reduce<Record<string, string>>((previous, option) => {
    previous[option.value] = option.label
    return previous
  }, {})
}

export function TableToolbar<TFilters extends Record<string, unknown>>({
  globalSearchInput,
  onGlobalSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFiltersChange,
  onReset,
  fields,
}: TableToolbarProps<TFilters>) {
  return (
    <div className="rounded-lg border bg-card p-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <SearchIcon className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={globalSearchInput}
            onChange={(event) => onGlobalSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-9 pl-8"
          />
        </div>

        {fields.map((field) => {
          if (field.type === "dateRange") {
            const fromKey = field.fromKey ?? `${field.name}From`
            const toKey = field.toKey ?? `${field.name}To`
            const selectedRange: DateRange | undefined =
              readString(filters[fromKey]) || readString(filters[toKey])
                ? {
                    from: parseFilterDate(readString(filters[fromKey])),
                    to: parseFilterDate(readString(filters[toKey])),
                  }
                : undefined

            return (
              <Popover key={`${field.type}:${field.name}`}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={field.className ?? "h-9 min-w-[12rem] justify-start px-3 text-left"}
                  >
                    <CalendarDaysIcon data-icon="inline-start" />
                    <span className="truncate">
                      {formatDateFilterLabel(field.label, selectedRange)}
                    </span>
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
                        [fromKey]: nextRange?.from ? format(nextRange.from, "yyyy-MM-dd") : "",
                        [toKey]: nextRange?.to ? format(nextRange.to, "yyyy-MM-dd") : "",
                      }))
                    }
                    defaultMonth={selectedRange?.from}
                  />
                </PopoverContent>
              </Popover>
            )
          }

          if (field.type === "select") {
            const selectedLabelMap = getSelectedLabelMap(field.options)

            return (
              <AsyncMultiSelect
                key={`${field.type}:${field.name}`}
                label={field.label}
                placeholder={field.placeholder}
                selected={readStringArray(filters[field.name])}
                selectedLabelMap={selectedLabelMap}
                className={field.className ?? "h-9 min-w-[8.5rem] px-2"}
                loadOptions={(request) => loadStaticOptions(field.options, request)}
                onChange={(nextSelected) =>
                  onFiltersChange((previous) => ({
                    ...previous,
                    [field.name]: nextSelected,
                  }))
                }
              />
            )
          }

          return (
            <AsyncMultiSelect
              key={`${field.type}:${field.name}`}
              label={field.label}
              placeholder={field.placeholder}
              selected={readStringArray(filters[field.name])}
              className={field.className ?? "h-9 min-w-[8.5rem] px-2"}
              loadOptions={field.loadOptions}
              onChange={(nextSelected) =>
                onFiltersChange((previous) => ({
                  ...previous,
                  [field.name]: nextSelected,
                }))
              }
            />
          )
        })}

        <Button variant="outline" size="sm" onClick={onReset} className="h-9 px-3">
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      </div>
    </div>
  )
}
