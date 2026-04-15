import { Suspense, lazy, type ComponentType } from "react"

const LazyToaster = lazy(
  () =>
    new Promise<{ default: ComponentType }>((resolve) => {
      if (typeof window === "undefined") {
        import("@/components/ui/sonner").then((module) =>
          resolve({ default: module.Toaster as ComponentType })
        )
        return
      }

      requestAnimationFrame(() => {
        import("@/components/ui/sonner").then((module) =>
          resolve({ default: module.Toaster as ComponentType })
        )
      })
    })
)

export function DeferredToaster() {
  return (
    <Suspense fallback={null}>
      <LazyToaster />
    </Suspense>
  )
}
