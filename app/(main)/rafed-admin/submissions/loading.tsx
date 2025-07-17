"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map(() => {
            const uniqueKey = crypto.randomUUID();
            return <Skeleton key={uniqueKey} className="h-20 w-full" />;
          })}
        </div>
      </div>
    </div>
  )
}
