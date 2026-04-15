import { gql } from "@apollo/client/core"

export const POSTS_PAGE_ENVELOPE_FIELDS_FRAGMENT = gql`
  fragment PostsPageEnvelopeFields on PostsPage {
    meta {
      totalCount
    }
    links {
      first {
        page
        limit
      }
      prev {
        page
        limit
      }
      next {
        page
        limit
      }
      last {
        page
        limit
      }
    }
  }
`

export const POST_AUTHOR_FIELDS_FRAGMENT = gql`
  fragment PostAuthorFields on User {
    id
    name
    username
    email
  }
`

export const COMMENT_PREVIEW_FIELDS_FRAGMENT = gql`
  fragment CommentPreviewFields on Comment {
    id
    name
    email
    body
  }
`

export const POST_CARD_FIELDS_FRAGMENT = gql`
  fragment PostCardFields on Post {
    id
    title
    body
    user {
      ...PostAuthorFields
    }
  }
  ${POST_AUTHOR_FIELDS_FRAGMENT}
`

export const POST_WITH_COMMENTS_FIELDS_FRAGMENT = gql`
  fragment PostWithCommentsFields on Post {
    id
    title
    body
    user {
      ...PostAuthorFields
    }
    comments {
      data {
        ...CommentPreviewFields
      }
    }
  }
  ${POST_AUTHOR_FIELDS_FRAGMENT}
  ${COMMENT_PREVIEW_FIELDS_FRAGMENT}
`
