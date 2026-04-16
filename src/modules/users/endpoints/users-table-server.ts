import type { DataTableQuery, DataTableResult } from "@/hooks/use-data-table"
import {
  buildFilterOptions,
  compareText,
  delay,
  resolveTableQuery,
  type FilterOptionsRequest,
  type FilterOptionsResponse,
} from "@/lib/data-table/local-table-workflow"
import { GET_USERS_QUERY, type UserDirectoryRow } from "@/modules/users/graphql"
import { apolloClient } from "@/lib/apollo/client"

export type {
  FilterOption,
  FilterOptionsRequest,
  FilterOptionsResponse,
} from "@/lib/data-table/local-table-workflow"

export type UserStatus = "Active" | "Invited" | "Suspended"
export type UserRole = "Admin" | "Manager" | "Analyst" | "Support"

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

export type UserMutationInput = {
  website?: string
  username: string
  phone?: string
  name: string
  email: string
  company?: UserCompanyInput
  address?: UserAddressInput
}

export type UsersTableRow = {
  id: string
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

type UserRecord = {
  id: string
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  company?: UserCompanyInput
  address?: UserAddressInput
  role: UserRole
  status: UserStatus
  createdAt: string
}

export type UsersServerFilters = {
  roles: string[]
  statuses: string[]
  companies: string[]
  createdFrom: string
  createdTo: string
}

export type UsersServerQuery = DataTableQuery<UsersServerFilters>

export type UsersServerResult = DataTableResult<UsersTableRow>

const roles: UserRole[] = ["Admin", "Manager", "Analyst", "Support"]
const statuses: UserStatus[] = ["Active", "Invited", "Suspended"]
const seedSuffixes = [
  "North",
  "East",
  "West",
  "South",
  "Core",
  "Growth",
  "Prime",
  "Labs",
  "Ops",
  "HQ",
]

let usersDatasetCache: UserRecord[] | null = null

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

function getCompanyName(record: UserRecord) {
  return record.company?.name ?? "N/A"
}

function toTableRow(record: UserRecord): UsersTableRow {
  return {
    id: record.id,
    name: record.name,
    username: record.username,
    email: record.email,
    phone: record.phone ?? "N/A",
    website: record.website ?? "N/A",
    company: getCompanyName(record),
    role: record.role,
    status: record.status,
    createdAt: record.createdAt,
  }
}

function parseNumber(value: string | null | undefined) {
  if (value === undefined || value === null || value === "") {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function expandSeedUsers(seedUsers: UserDirectoryRow[]) {
  const totalRows = Math.max(120, seedUsers.length * 12)
  const expanded: UserRecord[] = []

  for (let index = 0; index < totalRows; index += 1) {
    const seed = seedUsers[index % seedUsers.length]
    const suffix = seedSuffixes[index % seedSuffixes.length]
    const role = roles[index % roles.length]
    const status = statuses[index % statuses.length]
    const createdAt = new Date(Date.now() - index * 86_400_000 * 2)
      .toISOString()
      .slice(0, 10)

    expanded.push({
      id: `${seed.id}-${index + 1}`,
      name: `${seed.name} ${suffix}`,
      username: `${seed.username}_${suffix.toLowerCase()}`,
      email: seed.email.replace("@", `+${index + 1}@`),
      phone: seed.phone ?? undefined,
      website: seed.website ?? undefined,
      company: seed.company
        ? {
            name: seed.company.name ? `${seed.company.name} ${suffix}` : undefined,
            catchPhrase: seed.company.catchPhrase ?? undefined,
            bs: seed.company.bs ?? undefined,
          }
        : undefined,
      address: seed.address
        ? {
            city: seed.address.city ?? undefined,
            street: seed.address.street ?? undefined,
            suite: seed.address.suite ?? undefined,
            zipcode: seed.address.zipcode ?? undefined,
            geo: seed.address.geo
              ? {
                  lat: parseNumber(seed.address.geo.lat),
                  lng: parseNumber(seed.address.geo.lng),
                }
              : undefined,
          }
        : undefined,
      role,
      status,
      createdAt,
    })
  }

  return expanded
}

async function loadUsersDataset() {
  if (usersDatasetCache) {
    return usersDatasetCache
  }

  const result = await apolloClient.query({
    query: GET_USERS_QUERY,
    variables: {
      options: {
        paginate: {
          page: 1,
          limit: 50,
        },
      },
    },
  })

  const seedUsers = result.data?.users?.data ?? []
  if (seedUsers.length === 0) {
    throw new Error("No users returned by GraphQLZero.")
  }
  usersDatasetCache = expandSeedUsers(seedUsers)
  return usersDatasetCache
}

function findUserIndex(users: UserRecord[], id: string) {
  return users.findIndex((user) => user.id === id)
}

function generateUserId() {
  return `local-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

export async function fetchUsersTable(query: UsersServerQuery): Promise<UsersServerResult> {
  const source = await loadUsersDataset()
  await delay(280)

  const { rows, totalCount } = resolveTableQuery({
    rows: source,
    query,
    toSearchText: (row) => `${row.name} ${row.username} ${row.email} ${getCompanyName(row)}`,
    matchesFilters: (row, filters) => {
      if (filters.roles.length > 0 && !filters.roles.includes(row.role)) {
        return false
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) {
        return false
      }

      if (filters.companies.length > 0 && !filters.companies.includes(getCompanyName(row))) {
        return false
      }

      if (filters.createdFrom) {
        const from = new Date(filters.createdFrom).getTime()
        const rowDate = new Date(row.createdAt).getTime()
        if (rowDate < from) {
          return false
        }
      }

      if (filters.createdTo) {
        const to = new Date(filters.createdTo).getTime()
        const rowDate = new Date(row.createdAt).getTime()
        if (rowDate > to) {
          return false
        }
      }

      return true
    },
    sortComparators: {
      createdAt: (left, right, desc) => {
        const leftDate = new Date(left.createdAt).getTime()
        const rightDate = new Date(right.createdAt).getTime()

        if (leftDate === rightDate) {
          return 0
        }

        return desc ? rightDate - leftDate : leftDate - rightDate
      },
      company: (left, right, desc) =>
        compareText(getCompanyName(left), getCompanyName(right), desc),
    },
  })

  return {
    rows: rows.map(toTableRow),
    totalCount,
  }
}

export async function fetchUserById(id: string): Promise<UserMutationInput & { id: string }> {
  const source = await loadUsersDataset()
  await delay(180)

  const target = source.find((user) => user.id === id)
  if (!target) {
    throw new Error("User not found.")
  }

  return {
    id: target.id,
    name: target.name,
    username: target.username,
    email: target.email,
    phone: target.phone,
    website: target.website,
    company: target.company
      ? {
          name: target.company.name,
          catchPhrase: target.company.catchPhrase,
          bs: target.company.bs,
        }
      : undefined,
    address: target.address
      ? {
          zipcode: target.address.zipcode,
          suite: target.address.suite,
          street: target.address.street,
          city: target.address.city,
          geo: target.address.geo
            ? {
                lat: target.address.geo.lat,
                lng: target.address.geo.lng,
              }
            : undefined,
        }
      : undefined,
  }
}

export async function createUser(
  input: UserMutationInput
): Promise<UserMutationInput & { id: string }> {
  const source = await loadUsersDataset()
  await delay(220)

  const normalized = normalizeMutationInput(input)
  const nextUser: UserRecord = {
    id: generateUserId(),
    name: normalized.name,
    username: normalized.username,
    email: normalized.email,
    phone: normalized.phone,
    website: normalized.website,
    company: normalized.company,
    address: normalized.address,
    role: "Support",
    status: "Invited",
    createdAt: new Date().toISOString().slice(0, 10),
  }

  source.unshift(nextUser)
  return {
    id: nextUser.id,
    ...normalized,
  }
}

export async function updateUserById(
  id: string,
  input: UserMutationInput
): Promise<UserMutationInput & { id: string }> {
  const source = await loadUsersDataset()
  await delay(220)

  const index = findUserIndex(source, id)
  if (index < 0) {
    throw new Error("User not found.")
  }

  const normalized = normalizeMutationInput(input)
  const current = source[index]
  source[index] = {
    ...current,
    name: normalized.name,
    username: normalized.username,
    email: normalized.email,
    phone: normalized.phone,
    website: normalized.website,
    company: normalized.company,
    address: normalized.address,
  }

  return {
    id,
    ...normalized,
  }
}

export async function deleteUserById(id: string): Promise<void> {
  const source = await loadUsersDataset()
  await delay(220)

  const index = findUserIndex(source, id)
  if (index < 0) {
    throw new Error("User not found.")
  }

  source.splice(index, 1)
}

function getFilterPool(rows: UserRecord[], kind: "roles" | "statuses" | "companies") {
  if (kind === "roles") {
    return Array.from(new Set(rows.map((row) => row.role)))
  }
  if (kind === "statuses") {
    return Array.from(new Set(rows.map((row) => row.status)))
  }

  return Array.from(new Set(rows.map((row) => getCompanyName(row))))
}

export async function fetchFilterOptions(
  kind: "roles" | "statuses" | "companies",
  request: FilterOptionsRequest
): Promise<FilterOptionsResponse> {
  const source = await loadUsersDataset()
  await delay(220)

  const pool = getFilterPool(source, kind)
  return buildFilterOptions(pool, request)
}
