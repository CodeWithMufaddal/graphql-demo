import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type {
  ColumnPinningState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table"

import {
  fetchFilterOptions,
  fetchUsersTable,
  type FilterOptionsRequest,
  type FilterOptionsResponse,
  type UsersServerFilters,
  type UsersTableRow,
} from "@/features/users/table/users-table-server"

const defaultFilters: UsersServerFilters = {
  roles: [],
  statuses: [],
  companies: [],
  createdFrom: "",
  createdTo: "",
}

export function useUsersTable() {
  const hasLoadedRef = useRef(false)
  const [rows, setRows] = useState<UsersTableRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({
    select: 52,
    name: 220,
    email: 260,
    company: 220,
    createdAt: 140,
    actions: 120,
  })
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select", "name"],
    right: ["actions"],
  })
  const [globalSearchInput, setGlobalSearchInput] = useState("")
  const [globalSearch, setGlobalSearch] = useState("")
  const [filters, setFilters] = useState<UsersServerFilters>(defaultFilters)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGlobalSearch(globalSearchInput)
      setPagination((previous) => ({
        ...previous,
        pageIndex: 0,
      }))
    }, 350)

    return () => window.clearTimeout(timer)
  }, [globalSearchInput])

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
        const response = await fetchUsersTable(queryParams)

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
        setError(
          fetchError instanceof Error ? fetchError.message : "Unable to load users table data."
        )
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
  }, [queryParams])

  const updateFilters = useCallback(
    (updater: (previous: UsersServerFilters) => UsersServerFilters) => {
      setFilters((previous) => updater(previous))
      setPagination((previous) => ({
        ...previous,
        pageIndex: 0,
      }))
    },
    []
  )

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
    setFilters(defaultFilters)
    setGlobalSearchInput("")
    setGlobalSearch("")
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
  }, [])

  const loadFilterOptions = useCallback(
    async (
      kind: "roles" | "statuses" | "companies",
      request: FilterOptionsRequest
    ): Promise<FilterOptionsResponse> => {
      return fetchFilterOptions(kind, request)
    },
    []
  )

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
    setFilters: updateFilters,
    resetFilters,
    loadFilterOptions,
  }
}
