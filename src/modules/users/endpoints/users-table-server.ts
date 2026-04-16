import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import { apolloClient } from "@/lib/apollo/client"
import type { PageQueryOptionsInput } from "@/lib/graphql/types"
import {
  CREATE_USER_MUTATION,
  DELETE_USER_BY_ID_MUTATION,
  GET_USER_BY_ID_QUERY,
  GET_USERS_QUERY,
  UPDATE_USER_BY_ID_MUTATION,
  type UserDirectoryRow,
  type UserInput,
} from "@/modules/users/graphql"

export type UserMutationInput = UserInput

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

function normalizeOptionalString(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const next = value.trim()
  return next.length > 0 ? next : undefined
}

function normalizeMutationInput(input: UserMutationInput): UserMutationInput {
  const company = input.company
    ? {
        name: normalizeOptionalString(input.company.name),
        catchPhrase: normalizeOptionalString(input.company.catchPhrase),
        bs: normalizeOptionalString(input.company.bs),
      }
    : undefined
  const address = input.address
    ? {
        zipcode: normalizeOptionalString(input.address.zipcode),
        suite: normalizeOptionalString(input.address.suite),
        street: normalizeOptionalString(input.address.street),
        city: normalizeOptionalString(input.address.city),
        geo:
          input.address.geo?.lat !== undefined || input.address.geo?.lng !== undefined
            ? {
                lat: input.address.geo?.lat,
                lng: input.address.geo?.lng,
              }
            : undefined,
      }
    : undefined

  const hasCompanyValues = Boolean(company?.name || company?.catchPhrase || company?.bs)
  const hasAddressValues = Boolean(
    address?.zipcode ||
      address?.suite ||
      address?.street ||
      address?.city ||
      address?.geo?.lat !== undefined ||
      address?.geo?.lng !== undefined
  )

  return {
    name: input.name.trim(),
    username: input.username.trim(),
    email: input.email.trim(),
    website: normalizeOptionalString(input.website),
    phone: normalizeOptionalString(input.phone),
    company: hasCompanyValues ? company : undefined,
    address: hasAddressValues ? address : undefined,
  }
}

function parseOptionalFloat(value: string | null | undefined) {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function getCompanyName(row: Pick<UserDirectoryRow, "company">) {
  return row.company?.name?.trim() || "N/A"
}

function toTableRow(user: UserDirectoryRow): UsersTableRow {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone?.trim() || "N/A",
    website: user.website?.trim() || "N/A",
    company: getCompanyName(user),
  }
}

function toMutationResult(user: UserDirectoryRow): UserMutationInput & { id: string } {
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
                lat: parseOptionalFloat(user.address.geo.lat),
                lng: parseOptionalFloat(user.address.geo.lng),
              }
            : undefined,
        }
      : undefined,
  }
}

function toSortField(columnId: string) {
  switch (columnId) {
    case "company":
      return "company.name"
    case "name":
    case "username":
    case "email":
    case "phone":
    case "website":
    case "id":
      return columnId
    default:
      return undefined
  }
}

function buildUsersOptions(
  query: UsersServerQuery,
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

async function queryUsers(options: PageQueryOptionsInput) {
  const response = await apolloClient.query({
    query: GET_USERS_QUERY,
    variables: { options },
    fetchPolicy: "cache-first",
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  return response.data?.users
}

function invalidateUsersCache() {
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "users",
  })
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "user",
  })
  apolloClient.cache.gc()
}

export async function fetchUsersTable(query: UsersServerQuery): Promise<UsersServerResult> {
  const usersPage = await queryUsers(buildUsersOptions(query, query.pageSize))
  const users = usersPage?.data ?? []
  const rows = users.map(toTableRow)

  const totalCount =
    usersPage?.meta?.totalCount ??
    query.pageIndex * query.pageSize + rows.length + (rows.length === query.pageSize ? 1 : 0)

  return {
    rows,
    totalCount,
  }
}

export async function fetchUserById(id: string): Promise<UserMutationInput & { id: string }> {
  const response = await apolloClient.query({
    query: GET_USER_BY_ID_QUERY,
    variables: { id },
    fetchPolicy: "cache-first",
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  const user = response.data?.user
  if (!user) {
    throw new Error("User not found.")
  }

  return toMutationResult(user)
}

export async function createUser(
  input: UserMutationInput
): Promise<UserMutationInput & { id: string }> {
  const normalized = normalizeMutationInput(input)

  const response = await apolloClient.mutate({
    mutation: CREATE_USER_MUTATION,
    variables: {
      input: normalized,
    },
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  const createdUser = response.data?.createUser
  if (!createdUser) {
    throw new Error("Unable to create user.")
  }

  invalidateUsersCache()
  return toMutationResult(createdUser)
}

export async function updateUserById(
  id: string,
  input: UserMutationInput
): Promise<UserMutationInput & { id: string }> {
  const normalized = normalizeMutationInput(input)

  const response = await apolloClient.mutate({
    mutation: UPDATE_USER_BY_ID_MUTATION,
    variables: {
      id,
      input: normalized,
    },
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  const updatedUser = response.data?.updateUser
  if (!updatedUser) {
    throw new Error("Unable to update user.")
  }

  invalidateUsersCache()
  return toMutationResult(updatedUser)
}

export async function deleteUserById(id: string): Promise<void> {
  const response = await apolloClient.mutate({
    mutation: DELETE_USER_BY_ID_MUTATION,
    variables: { id },
  })

  if (response.error) {
    throw new Error(response.error.message)
  }

  if (response.data?.deleteUser === false) {
    throw new Error("Unable to delete user.")
  }

  invalidateUsersCache()
}
