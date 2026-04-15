import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
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
import {
  graphqlZeroEntities,
  graphqlZeroQueryMap,
  graphqlZeroSystemFields,
} from "@/features/graphqlzero/schema-catalog"

const listEntities = ["users", "todos", "posts", "photos", "comments", "albums"] as const

export function QueryStudioPage() {
  const [entity, setEntity] = useState<(typeof graphqlZeroEntities)[number]>("posts")
  const [page, setPage] = useState("1")
  const [limit, setLimit] = useState("10")
  const [resourceId, setResourceId] = useState("1")

  const isListQuery = listEntities.includes(entity as (typeof listEntities)[number])

  const queryTemplate = useMemo(() => {
    if (isListQuery) {
      return `query ${entity}Page($page: Int!, $limit: Int!) {\n  ${entity}(options: { paginate: { page: $page, limit: $limit } }) {\n    data {\n      id\n    }\n    meta {\n      totalCount\n    }\n  }\n}`
    }

    return `query ${entity}ById($id: ID!) {\n  ${entity}(id: $id) {\n    id\n  }\n}`
  }, [entity, isListQuery])

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Query Studio</CardTitle>
          <CardDescription>
            Build query shape first, then swap this with your Apollo query documents.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">GraphQLZero</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Entity query</label>
              <Select value={entity} onValueChange={(value) => setEntity(value as typeof entity)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {graphqlZeroEntities.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {isListQuery ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Page</label>
                  <Input value={page} onChange={(event) => setPage(event.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Limit</label>
                  <Input value={limit} onChange={(event) => setLimit(event.target.value)} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Resource ID</label>
                <Input value={resourceId} onChange={(event) => setResourceId(event.target.value)} />
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card/70 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Generated operation</p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
{queryTemplate}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button>Run Query</Button>
            <Button variant="outline">Copy Template</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Available Fetch Queries</CardTitle>
          <CardDescription>Mapped from GraphQLZero query root</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Signature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {graphqlZeroEntities.map((item) => (
                <TableRow key={item}>
                  <TableCell className="font-medium">{item}</TableCell>
                  <TableCell className="text-muted-foreground">{graphqlZeroQueryMap[item]}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">_</TableCell>
                <TableCell className="text-muted-foreground">{graphqlZeroSystemFields.query}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
