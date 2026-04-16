import type { TypedDocumentNode } from "@apollo/client/core"
import { gql } from "@apollo/client/core"
import type { PageQueryOptionsInput } from "@/lib/graphql/types"

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
    meta: {
      totalCount: number
    } | null
    data: UserDirectoryRow[]
  }
}

export type GetUsersQueryVariables = {
  options?: PageQueryOptionsInput
}

export const GET_USERS_QUERY: TypedDocumentNode<
  GetUsersQueryData,
  GetUsersQueryVariables
> = gql`
  query GetUsers($options: PageQueryOptions) {
    users(options: $options) {
      meta {
        totalCount
      }
      data {
        ...UserDirectoryFields
      }
    }
  }
  ${USER_DIRECTORY_FIELDS_FRAGMENT}
`

export type GetUserByIdQueryData = {
  user: UserDirectoryRow | null
}

export type GetUserByIdQueryVariables = {
  id: string
}

export const GET_USER_BY_ID_QUERY: TypedDocumentNode<
  GetUserByIdQueryData,
  GetUserByIdQueryVariables
> = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      ...UserDirectoryFields
    }
  }
  ${USER_DIRECTORY_FIELDS_FRAGMENT}
`

export type UserGeoInput = {
  lng?: number
  lat?: number
}

export type UserAddressInput = {
  zipcode?: string
  suite?: string
  street?: string
  city?: string
  geo?: UserGeoInput
}

export type UserCompanyInput = {
  name?: string
  catchPhrase?: string
  bs?: string
}

export type UserInput = {
  website?: string
  username: string
  phone?: string
  name: string
  email: string
  company?: UserCompanyInput
  address?: UserAddressInput
}

export type CreateUserMutationData = {
  createUser: UserDirectoryRow | null
}

export type CreateUserMutationVariables = {
  input: UserInput
}

export const CREATE_USER_MUTATION: TypedDocumentNode<
  CreateUserMutationData,
  CreateUserMutationVariables
> = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserDirectoryFields
    }
  }
  ${USER_DIRECTORY_FIELDS_FRAGMENT}
`

export type UpdateUserByIdMutationData = {
  updateUser: UserDirectoryRow | null
}

export type UpdateUserByIdMutationVariables = {
  id: string
  input: UserInput
}

export const UPDATE_USER_BY_ID_MUTATION: TypedDocumentNode<
  UpdateUserByIdMutationData,
  UpdateUserByIdMutationVariables
> = gql`
  mutation UpdateUserById($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserDirectoryFields
    }
  }
  ${USER_DIRECTORY_FIELDS_FRAGMENT}
`

export type DeleteUserByIdMutationData = {
  deleteUser: boolean | null
}

export type DeleteUserByIdMutationVariables = {
  id: string
}

export const DELETE_USER_BY_ID_MUTATION: TypedDocumentNode<
  DeleteUserByIdMutationData,
  DeleteUserByIdMutationVariables
> = gql`
  mutation DeleteUserById($id: ID!) {
    deleteUser(id: $id)
  }
`
