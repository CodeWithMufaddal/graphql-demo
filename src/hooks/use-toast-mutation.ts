import { useCallback, useState } from "react"
import { toast } from "sonner"

type MaybePromise<T> = T | Promise<T>

type MutationToastMessages<TVariables, TResult> = {
  loading?: string | ((variables: TVariables) => string)
  success?: string | ((result: TResult, variables: TVariables) => string)
  error?: string | ((error: unknown, variables: TVariables) => string)
}

type UseToastMutationOptions<TVariables, TResult> = {
  mutationFn: (variables: TVariables) => Promise<TResult>
  toastMessages?: MutationToastMessages<TVariables, TResult>
  useToast?: boolean
  onSuccess?: (result: TResult, variables: TVariables) => MaybePromise<void>
  onError?: (error: unknown, variables: TVariables) => MaybePromise<void>
}

type UseToastMutationResult<TVariables, TResult> = {
  mutateAsync: (variables: TVariables) => Promise<TResult>
  isPending: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operation failed."
}

export function useToastMutation<TVariables, TResult>({
  mutationFn,
  toastMessages,
  useToast = true,
  onSuccess,
  onError,
}: UseToastMutationOptions<TVariables, TResult>): UseToastMutationResult<TVariables, TResult> {
  const [isPending, setIsPending] = useState(false)

  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      setIsPending(true)
      const mutationPromise = mutationFn(variables)

      if (useToast) {
        const loadingMessage =
          typeof toastMessages?.loading === "function"
            ? toastMessages.loading(variables)
            : toastMessages?.loading ?? "Processing..."

        toast.promise(mutationPromise, {
          loading: loadingMessage,
          success: (result) =>
            typeof toastMessages?.success === "function"
              ? toastMessages.success(result, variables)
              : toastMessages?.success ?? "Done.",
          error: (error) =>
            typeof toastMessages?.error === "function"
              ? toastMessages.error(error, variables)
              : toastMessages?.error ?? getErrorMessage(error),
        })
      }

      try {
        const result = await mutationPromise
        await onSuccess?.(result, variables)
        return result
      } catch (error) {
        await onError?.(error, variables)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [mutationFn, onError, onSuccess, toastMessages, useToast]
  )

  return { mutateAsync, isPending }
}
