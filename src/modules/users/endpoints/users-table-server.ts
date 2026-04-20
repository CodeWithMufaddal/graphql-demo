import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import { apolloClient } from "@/lib/apollo/client"
import { apolloCacheKeys } from "@/lib/apollo/cache-invalidation"
import { createApolloTableFetcher } from "@/lib/apollo/table-query"
import {
  CREATE_USER_MUTATION,
  DELETE_USER_BY_ID_MUTATION,
  GET_USER_BY_ID_QUERY,
  GET_USERS_QUERY,
  UPDATE_USER_BY_ID_MUTATION,
  type GetUsersQueryData,
  type GetUsersQueryVariables,
  type UserDirectoryRow,
  type UserInput,
} from "@/modules/users/graphql"

export type UserMutationInput = UserInput
export type UserRecord = UserMutationInput & { id: string }

export type UsersTableRow = {
  id: string
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: string
}

export type UsersServerFilters = Record<string, never>
export type UsersServerQuery = DataTableQuery<UsersServerFilters>
export type UsersServerResult = DataTableResult<UsersTableRow>
export const usersCacheKey = apolloCacheKeys.users

const EMPTY_VALUE_LABEL = "N/A"

const SORT_FIELD_BY_COLUMN = {
  company: "company.name",
  name: "name",
  username: "username",
  email: "email",
  phone: "phone",
  website: "website",
  id: "id",
} as const

function displayString(value: string | null | undefined) {
  return value?.trim() || EMPTY_VALUE_LABEL
}

function toTableRow(user: UserDirectoryRow): UsersTableRow {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: displayString(user.phone),
    website: displayString(user.website),
    company: displayString(user.company?.name),
  }
}

function toUserRecord(user: UserDirectoryRow): UserRecord {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone ?? undefined,
    website: user.website ?? undefined,
    company: user.company
      ? {
          name: user.company.name ?? undefined,
          catchPhrase: user.company.catchPhrase ?? undefined,
          bs: user.company.bs ?? undefined,
        }
      : undefined,
    address: user.address
      ? {
          zipcode: user.address.zipcode ?? undefined,
          suite: user.address.suite ?? undefined,
          street: user.address.street ?? undefined,
          city: user.address.city ?? undefined,
          geo: user.address.geo
            ? {
                lat: user.address.geo.lat == null ? undefined : Number(user.address.geo.lat),
                lng: user.address.geo.lng == null ? undefined : Number(user.address.geo.lng),
              }
            : undefined,
        }
      : undefined,
  }
}

export const fetchUsersTable = createApolloTableFetcher<
  GetUsersQueryData,
  GetUsersQueryVariables,
  UserDirectoryRow,
  UsersTableRow,
  UsersServerFilters
>({
  query: GET_USERS_QUERY,
  selectPage: (data) => data?.users,
  mapRow: toTableRow,
  sortFieldByColumn: SORT_FIELD_BY_COLUMN,
})

export async function fetchUserById(id: string): Promise<UserRecord> {
  const response = await apolloClient.query({
    query: GET_USER_BY_ID_QUERY,
    variables: { id },
    fetchPolicy: "cache-first",
  })

  return toUserRecord(response.data?.user as UserDirectoryRow)
}

export async function createUser(input: UserMutationInput): Promise<UserRecord> {
  const response = await apolloClient.mutate({
    mutation: CREATE_USER_MUTATION,
    variables: { input },
  })

  return toUserRecord(response.data?.createUser as UserDirectoryRow)
}

export async function updateUserById(id: string, input: UserMutationInput): Promise<UserRecord> {
  const response = await apolloClient.mutate({
    mutation: UPDATE_USER_BY_ID_MUTATION,
    variables: { id, input },
  })

  return toUserRecord(response.data?.updateUser as UserDirectoryRow)
}

export async function deleteUserById(id: string): Promise<void> {
  await apolloClient.mutate({
    mutation: DELETE_USER_BY_ID_MUTATION,
    variables: { id },
  })
}
