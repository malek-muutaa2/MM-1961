import type { Metadata } from "next"
import { ProviderDetails } from "@/components/rafed-admin/provider-details"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Provider Details | Rafed Admin",
  description: "View detailed information about a provider's forecast submissions",
}

export default function ProviderDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
    return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Provider Details</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
          <CardDescription>Detailed information about this provider and their forecast submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderDetails providerId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
