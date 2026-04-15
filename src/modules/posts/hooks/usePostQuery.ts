import { useQuery } from "@apollo/client/react"

import {
  GET_POSTS_QUERY,
  type GetPostsQueryData,
  type GetPostsQueryVariables,
} from "@/modules/posts/graphql"

type UsePostsQueryParams = {
  page?: number
  limit?: number
}

export function usePostsQuery({ page = 1, limit = 8 }: UsePostsQueryParams = {}) {
  return useQuery<GetPostsQueryData, GetPostsQueryVariables>(GET_POSTS_QUERY, {
    variables: {
      options: {
        paginate: {
          page,
          limit,
        },
      },
    },
    notifyOnNetworkStatusChange: true,
  })
}

export const usePostQuery = usePostsQuery
