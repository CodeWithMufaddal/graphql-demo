import type { TypedDocumentNode } from "@apollo/client/core"
import { gql } from "@apollo/client/core"
import type { PageQueryOptionsInput, PaginatedResponse } from "@/lib/graphql/types"

import {
  POST_CARD_FIELDS_FRAGMENT,
  POSTS_PAGE_ENVELOPE_FIELDS_FRAGMENT,
  POST_WITH_COMMENTS_FIELDS_FRAGMENT,
} from "./fragments"

export type PostAuthor = {
  id: string
  name: string
  username: string
  email: string
}

export type CommentPreview = {
  id: string
  name: string
  email: string
  body: string
}

export type PostCard = {
  id: string
  title: string
  body: string
  user: PostAuthor | null
}

export type PostWithComments = PostCard & {
  comments: {
    data: CommentPreview[]
  }
}

export type GetPostsQueryData = {
  posts: PaginatedResponse<PostCard>
}

export type GetPostsQueryVariables = {
  options?: PageQueryOptionsInput
}

export type GetPostsWithCommentsQueryData = {
  posts: PaginatedResponse<PostWithComments>
}

export type GetPostsWithCommentsQueryVariables = {
  options?: PageQueryOptionsInput
}

export const GET_POSTS_QUERY: TypedDocumentNode<
  GetPostsQueryData,
  GetPostsQueryVariables
> = gql`
  query GetPosts($options: PageQueryOptions) {
    posts(options: $options) {
      ...PostsPageEnvelopeFields
      data {
        ...PostCardFields
      }
    }
  }
  ${POSTS_PAGE_ENVELOPE_FIELDS_FRAGMENT}
  ${POST_CARD_FIELDS_FRAGMENT}
`

export const GET_POSTS_WITH_COMMENTS_QUERY: TypedDocumentNode<
  GetPostsWithCommentsQueryData,
  GetPostsWithCommentsQueryVariables
> = gql`
  query GetPostsWithComments($options: PageQueryOptions) {
    posts(options: $options) {
      ...PostsPageEnvelopeFields
      data {
        ...PostWithCommentsFields
      }
    }
  }
  ${POSTS_PAGE_ENVELOPE_FIELDS_FRAGMENT}
  ${POST_WITH_COMMENTS_FIELDS_FRAGMENT}
`
