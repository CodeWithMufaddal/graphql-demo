import { createApolloTableFetcher } from "@/lib/apollo/table-query"
import {
  GET_POSTS_QUERY,
  type GetPostsQueryData,
  type GetPostsQueryVariables,
  type PostCard,
} from "@/modules/posts/graphql"

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

const SORT_FIELD_BY_COLUMN = {
  id: "id",
  title: "title",
  body: "body",
  authorName: "user.name",
  authorUsername: "user.username",
} as const

export const fetchPostsTable = createApolloTableFetcher<
  GetPostsQueryData,
  GetPostsQueryVariables,
  PostCard,
  PostsTableRow,
  PostsServerFilters
>({
  query: GET_POSTS_QUERY,
  selectPage: (data) => data?.posts,
  mapRow: toTableRow,
  sortFieldByColumn: SORT_FIELD_BY_COLUMN,
})
