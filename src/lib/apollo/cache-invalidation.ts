import { apolloClient } from "./client"

export const apolloCacheKeys = {
  users: "users",
  posts: "posts",
} as const

export type ApolloCacheKey = (typeof apolloCacheKeys)[keyof typeof apolloCacheKeys]

type EvictionTarget = {
  id: string
  fieldName: string
}

const evictionTargetsByKey: Record<ApolloCacheKey, EvictionTarget[]> = {
  [apolloCacheKeys.users]: [
    { id: "ROOT_QUERY", fieldName: "users" },
    { id: "ROOT_QUERY", fieldName: "user" },
  ],
  [apolloCacheKeys.posts]: [{ id: "ROOT_QUERY", fieldName: "posts" }],
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function invalidateApolloCache(keys: ApolloCacheKey | ApolloCacheKey[]) {
  const keyList = toArray(keys)
  const uniqueTargets = new Map<string, EvictionTarget>()

  keyList.forEach((key) => {
    const targets = evictionTargetsByKey[key] ?? []
    targets.forEach((target) => {
      uniqueTargets.set(`${target.id}:${target.fieldName}`, target)
    })
  })

  uniqueTargets.forEach((target) => {
    apolloClient.cache.evict({
      id: target.id,
      fieldName: target.fieldName,
    })
  })

  apolloClient.cache.gc()
}
