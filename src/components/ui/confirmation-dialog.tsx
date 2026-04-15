import { type ComponentProps, type MouseEvent, useState } from "react"

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

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => Promise<boolean | void> | boolean | void
  confirmLabel?: string
  confirmingLabel?: string
  cancelLabel?: string
  confirmVariant?: ComponentProps<typeof Button>["variant"]
  size?: "default" | "sm"
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  confirmingLabel = "Working...",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  size = "sm",
}: ConfirmationDialogProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (isPending) {
      return
    }

    setIsPending(true)
    try {
      const shouldClose = await onConfirm()
      if (shouldClose !== false) {
        onOpenChange(false)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isPending) {
          return
        }
        onOpenChange(nextOpen)
      }}
    >
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            disabled={isPending}
            onClick={(event) => {
              void handleConfirm(event)
            }}
          >
            {isPending ? confirmingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
