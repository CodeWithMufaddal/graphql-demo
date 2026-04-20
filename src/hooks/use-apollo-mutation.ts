import type { ApolloCacheKey } from "@/lib/apollo/cache-invalidation"
import { invalidateApolloCache } from "@/lib/apollo/cache-invalidation"

import { useToastMutation } from "./use-toast-mutation"

type MaybePromise<T> = T | Promise<T>

type MutationToastMessages<TVariables, TResult> = {
  loading?: string | ((variables: TVariables) => string)
  success?: string | ((result: TResult, variables: TVariables) => string)
  error?: string | ((error: unknown, variables: TVariables) => string)
}

type InvalidateKeysResolver<TVariables, TResult> =
  | ApolloCacheKey
  | ApolloCacheKey[]
  | ((result: TResult, variables: TVariables) => ApolloCacheKey | ApolloCacheKey[] | undefined)

type UseApolloMutationOptions<TVariables, TResult> = {
  mutationFn: (variables: TVariables) => Promise<TResult>
  invalidateKeys?: InvalidateKeysResolver<TVariables, TResult>
  toastMessages?: MutationToastMessages<TVariables, TResult>
  useToast?: boolean
  onSuccess?: (result: TResult, variables: TVariables) => MaybePromise<void>
  onError?: (error: unknown, variables: TVariables) => MaybePromise<void>
}

function normalizeKeys(keys: ApolloCacheKey | ApolloCacheKey[]) {
  return Array.isArray(keys) ? keys : [keys]
}

function resolveInvalidateKeys<TVariables, TResult>(
  invalidateKeys: InvalidateKeysResolver<TVariables, TResult> | undefined,
  result: TResult,
  variables: TVariables
) {
  if (!invalidateKeys) {
    return undefined
  }

  const keys =
    typeof invalidateKeys === "function"
      ? invalidateKeys(result, variables)
      : invalidateKeys

  if (!keys) {
    return undefined
  }

  return normalizeKeys(keys)
}

export function useApolloMutation<TVariables, TResult>({
  mutationFn,
  invalidateKeys,
  toastMessages,
  useToast = true,
  onSuccess,
  onError,
}: UseApolloMutationOptions<TVariables, TResult>) {
  return useToastMutation({
    mutationFn,
    toastMessages,
    useToast,
    onSuccess: async (result, variables) => {
      const keys = resolveInvalidateKeys(invalidateKeys, result, variables)
      if (keys && keys.length > 0) {
        invalidateApolloCache(keys)
      }

      await onSuccess?.(result, variables)
    },
    onError,
  })
}
