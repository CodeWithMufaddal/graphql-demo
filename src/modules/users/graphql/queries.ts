import type { TypedDocumentNode } from "@apollo/client/core"
import { gql } from "@apollo/client/core"
import type { PageQueryOptionsInput } from "@/lib/graphql/types"

import { USER_DIRECTORY_FIELDS_FRAGMENT } from "./fragments"

type Nullable<T> = T | null

export type UserDirectoryRow = {
  id: string
  name: string
  username: string
  email: string
  phone: Nullable<string>
  website: Nullable<string>
  // company: Nullable<{
  //   name: string
  //   catchPhrase: Nullable<string>
  //   bs: Nullable<string>
  // }>
  // address: Nullable<{
  //   city: Nullable<string>
  //   street: Nullable<string>
  //   suite: Nullable<string>
  //   zipcode: Nullable<string>
  //   geo: Nullable<{
  //     lat: Nullable<string>
  //     lng: Nullable<string>
  //   }>
  // }>
}

type UserMutationData<FieldName extends string> = {
  [K in FieldName]: Nullable<UserDirectoryRow>
}

export type GetUsersQueryData = {
  users: {
    meta: Nullable<{
      totalCount: number
    }>
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
  user: Nullable<UserDirectoryRow>
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
  // company?: UserCompanyInput
  // address?: UserAddressInput
}

export type CreateUserMutationData = UserMutationData<"createUser">

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

export type UpdateUserByIdMutationData = UserMutationData<"updateUser">

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
  deleteUser: Nullable<boolean>
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
