import type { SortingState } from "@tanstack/react-table"

import { GET_USERS_QUERY, type UserDirectoryRow } from "@/features/users/graphql/queries"
import { apolloClient } from "@/lib/apollo/client"

export type UserStatus = "Active" | "Invited" | "Suspended"
export type UserRole = "Admin" | "Manager" | "Analyst" | "Support"

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

export type UsersServerFilters = {
  roles: string[]
  statuses: string[]
  companies: string[]
  createdFrom: string
  createdTo: string
}

export type UsersServerQuery = {
  pageIndex: number
  pageSize: number
  sorting: SortingState
  globalSearch: string
  filters: UsersServerFilters
}

export type UsersServerResult = {
  rows: UsersTableRow[]
  totalCount: number
}

export type FilterOption = {
  label: string
  value: string
}

export type FilterOptionsRequest = {
  search: string
  page: number
  pageSize: number
}

export type FilterOptionsResponse = {
  options: FilterOption[]
  hasMore: boolean
}

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

let usersDatasetCache: UsersTableRow[] | null = null

function compareValues(a: string, b: string, desc: boolean) {
  const left = a.toLowerCase()
  const right = b.toLowerCase()

  if (left === right) return 0
  const result = left > right ? 1 : -1
  return desc ? -result : result
}

function applySorting(rows: UsersTableRow[], sorting: SortingState) {
  if (sorting.length === 0) {
    return rows
  }

  const sorted = [...rows]
  sorted.sort((left, right) => {
    for (const sort of sorting) {
      const { id, desc } = sort

      if (id === "createdAt") {
        const leftDate = new Date(left.createdAt).getTime()
        const rightDate = new Date(right.createdAt).getTime()

        if (leftDate !== rightDate) {
          return desc ? rightDate - leftDate : leftDate - rightDate
        }
        continue
      }

      const leftValue = String(left[id as keyof UsersTableRow] ?? "")
      const rightValue = String(right[id as keyof UsersTableRow] ?? "")
      const comparison = compareValues(leftValue, rightValue, desc)

      if (comparison !== 0) {
        return comparison
      }
    }

    return 0
  })

  return sorted
}

function applySearch(rows: UsersTableRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return rows
  }

  return rows.filter((row) => {
    const haystack = `${row.name} ${row.username} ${row.email} ${row.company}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

function applyFilters(rows: UsersTableRow[], filters: UsersServerFilters) {
  return rows.filter((row) => {
    if (filters.roles.length > 0 && !filters.roles.includes(row.role)) {
      return false
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) {
      return false
    }

    if (filters.companies.length > 0 && !filters.companies.includes(row.company)) {
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
  })
}

function paginateRows(rows: UsersTableRow[], pageIndex: number, pageSize: number) {
  const start = pageIndex * pageSize
  return rows.slice(start, start + pageSize)
}

function expandSeedUsers(seedUsers: UserDirectoryRow[]) {
  const totalRows = Math.max(120, seedUsers.length * 12)
  const expanded: UsersTableRow[] = []

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
      phone: seed.phone ?? "N/A",
      website: seed.website ?? "N/A",
      company: seed.company?.name ? `${seed.company.name} ${suffix}` : `Company ${suffix}`,
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

function simulateLatency(delay = 280) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export async function fetchUsersTable(query: UsersServerQuery): Promise<UsersServerResult> {
  const source = await loadUsersDataset()
  await simulateLatency()

  const searched = applySearch(source, query.globalSearch)
  const filtered = applyFilters(searched, query.filters)
  const sorted = applySorting(filtered, query.sorting)
  const rows = paginateRows(sorted, query.pageIndex, query.pageSize)

  return {
    rows,
    totalCount: filtered.length,
  }
}

function getFilterPool(rows: UsersTableRow[], kind: "roles" | "statuses" | "companies") {
  if (kind === "roles") {
    return Array.from(new Set(rows.map((row) => row.role)))
  }
  if (kind === "statuses") {
    return Array.from(new Set(rows.map((row) => row.status)))
  }
  return Array.from(new Set(rows.map((row) => row.company)))
}

export async function fetchFilterOptions(
  kind: "roles" | "statuses" | "companies",
  request: FilterOptionsRequest
): Promise<FilterOptionsResponse> {
  const source = await loadUsersDataset()
  await simulateLatency(220)

  const pool = getFilterPool(source, kind)
  const filtered = pool.filter((value) =>
    value.toLowerCase().includes(request.search.trim().toLowerCase())
  )
  const sorted = [...filtered].sort((a, b) => compareValues(a, b, false))

  const start = request.page * request.pageSize
  const page = sorted.slice(start, start + request.pageSize)

  return {
    options: page.map((value) => ({
      label: value,
      value,
    })),
    hasMore: start + request.pageSize < sorted.length,
  }
}
