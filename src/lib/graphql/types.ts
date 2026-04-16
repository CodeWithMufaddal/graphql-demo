export type PaginationInput = {
  page?: number
  limit?: number
}

export type SortOrder = "ASC" | "DESC"

export type SortInput = {
  order: SortOrder
  field: string
}

export type SliceInput = {
  start?: number
  limit?: number
  end?: number
}

export type SearchInput = {
  q: string
}

export type OperatorKind = "GTE" | "LTE" | "NE" | "LIKE"

export type OperatorInput = {
  value: string
  kind: OperatorKind
  field: string
}

export type PageQueryOptionsInput = {
  paginate?: PaginationInput
  sort?: SortInput
  slice?: SliceInput
  search?: SearchInput
  operators?: OperatorInput[]
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
