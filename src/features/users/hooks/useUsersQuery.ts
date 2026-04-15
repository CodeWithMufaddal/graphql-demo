import { useQuery } from "@apollo/client/react"

import {
  GET_USERS_QUERY,
  type GetUsersQueryData,
  type GetUsersQueryVariables,
} from "../graphql/queries"

type UseUsersQueryParams = {
  page?: number
  limit?: number
}

export function useUsersQuery({ page = 1, limit = 12 }: UseUsersQueryParams = {}) {
  return useQuery<GetUsersQueryData, GetUsersQueryVariables>(GET_USERS_QUERY, {
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
