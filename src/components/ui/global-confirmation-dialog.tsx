import { type ComponentProps, type MouseEvent, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type ShowDialogConfig = {
  title: string
  description: string
  confirmLabel?: string
  confirmingLabel?: string
  cancelLabel?: string
  confirmVariant?: ComponentProps<typeof Button>["variant"]
  size?: "default" | "sm"
  onConfirm?: () => Promise<boolean | void> | boolean | void
}

type DialogRequest = ShowDialogConfig & {
  resolve: (confirmed: boolean) => void
}

let showDialogHandler: ((config: ShowDialogConfig) => Promise<boolean>) | null = null

export function showDialog(config: ShowDialogConfig): Promise<boolean> {
  if (!showDialogHandler) {
    return Promise.resolve(false)
  }

  return showDialogHandler(config)
}

export function GlobalConfirmationDialogHost() {
  const queueRef = useRef<DialogRequest[]>([])
  const activeRef = useRef<DialogRequest | null>(null)
  const [activeRequest, setActiveRequest] = useState<DialogRequest | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    activeRef.current = activeRequest
  }, [activeRequest])

  useEffect(() => {
    showDialogHandler = (config) =>
      new Promise<boolean>((resolve) => {
        queueRef.current.push({
          ...config,
          resolve,
        })

        setActiveRequest((current) => {
          if (current) {
            return current
          }

          return queueRef.current.shift() ?? null
        })
      })

    return () => {
      const current = activeRef.current
      if (current) {
        current.resolve(false)
      }

      queueRef.current.forEach((request) => request.resolve(false))
      queueRef.current = []
      showDialogHandler = null
    }
  }, [])

  useEffect(() => {
    if (!activeRequest && queueRef.current.length > 0) {
      setActiveRequest(queueRef.current.shift() ?? null)
    }
  }, [activeRequest])

  function finalizeCurrentRequest(confirmed: boolean) {
    if (!activeRequest) {
      return
    }

    activeRequest.resolve(confirmed)
    setIsPending(false)
    setActiveRequest(null)
  }

  async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!activeRequest || isPending) {
      return
    }

    if (!activeRequest.onConfirm) {
      finalizeCurrentRequest(true)
      return
    }

    setIsPending(true)
    try {
      const shouldClose = await activeRequest.onConfirm()
      if (shouldClose !== false) {
        finalizeCurrentRequest(true)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog
      open={Boolean(activeRequest)}
      onOpenChange={(nextOpen) => {
        if (nextOpen || isPending) {
          return
        }

        finalizeCurrentRequest(false)
      }}
    >
      <AlertDialogContent size={activeRequest?.size ?? "sm"}>
        <AlertDialogHeader>
          <AlertDialogTitle>{activeRequest?.title}</AlertDialogTitle>
          <AlertDialogDescription>{activeRequest?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {activeRequest?.cancelLabel ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={activeRequest?.confirmVariant ?? "destructive"}
            disabled={isPending}
            onClick={(event) => {
              void handleConfirm(event)
            }}
          >
            {isPending
              ? activeRequest?.confirmingLabel ?? "Working..."
              : activeRequest?.confirmLabel ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
