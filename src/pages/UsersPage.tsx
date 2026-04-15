import { useMemo } from "react"
import { MoreHorizontalIcon, PlusIcon, TablePropertiesIcon, UsersRoundIcon } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { ServerDataTable } from "@/components/data-table/server-data-table"
import { UsersTableToolbar } from "@/components/data-table/users-table-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUsersTable } from "@/features/users/hooks/useUsersTable"
import { type UsersTableRow } from "@/features/users/table/users-table-server"
import { statusVariant } from "@/features/dashboard/ui-utils"

export function UsersPage() {
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
    loadFilterOptions,
  } = useUsersTable()

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  const columns = useMemo<ColumnDef<UsersTableRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Select all rows on page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label={`Select row ${row.original.id}`}
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 52,
        minSize: 52,
        maxSize: 52,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 220,
        minSize: 180,
        maxSize: 320,
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
        size: 260,
        minSize: 220,
        maxSize: 360,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 220,
        minSize: 180,
        maxSize: 320,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 140,
        minSize: 120,
        maxSize: 180,
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 140,
        minSize: 120,
        maxSize: 180,
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 140,
        minSize: 120,
        maxSize: 180,
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        size: 120,
        minSize: 100,
        maxSize: 140,
        cell: () => (
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Open row actions</span>
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="border-b">
            <CardDescription>Total records</CardDescription>
            <CardTitle>{totalCount}</CardTitle>
            <CardAction>
              <UsersRoundIcon className="text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Server-side pagination enabled
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardDescription>Selected rows</CardDescription>
            <CardTitle>{selectedCount}</CardTitle>
            <CardAction>
              <TablePropertiesIcon className="text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Persisted across interactions
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardDescription>Server controls</CardDescription>
            <CardTitle>Search + Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 py-4">
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              Invite User
            </Button>
            <Button variant="outline" size="sm" onClick={() => setColumnSizing({})}>
              Reset Widths
            </Button>
          </CardContent>
        </Card>
      </div>

      <UsersTableToolbar
        globalSearchInput={globalSearchInput}
        onGlobalSearchChange={setGlobalSearchInput}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        loadFilterOptions={loadFilterOptions}
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
