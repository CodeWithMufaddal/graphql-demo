export type PaginationInput = {
  page?: number
  limit?: number
}

export type PageQueryOptionsInput = {
  paginate?: PaginationInput
}

export type PageMetadata = {
  totalCount: number
}

export type PaginationLinks = {
  first: string | null
  prev: string | null
  next: string | null
  last: string | null
}

export type PaginatedResponse<T> = {
  meta: PageMetadata
  links: PaginationLinks
  data: T[]
}
