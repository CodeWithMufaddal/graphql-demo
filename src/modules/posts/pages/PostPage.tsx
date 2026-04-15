import { useMemo, useState } from "react"
import { FileTextIcon, RefreshCwIcon, UserRoundIcon } from "lucide-react"

import { MetricCard } from "@/components/dashboard/metric-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePostsQuery } from "@/modules/posts/hooks"

function getBodyPreview(body: string, maxLength = 88) {
  if (body.length <= maxLength) {
    return body
  }

  return `${body.slice(0, maxLength).trimEnd()}...`
}

export function PostsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)

  const { data, loading, error, refetch } = usePostsQuery({ page, limit })

  const posts = data?.posts.data ?? []
  const totalCount = data?.posts.meta.totalCount ?? 0

  const uniqueAuthors = useMemo(
    () => new Set(posts.map((post) => post.user?.id).filter(Boolean)).size,
    [posts]
  )

  const pageCount = Math.max(1, Math.ceil(totalCount / limit))

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <MetricCard
          label="Total posts"
          value={totalCount}
          icon={<FileTextIcon className="text-muted-foreground" />}
        />
        <MetricCard
          label="Posts on this page"
          value={posts.length}
          icon={<Badge variant="outline">Page {page}</Badge>}
        />
        <MetricCard
          label="Unique authors (page)"
          value={uniqueAuthors}
          icon={<UserRoundIcon className="text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Posts Listing</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setPage(1)
                setLimit(Number(value))
              }}
            >
              <SelectTrigger className="w-[140px]" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 8, 10, 20].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
              <RefreshCwIcon data-icon="inline-start" className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? (
            <p className="text-sm text-destructive">
              {error.message || "Unable to load posts data."}
            </p>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Body Preview</TableHead>
                <TableHead className="w-52">Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No posts found.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium tabular-nums">{post.id}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate">{post.title}</p>
                    </TableCell>
                    <TableCell className="max-w-[420px] text-muted-foreground">
                      <p className="line-clamp-2">{getBodyPreview(post.body)}</p>
                    </TableCell>
                    <TableCell>
                      {post.user ? (
                        <div className="min-w-0">
                          <p className="truncate font-medium">{post.user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{post.user.username}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unknown author</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Page {page} of {pageCount} | Total {totalCount} posts
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page <= 1 || loading}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page <= 1 || loading}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((previous) => Math.min(pageCount, previous + 1))}
                disabled={page >= pageCount || loading}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pageCount)}
                disabled={page >= pageCount || loading}
              >
                Last
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
