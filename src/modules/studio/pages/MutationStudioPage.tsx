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
import { Textarea } from "@/components/ui/textarea"
import { graphqlZeroSystemFields, mutationFamilies } from "@/features/graphqlzero/schema-catalog"

type MutationMode = "create" | "update" | "delete"
type Resource = "User" | "Todo" | "Post" | "Photo" | "Comment" | "Album"

const resources: Resource[] = ["User", "Todo", "Post", "Photo", "Comment", "Album"]

function toMutationField(mode: MutationMode, resource: Resource) {
  return `${mode}${resource}`
}

export function MutationStudioPage() {
  const [mode, setMode] = useState<MutationMode>("create")
  const [resource, setResource] = useState<Resource>("Post")
  const [resourceId, setResourceId] = useState("1")
  const [payload, setPayload] = useState('{\n  "title": "New Title"\n}')

  const mutationField = toMutationField(mode, resource)

  const mutationTemplate = useMemo(() => {
    if (mode === "delete") {
      return `mutation Delete${resource}($id: ID!) {\n  ${mutationField}(id: $id)\n}`
    }

    const mutationName = mode === "create" ? `Create${resource}` : `Update${resource}`
    const variableShape =
      mode === "update" ? `$id: ID!, $input: ${resource}Input!` : `$input: ${resource}Input!`
    const argumentShape =
      mode === "update" ? `id: $id, input: $input` : `input: $input`

    return `mutation ${mutationName}(${variableShape}) {\n  ${mutationField}(${argumentShape}) {\n    id\n  }\n}`
  }, [mode, mutationField, resource])

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Mutation Studio</CardTitle>
          <CardDescription>
            Prototype mutation payloads and operation names before wiring Apollo mutations.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">Create / Update / Delete</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Mutation type</label>
              <Select value={mode} onValueChange={(value) => setMode(value as MutationMode)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="create">create</SelectItem>
                    <SelectItem value="update">update</SelectItem>
                    <SelectItem value="delete">delete</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Resource</label>
              <Select value={resource} onValueChange={(value) => setResource(value as Resource)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {resources.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">ID (when needed)</label>
              <Input value={resourceId} onChange={(event) => setResourceId(event.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Input payload draft</label>
            <Textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
          </div>

          <div className="rounded-lg border bg-card/70 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Generated mutation</p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
{mutationTemplate}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button>{mode === "delete" ? "Delete" : mode === "create" ? "Create" : "Update"}</Button>
            <Button variant="outline">Copy Template</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Available Mutations</CardTitle>
          <CardDescription>Directly mapped to GraphQLZero mutation root</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family</TableHead>
                <TableHead>Fields</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mutationFamilies.map((family) => (
                <TableRow key={family.name}>
                  <TableCell className="font-medium capitalize">{family.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {family.fields.join(", ")}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">system</TableCell>
                <TableCell className="text-muted-foreground">{graphqlZeroSystemFields.mutation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
