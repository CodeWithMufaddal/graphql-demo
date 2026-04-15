import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  ColumnPinningState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table"

export type StateUpdater<TState> =
  | TState
  | ((previous: TState) => TState)

export type DataTableQuery<TFilters> = {
  pageIndex: number
  pageSize: number
  sorting: SortingState
  globalSearch: string
  filters: TFilters
}

export type DataTableResult<TRow> = {
  rows: TRow[]
  totalCount: number
}

type UseDataTableOptions<TRow, TFilters> = {
  fetchData: (query: DataTableQuery<TFilters>) => Promise<DataTableResult<TRow>>
  defaultFilters: TFilters
  initialPagination?: PaginationState
  initialSorting?: SortingState
  initialColumnSizing?: ColumnSizingState
  initialColumnPinning?: ColumnPinningState
  initialGlobalSearchInput?: string
  globalSearchDebounceMs?: number
  loadingErrorMessage?: string
}

function applyUpdater<TState>(updater: StateUpdater<TState>, previous: TState) {
  if (typeof updater === "function") {
    return (updater as (previous: TState) => TState)(previous)
  }

  return updater
}

export function useDataTable<TRow, TFilters>({
  fetchData,
  defaultFilters,
  initialPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
  initialSorting = [],
  initialColumnSizing = {},
  initialColumnPinning = {},
  initialGlobalSearchInput = "",
  globalSearchDebounceMs = 350,
  loadingErrorMessage = "Unable to load table data.",
}: UseDataTableOptions<TRow, TFilters>) {
  const hasLoadedRef = useRef(false)
  const [rows, setRows] = useState<TRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [pagination, setPagination] = useState<PaginationState>(initialPagination)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(initialColumnSizing)
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialColumnPinning)
  const [globalSearchInput, setGlobalSearchInput] = useState(initialGlobalSearchInput)
  const [globalSearch, setGlobalSearch] = useState(initialGlobalSearchInput)
  const [filters, setFiltersState] = useState<TFilters>(defaultFilters)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGlobalSearch(globalSearchInput)
      setPagination((previous) => ({
        ...previous,
        pageIndex: 0,
      }))
    }, globalSearchDebounceMs)

    return () => window.clearTimeout(timer)
  }, [globalSearchInput, globalSearchDebounceMs])

  const queryParams = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      globalSearch,
      filters,
    }),
    [pagination.pageIndex, pagination.pageSize, sorting, globalSearch, filters]
  )

  useEffect(() => {
    let cancelled = false
    const firstLoad = !hasLoadedRef.current

    async function run() {
      if (firstLoad) {
        setIsLoading(true)
      } else {
        setIsRefetching(true)
      }
      setError(null)

      try {
        const response = await fetchData(queryParams)

        if (cancelled) {
          return
        }

        setRows(response.rows)
        setTotalCount(response.totalCount)
        hasLoadedRef.current = true
      } catch (fetchError) {
        if (cancelled) {
          return
        }
        setError(fetchError instanceof Error ? fetchError.message : loadingErrorMessage)
        setRows([])
        setTotalCount(0)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          setIsRefetching(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [fetchData, loadingErrorMessage, queryParams])

  const setFilters = useCallback((updater: StateUpdater<TFilters>) => {
    setFiltersState((previous) => applyUpdater(updater, previous))
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }, [])

  const setSortingAndResetPage = useCallback<OnChangeFn<SortingState>>((updater) => {
    setSorting((previous) =>
      typeof updater === "function" ? updater(previous) : updater
    )
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters)
    setGlobalSearchInput("")
    setGlobalSearch("")
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }, [defaultFilters])

  return {
    rows,
    totalCount,
    isLoading,
    isRefetching,
    error,
    pagination,
    setPagination,
    sorting,
    setSorting: setSortingAndResetPage,
    rowSelection,
    setRowSelection,
    columnSizing,
    setColumnSizing,
    columnPinning,
    setColumnPinning,
    globalSearchInput,
    setGlobalSearchInput,
    filters,
    setFilters,
    resetFilters,
  }
}
