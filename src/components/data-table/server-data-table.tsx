import type { CSSProperties } from "react"
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react"
import {
  type ColumnDef,
  type ColumnPinningState,
  type ColumnSizingState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ServerDataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  totalCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  rowSelection: RowSelectionState
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  columnPinning: ColumnPinningState
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
  columnSizing: ColumnSizingState
  onColumnSizingChange: OnChangeFn<ColumnSizingState>
  isLoading?: boolean
  isRefetching?: boolean
  getRowId?: (row: TData, index: number) => string
}

function getSortIcon(direction: false | "asc" | "desc") {
  if (direction === "asc") {
    return <ArrowUpIcon className="size-3.5" />
  }

  if (direction === "desc") {
    return <ArrowDownIcon className="size-3.5" />
  }

  return <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
}

export function ServerDataTable<TData>({
  columns,
  data,
  totalCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  columnPinning,
  onColumnPinningChange,
  columnSizing,
  onColumnSizingChange,
  isLoading = false,
  isRefetching = false,
  getRowId,
}: ServerDataTableProps<TData>) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize))

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      rowSelection,
      columnPinning,
      columnSizing,
    },
    getRowId,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
    columnResizeMode: "onChange",
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange,
    onColumnPinningChange,
    onColumnSizingChange,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
  })

  const start = totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const end = Math.min(totalCount, (pagination.pageIndex + 1) * pagination.pageSize)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table className="min-w-[980px] table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sortDirection = header.column.getIsSorted()
                    const sortIndex = header.column.getSortIndex()

                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                        }}
                        className="relative bg-card px-2"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-between gap-2">
                            {canSort ? (
                              <button
                                type="button"
                                className="inline-flex min-w-0 items-center gap-1 text-left"
                                onClick={header.column.getToggleSortingHandler()}
                                title="Click to sort. Shift+click for multi-sort."
                              >
                                <span className="truncate">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                {getSortIcon(sortDirection)}
                                {sortIndex > -1 && sorting.length > 1 ? (
                                  <span className="text-[10px] text-muted-foreground">
                                    {sortIndex + 1}
                                  </span>
                                ) : null}
                              </button>
                            ) : (
                              <span className="truncate">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                            )}
                          </div>
                        )}
                        {header.column.getCanResize() ? (
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none select-none bg-transparent hover:bg-border"
                          />
                        ) : null}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => {
                      const column = cell.column
                      const isPinned = column.getIsPinned()
                      const isLastLeftPinnedColumn =
                        isPinned === "left" && column.getIsLastColumn("left")
                      const isFirstRightPinnedColumn =
                        isPinned === "right" && column.getIsFirstColumn("right")

                      const pinningStyles: CSSProperties = {
                        width: column.getSize(),
                        minWidth: column.columnDef.minSize,
                        maxWidth: column.columnDef.maxSize,
                        position: isPinned ? "sticky" : "relative",
                        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
                        right:
                          isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
                        zIndex: isPinned ? 2 : 1,
                        background: "var(--color-card)",
                        boxShadow: isLastLeftPinnedColumn
                          ? "-4px 0 6px -6px rgba(0,0,0,0.35) inset"
                          : isFirstRightPinnedColumn
                            ? "4px 0 6px -6px rgba(0,0,0,0.35) inset"
                            : undefined,
                      }

                      return (
                        <TableCell key={cell.id} style={pinningStyles} className="px-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    {isLoading ? "Loading rows..." : "No rows found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-card px-3 py-2 md:flex-row md:items-center md:justify-between">
        <div className="text-xs text-muted-foreground">
          Showing {start}-{end} of {totalCount} rows
          {isRefetching ? " (refreshing...)" : ""}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) =>
              table.setPageSize(Number(value))
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <span className="px-2 text-xs text-muted-foreground">
            Page {pagination.pageIndex + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}
