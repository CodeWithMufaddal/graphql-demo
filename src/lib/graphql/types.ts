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

export type PageLimitPair = {
  page: number
  limit: number
}

export type PaginationLinks = {
  first: PageLimitPair | null
  prev: PageLimitPair | null
  next: PageLimitPair | null
  last: PageLimitPair | null
}

export type PaginatedResponse<T> = {
  meta: PageMetadata
  links: PaginationLinks
  data: T[]
}
