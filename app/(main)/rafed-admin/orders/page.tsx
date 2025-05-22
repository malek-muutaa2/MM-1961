import type { Metadata } from "next"
import { OrderManagement } from "@/components/rafed-admin/order-management"

export const metadata: Metadata = {
  title: "Order Management | Rafed Admin",
  description: "Manage and confirm orders based on provider forecasts",
}

export default function OrderManagementPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
      </div>

      <OrderManagement />
    </div>
  )
}
