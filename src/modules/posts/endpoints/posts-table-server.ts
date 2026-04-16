import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import { apolloClient } from "@/lib/apollo/client"
import type { PageQueryOptionsInput } from "@/lib/graphql/types"
import { GET_POSTS_QUERY, type PostCard } from "@/modules/posts/graphql"

export type PostsServerFilters = Record<string, never>

export type PostsTableRow = {
  id: string
  title: string
  body: string
  authorName: string
  authorUsername: string
  authorState: "Known" | "Unknown"
}

function toTableRow(post: PostCard): PostsTableRow {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorName: post.user?.name ?? "Unknown author",
    authorUsername: post.user?.username ?? "unknown",
    authorState: post.user ? "Known" : "Unknown",
  }
}

function toSortField(columnId: string) {
  switch (columnId) {
    case "id":
    case "title":
    case "body":
      return columnId
    case "authorName":
      return "user.name"
    case "authorUsername":
      return "user.username"
    default:
      return undefined
  }
}

function buildPostsOptions(
  query: DataTableQuery<PostsServerFilters>,
  limit: number
): PageQueryOptionsInput {
  const searchQuery = query.globalSearch.trim()
  const firstSort = query.sorting[0]
  const sortField = firstSort ? toSortField(firstSort.id) : undefined

  return {
    paginate: {
      page: query.pageIndex + 1,
      limit,
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

async function queryPosts(options: PageQueryOptionsInput) {
  const response = await apolloClient.query({
    query: GET_POSTS_QUERY,
    variables: { options },
    fetchPolicy: "cache-first",
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  return response.data?.posts
}

export async function fetchPostsTable(
  query: DataTableQuery<PostsServerFilters>
): Promise<DataTableResult<PostsTableRow>> {
  const postsPage = await queryPosts(buildPostsOptions(query, query.pageSize))
  const posts = postsPage?.data ?? []
  const rows = posts.map(toTableRow)
  const totalCount =
    postsPage?.meta?.totalCount ??
    query.pageIndex * query.pageSize + rows.length + (rows.length === query.pageSize ? 1 : 0)

  return {
    rows,
    totalCount,
  }
}
