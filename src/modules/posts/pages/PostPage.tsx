import { useMemo, useState } from "react"
import {
  CopyIcon,
  FileTextIcon,
  RefreshCwIcon,
  TablePropertiesIcon,
  UserRoundIcon,
} from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { MetricCard } from "@/components/dashboard/metric-card"
import { ServerDataTable } from "@/components/data-table/server-data-table"
import {
  TableToolbar,
  type TableToolbarField,
} from "@/components/data-table/table-toolbar"
import { Button } from "@/components/ui/button"
import { useDataTable } from "@/hooks/use-data-table"
import {
  fetchPostsTable,
  type PostsServerFilters,
  type PostsTableRow,
} from "@/modules/posts/endpoints"

function getBodyPreview(body: string, maxLength = 88) {
  if (body.length <= maxLength) {
    return body
  }

  return `${body.slice(0, maxLength).trimEnd()}...`
}

const defaultFilters: PostsServerFilters = {}

export function PostsPage() {
  const [copyingRowId, setCopyingRowId] = useState<string | null>(null)

  const {
    rows,
    totalCount,
    pagination,
    rowSelection,
    isRefetching,
    serverDataTableProps,
    globalSearchInput,
    setGlobalSearchInput,
    filters,
    setFilters,
    resetFilters,
    refresh,
  } = useDataTable<PostsTableRow, PostsServerFilters>({
    fetchData: fetchPostsTable,
    defaultFilters,
    initialPagination: {
      pageIndex: 0,
      pageSize: 8,
    },
    initialSorting: [
      {
        id: "id",
        desc: false,
      },
    ],
    loadingErrorMessage: "Unable to load posts table data.",
  })

  const uniqueAuthors = useMemo(
    () =>
      new Set(
        rows
          .map((post) => post.authorName)
          .filter((authorName) => authorName !== "Unknown author")
      ).size,
    [rows]
  )

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  async function handleCopyPostId(postId: string) {
    setCopyingRowId(postId)

    try {
      await navigator.clipboard.writeText(postId)
      toast.success(`Copied post id ${postId}.`)
    } catch {
      toast.error("Unable to copy post id.")
    } finally {
      setCopyingRowId(null)
    }
  }

  const fields = useMemo<TableToolbarField<PostsServerFilters>[]>(
    () => [],
    []
  )

  const columns = useMemo<ColumnDef<PostsTableRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 72,
        cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex max-w-[320px] min-w-0 flex-col">
            <span className="truncate font-medium">{row.original.title}</span>
          </div>
        ),
      },
      {
        accessorKey: "body",
        header: "Body Preview",
        enableSorting: false,
        cell: ({ row }) => (
          <p className="max-w-[420px] line-clamp-2 text-muted-foreground">
            {getBodyPreview(row.original.body)}
          </p>
        ),
      },
      {
        accessorKey: "authorName",
        header: "Author",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.authorName}</p>
            <p className="truncate text-xs text-muted-foreground">@{row.original.authorUsername}</p>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableResizing: false,
        size: 52,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleCopyPostId(row.original.id)}
              disabled={copyingRowId === row.original.id}
            >
              <CopyIcon />
              <span className="sr-only">Copy post id {row.original.id}</span>
            </Button>
          </div>
        ),
      },
    ],
    [copyingRowId]
  )

  const currentPage = pagination.pageIndex + 1

  const totalPages = Math.max(1, Math.ceil(totalCount / pagination.pageSize))

  const selectedDisplay = `${selectedCount} selected`

  const pageDisplay = `Page ${currentPage} / ${totalPages}`

  const searchPlaceholder = "Search id, title, body, author..."

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <MetricCard
          label="Total posts"
          value={totalCount}
          icon={<FileTextIcon className="text-muted-foreground" />}
        />
        <MetricCard
          label="Selected rows"
          value={selectedCount}
          icon={<TablePropertiesIcon className="text-muted-foreground" />}
        />
        <MetricCard
          label="Unique authors (page)"
          value={uniqueAuthors}
          icon={<UserRoundIcon className="text-muted-foreground" />}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {selectedDisplay} | {pageDisplay}
        </p>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isRefetching}>
          <RefreshCwIcon
            data-icon="inline-start"
            className={isRefetching ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      <TableToolbar
        globalSearchInput={globalSearchInput}
        onGlobalSearchChange={setGlobalSearchInput}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        fields={fields}
      />

      <ServerDataTable
        columns={columns}
        {...serverDataTableProps}
        getRowId={(row) => row.id}
      />

      <p className="text-xs text-muted-foreground">
        Multi-sort is enabled: click a column header, then Shift+click additional columns.
      </p>
    </div>
  )
}
