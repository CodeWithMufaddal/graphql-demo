import { useCallback, useEffect, useMemo, useRef, useState, type UIEvent } from "react"
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type AsyncSelectOption = {
  label: string
  value: string
}

export type AsyncSelectRequest = {
  search: string
  page: number
  pageSize: number
}

export type AsyncSelectResponse = {
  options: AsyncSelectOption[]
  hasMore: boolean
}

type AsyncMultiSelectProps = {
  label: string
  placeholder?: string
  selected: string[]
  selectedLabelMap?: Record<string, string>
  pageSize?: number
  loadOptions: (request: AsyncSelectRequest) => Promise<AsyncSelectResponse>
  onChange: (nextSelected: string[]) => void
  className?: string
}

function summarizeSelection(
  label: string,
  selected: string[],
  selectedLabelMap: Record<string, string>
) {
  const selectedLabels = selected.map((value) => selectedLabelMap[value] ?? value)

  if (selected.length === 0) {
    return label
  }

  if (selected.length <= 2) {
    return `${label}: ${selectedLabels.join(", ")}`
  }

  return `${label}: ${selected.length} selected`
}

export function AsyncMultiSelect({
  label,
  placeholder = "Search options...",
  selected,
  selectedLabelMap,
  pageSize = 20,
  loadOptions,
  onChange,
  className,
}: AsyncMultiSelectProps) {
  const loadOptionsRef = useRef(loadOptions)
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [options, setOptions] = useState<AsyncSelectOption[]>([])
  const [knownOptionsMap, setKnownOptionsMap] = useState<Record<string, string>>({})
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadOptionsRef.current = loadOptions
  }, [loadOptions])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(0)
    }, 280)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const mergedLabelMap = useMemo(
    () => ({
      ...knownOptionsMap,
      ...selectedLabelMap,
    }),
    [knownOptionsMap, selectedLabelMap]
  )

  const fetchPage = useCallback(
    async (nextPage: number, append: boolean) => {
      setIsLoading(true)
      try {
        const response = await loadOptionsRef.current({
          search,
          page: nextPage,
          pageSize,
        })

        setKnownOptionsMap((previous) => {
          const next = { ...previous }
          for (const option of response.options) {
            next[option.value] = option.label
          }
          return next
        })
        setHasMore(response.hasMore)
        setPage(nextPage)
        setOptions((previous) => {
          const merged = append ? [...previous, ...response.options] : response.options
          const deduped = new Map(merged.map((item) => [item.value, item]))
          return Array.from(deduped.values())
        })
      } finally {
        setIsLoading(false)
      }
    },
    [pageSize, search]
  )

  useEffect(() => {
    if (!open) {
      return
    }

    fetchPage(0, false)
  }, [open, search, fetchPage])

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (!hasMore || isLoading) {
        return
      }

      const target = event.currentTarget
      const threshold = 48
      const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight

      if (distanceFromBottom < threshold) {
        fetchPage(page + 1, true)
      }
    },
    [fetchPage, hasMore, isLoading, page]
  )

  const toggleValue = useCallback(
    (value: string) => {
      if (selectedSet.has(value)) {
        onChange(selected.filter((item) => item !== value))
        return
      }

      onChange([...selected, value])
    },
    [onChange, selected, selectedSet]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-between", className)}>
          <span className="truncate">
            {summarizeSelection(label, selected, mergedLabelMap)}
          </span>
          <ChevronsUpDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(95vw,26rem)] p-3" align="start">
        <div className="flex flex-col gap-3">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={placeholder}
          />
          <div
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto rounded-md border bg-background"
          >
            <div className="flex flex-col p-1">
              {options.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    selectedSet.has(option.value)
                      ? "bg-primary/12 text-primary hover:bg-primary/18"
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleValue(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  <CheckIcon
                    className={cn(
                      "size-3.5 transition-opacity",
                      selectedSet.has(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              ))}
              {!isLoading && options.length === 0 ? (
                <p className="px-2 py-3 text-xs text-muted-foreground">No options found.</p>
              ) : null}
              {isLoading ? (
                <div className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
                  <LoaderCircleIcon className="size-3.5 animate-spin" />
                  Loading options...
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((item) => (
              <Badge key={item} variant="secondary" className="gap-1">
                {mergedLabelMap[item] ?? item}
                <button type="button" onClick={() => toggleValue(item)}>
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => onChange([])}>
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
