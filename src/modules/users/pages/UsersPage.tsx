import { useCallback, useMemo } from "react"
import { MoreHorizontalIcon, TablePropertiesIcon, UsersRoundIcon } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { MetricCard } from "@/components/dashboard/metric-card"
import { ServerDataTable } from "@/components/data-table/server-data-table"
import {
  TableToolbar,
  type TableToolbarField,
} from "@/components/data-table/table-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDataTable } from "@/hooks/use-data-table"
import {
  fetchFilterOptions,
  fetchUsersTable,
  type FilterOptionsRequest,
  type UsersServerFilters,
  type UsersTableRow,
} from "@/modules/users/endpoints"
import { statusVariant } from "@/features/dashboard/ui-utils"

const defaultFilters: UsersServerFilters = {
  roles: [],
  statuses: [],
  companies: [],
  createdFrom: "",
  createdTo: "",
}

export function UsersPage() {
  const loadRoles = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("roles", request)
  }, [])

  const loadStatuses = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("statuses", request)
  }, [])

  const loadCompanies = useCallback((request: FilterOptionsRequest) => {
    return fetchFilterOptions("companies", request)
  }, [])

  const {
    rows,
    totalCount,
    isLoading,
    isRefetching,
    error,
    pagination,
    setPagination,
    sorting,
    setSorting,
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
  } = useDataTable<UsersTableRow, UsersServerFilters>({
    fetchData: fetchUsersTable,
    defaultFilters,
    initialSorting: [
      {
        id: "createdAt",
        desc: true,
      },
    ],
    initialColumnPinning: {
      left: ["select", "name"],
      right: ["actions"],
    },
    loadingErrorMessage: "Unable to load users table data.",
  })

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  const fields = useMemo<TableToolbarField<UsersServerFilters>[]>(
    () => [
      {
        type: "asyncSelect",
        name: "roles",
        label: "Roles",
        loadOptions: loadRoles,
        className: "h-9 min-w-[8.25rem] px-2",
      },
      {
        type: "asyncSelect",
        name: "statuses",
        label: "Statuses",
        loadOptions: loadStatuses,
        className: "h-9 min-w-[8.75rem] px-2",
      },
      {
        type: "asyncSelect",
        name: "companies",
        label: "Companies",
        loadOptions: loadCompanies,
        className: "h-9 min-w-[9rem] px-2",
      },
      {
        type: "dateRange",
        name: "createdAt",
        label: "Created date",
        fromKey: "createdFrom",
        toKey: "createdTo",
      },
    ],
    [loadCompanies, loadRoles, loadStatuses]
  )

  const columns = useMemo<ColumnDef<UsersTableRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
              aria-label="Select all rows on page"
            />
            <span className="text-xs text-muted-foreground">#</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
              aria-label={`Select row ${row.original.id}`}
            />
            <span className="text-xs text-muted-foreground tabular-nums">
              {pagination.pageIndex * pagination.pageSize + row.index + 1}
            </span>
          </div>
        ),
        enableSorting: false,
        enableResizing: false,
        size: 88,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{row.original.name}</span>
            <span className="truncate text-xs text-muted-foreground">@{row.original.username}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "company",
        header: "Company",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        size: 120,
        cell: () => (
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Open row actions</span>
          </Button>
        ),
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  )

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <MetricCard
          label="Total records"
          value={totalCount}
          icon={<UsersRoundIcon className="text-muted-foreground" />}
        />
        <MetricCard
          label="Selected rows"
          value={selectedCount}
          icon={<TablePropertiesIcon className="text-muted-foreground" />}
        />
      </div>

      <TableToolbar
        globalSearchInput={globalSearchInput}
        onGlobalSearchChange={setGlobalSearchInput}
        searchPlaceholder="Search name, username, email, company..."
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        fields={fields}
      />

      {error ? (
        <Card>
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <ServerDataTable
        columns={columns}
        data={rows}
        totalCount={totalCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        columnSizing={columnSizing}
        onColumnSizingChange={setColumnSizing}
        isLoading={isLoading}
        isRefetching={isRefetching}
        getRowId={(row) => row.id}
      />

      <p className="text-xs text-muted-foreground">
        Multi-sort is enabled: click a column header, then Shift+click additional columns.
      </p>
    </div>
  )
}
