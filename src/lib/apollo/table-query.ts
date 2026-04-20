import type { TypedDocumentNode } from "@apollo/client/core"
import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import type { PageQueryOptionsInput } from "@/lib/graphql/types"

import { apolloClient } from "./client"

type TablePage<TItem> = {
  meta?: {
    totalCount?: number | null
  } | null
  data?: TItem[] | null
} | null | undefined

type QueryVariablesWithOptions = {
  options?: PageQueryOptionsInput
}

type CreateApolloTableFetcherOptions<TQueryData, TQueryVariables, TItem, TRow> = {
  query: TypedDocumentNode<TQueryData, TQueryVariables>
  selectPage: (data: TQueryData | undefined) => TablePage<TItem>
  mapRow: (item: TItem) => TRow
  sortFieldByColumn: Partial<Record<string, string>>
}

function buildPageQueryOptions<TFilters>(
  query: DataTableQuery<TFilters>,
  sortFieldByColumn: Partial<Record<string, string>>
): PageQueryOptionsInput {
  const firstSort = query.sorting[0]
  const sortField = firstSort ? sortFieldByColumn[firstSort.id] : undefined
  const searchQuery = query.globalSearch.trim()

  return {
    paginate: {
      page: query.pageIndex + 1,
      limit: query.pageSize,
    },
    search: searchQuery ? { q: searchQuery } : undefined,
    sort:
      firstSort && sortField
        ? {
            field: sortField,
            order: firstSort.desc ? "DESC" : "ASC",
          }
        : undefined,
  }
}

export function createApolloTableFetcher<
  TQueryData,
  TQueryVariables extends QueryVariablesWithOptions,
  TItem,
  TRow,
  TFilters,
>({
  query,
  selectPage,
  mapRow,
  sortFieldByColumn,
}: CreateApolloTableFetcherOptions<TQueryData, TQueryVariables, TItem, TRow>) {
  return async function fetchTableData(
    queryState: DataTableQuery<TFilters>
  ): Promise<DataTableResult<TRow>> {
    const options = buildPageQueryOptions(queryState, sortFieldByColumn)

    const response = await apolloClient.query<TQueryData, TQueryVariables>({
      query,
      variables: { options } as TQueryVariables,
      fetchPolicy: "cache-first",
    })

    const page = selectPage(response.data)
    const rows = (page?.data ?? []).map(mapRow)

    return {
      rows,
      totalCount:
        page?.meta?.totalCount ??
        queryState.pageIndex * queryState.pageSize +
          rows.length +
          (rows.length === queryState.pageSize ? 1 : 0),
    }
  }
}
