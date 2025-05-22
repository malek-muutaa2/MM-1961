import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="mt-2 h-4 w-[450px]" />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}
