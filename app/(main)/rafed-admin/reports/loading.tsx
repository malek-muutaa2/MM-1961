import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SubmissionReportsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={crypto.randomUUID()}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="space-y-4">
        <div className="flex">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={crypto.randomUUID()} className="h-10 w-24 mx-1" />
            ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full mb-4" />
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={crypto.randomUUID()} className="h-12 w-full mb-2" />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
