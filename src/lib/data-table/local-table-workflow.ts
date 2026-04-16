import type { SortingState } from "@tanstack/react-table"

import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"

export type FilterOption = {
  label: string
  value: string
}

export type FilterOptionsRequest = {
  search: string
  page: number
  pageSize: number
}

export type FilterOptionsResponse = {
  options: FilterOption[]
  hasMore: boolean
}

type SortComparator<TData> = (left: TData, right: TData, desc: boolean) => number

type ResolveTableQueryOptions<TData, TFilters> = {
  rows: TData[]
  query: DataTableQuery<TFilters>
  toSearchText: (row: TData) => string
  matchesFilters: (row: TData, filters: TFilters) => boolean
  sortComparators?: Record<string, SortComparator<TData>>
  fallbackSortValue?: (row: TData, sortField: string) => string | number | null | undefined
}

export function compareText(left: string, right: string, desc: boolean) {
  const normalizedLeft = left.toLowerCase()
  const normalizedRight = right.toLowerCase()

  if (normalizedLeft === normalizedRight) {
    return 0
  }

  const result = normalizedLeft > normalizedRight ? 1 : -1
  return desc ? -result : result
}

export function compareNumber(left: number, right: number, desc: boolean) {
  if (left === right) {
    return 0
  }

  return desc ? right - left : left - right
}

function applySearch<TData>(rows: TData[], query: string, toSearchText: (row: TData) => string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return rows
  }

  return rows.filter((row) => toSearchText(row).toLowerCase().includes(normalizedQuery))
}

function applyFilters<TData, TFilters>(
  rows: TData[],
  filters: TFilters,
  matchesFilters: (row: TData, filters: TFilters) => boolean
) {
  return rows.filter((row) => matchesFilters(row, filters))
}

function toSortableString(value: unknown) {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
}

function applySorting<TData>(
  rows: TData[],
  sorting: SortingState,
  sortComparators: Record<string, SortComparator<TData>>,
  fallbackSortValue: (row: TData, sortField: string) => string | number | null | undefined
) {
  if (sorting.length === 0) {
    return rows
  }

  const sorted = [...rows]
  sorted.sort((left, right) => {
    for (const sort of sorting) {
      const { id, desc } = sort
      const comparator = sortComparators[id]

      if (comparator) {
        const result = comparator(left, right, desc)
        if (result !== 0) {
          return result
        }
        continue
      }

      const leftValue = fallbackSortValue(left, id)
      const rightValue = fallbackSortValue(right, id)

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        const result = compareNumber(leftValue, rightValue, desc)
        if (result !== 0) {
          return result
        }
        continue
      }

      const result = compareText(toSortableString(leftValue), toSortableString(rightValue), desc)
      if (result !== 0) {
        return result
      }
    }

    return 0
  })

  return sorted
}

function paginateRows<TData>(rows: TData[], pageIndex: number, pageSize: number) {
  const start = pageIndex * pageSize
  return rows.slice(start, start + pageSize)
}

export function resolveTableQuery<TData, TFilters>({
  rows,
  query,
  toSearchText,
  matchesFilters,
  sortComparators = {},
  fallbackSortValue = (row, sortField) =>
    (row as Record<string, string | number | null | undefined>)[sortField],
}: ResolveTableQueryOptions<TData, TFilters>): DataTableResult<TData> {
  const searched = applySearch(rows, query.globalSearch, toSearchText)
  const filtered = applyFilters(searched, query.filters, matchesFilters)
  const sorted = applySorting(filtered, query.sorting, sortComparators, fallbackSortValue)
  const paginatedRows = paginateRows(sorted, query.pageIndex, query.pageSize)

  return {
    rows: paginatedRows,
    totalCount: filtered.length,
  }
}

export function buildFilterOptions(
  values: string[],
  request: FilterOptionsRequest
): FilterOptionsResponse {
  const normalizedQuery = request.search.trim().toLowerCase()
  const filtered = values.filter((value) => value.toLowerCase().includes(normalizedQuery))
  const sorted = [...filtered].sort((left, right) => compareText(left, right, false))

  const start = request.page * request.pageSize
  const page = sorted.slice(start, start + request.pageSize)

  return {
    options: page.map((value) => ({
      label: value,
      value,
    })),
    hasMore: start + request.pageSize < sorted.length,
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
