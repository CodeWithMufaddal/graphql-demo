import type { TypedDocumentNode } from "@apollo/client/core"
import { gql } from "@apollo/client/core"

import { USER_DIRECTORY_FIELDS_FRAGMENT } from "./fragments"

export type UserDirectoryRow = {
  id: string
  name: string
  username: string
  email: string
  phone: string | null
  website: string | null
  company: {
    name: string
    catchPhrase: string | null
    bs: string | null
  } | null
  address: {
    city: string | null
    street: string | null
    suite: string | null
    zipcode: string | null
    geo: {
      lat: string | null
      lng: string | null
    } | null
  } | null
}

export type GetUsersQueryData = {
  users: {
    data: UserDirectoryRow[]
  }
}

export type GetUsersQueryVariables = {
  options?: {
    paginate?: {
      page?: number
      limit?: number
    }
  }
}

export const GET_USERS_QUERY: TypedDocumentNode<
  GetUsersQueryData,
  GetUsersQueryVariables
> = gql`
  query GetUsers($options: PageQueryOptions) {
    users(options: $options) {
      data {
        ...UserDirectoryFields
      }
    }
  }
  ${USER_DIRECTORY_FIELDS_FRAGMENT}
`
