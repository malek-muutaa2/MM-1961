import type { Metadata } from "next"
import { KPIDependencySimulator } from "@/components/kpis/kpi-dependency-simulator"

export const metadata: Metadata = {
  title: "KPI Dependencies | MUUTAA.ML",
  description: "Visualize and analyze relationships between KPIs",
}

export default function KPIDependenciesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">KPI Dependencies</h2>
      </div>

      <KPIDependencySimulator />
    </div>
  )
}
