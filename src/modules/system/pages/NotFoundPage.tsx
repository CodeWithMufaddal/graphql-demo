import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NotFoundPage() {
  return (
    <Card className="max-w-xl">
      <CardHeader className="border-b">
        <CardTitle>Page Not Found</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-4">
        <p className="text-sm text-muted-foreground">
          This route is not part of the admin navigation yet.
        </p>
        <div>
          <Button asChild>
            <Link to="/overview">Return to overview</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
