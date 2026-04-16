import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import {
  buildFilterOptions,
  delay,
  resolveTableQuery,
  type FilterOptionsRequest,
  type FilterOptionsResponse,
} from "@/lib/data-table/local-table-workflow"
import { apolloClient } from "@/lib/apollo/client"
import { GET_POSTS_QUERY } from "@/modules/posts/graphql"

export type {
  FilterOption,
  FilterOptionsRequest,
  FilterOptionsResponse,
} from "@/lib/data-table/local-table-workflow"

export type PostsServerFilters = {
  authors: string[]
  authorStates: string[]
}

export type PostsTableRow = {
  id: string
  title: string
  body: string
  authorName: string
  authorUsername: string
  authorState: "Known" | "Unknown"
}

let postsDatasetCache: PostsTableRow[] | null = null

async function loadPostsDataset() {
  if (postsDatasetCache) {
    return postsDatasetCache
  }

  const result = await apolloClient.query({
    query: GET_POSTS_QUERY,
    variables: {
      options: {
        paginate: {
          page: 1,
          limit: 100,
        },
      },
    },
  })

  const posts = result.data?.posts?.data ?? []
  if (posts.length === 0) {
    throw new Error("No posts returned by GraphQLZero.")
  }

  postsDatasetCache = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    authorName: post.user?.name ?? "Unknown author",
    authorUsername: post.user?.username ?? "unknown",
    authorState: post.user ? "Known" : "Unknown",
  }))

  return postsDatasetCache
}

export async function fetchPostsTable(
  query: DataTableQuery<PostsServerFilters>
): Promise<DataTableResult<PostsTableRow>> {
  const source = await loadPostsDataset()
  await delay(220)

  return resolveTableQuery({
    rows: source,
    query,
    toSearchText: (row) =>
      `${row.id} ${row.title} ${row.body} ${row.authorName} ${row.authorUsername}`,
    matchesFilters: (row, filters) => {
      if (filters.authors.length > 0 && !filters.authors.includes(row.authorName)) {
        return false
      }

      if (filters.authorStates.length > 0 && !filters.authorStates.includes(row.authorState)) {
        return false
      }

      return true
    },
    sortComparators: {
      id: (left, right, desc) => {
        const leftId = Number(left.id)
        const rightId = Number(right.id)

        if (!Number.isFinite(leftId) || !Number.isFinite(rightId) || leftId === rightId) {
          return 0
        }

        return desc ? rightId - leftId : leftId - rightId
      },
    },
  })
}

export async function fetchPostAuthorOptions(
  request: FilterOptionsRequest
): Promise<FilterOptionsResponse> {
  const source = await loadPostsDataset()
  await delay(140)

  const authorNames = Array.from(new Set(source.map((row) => row.authorName)))
  return buildFilterOptions(authorNames, request)
}
