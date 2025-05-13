import type { Metadata } from "next"
import KPISelectionClientPage from "./KPISelectionClientPage"

export const metadata: Metadata = {
  title: "KPI Selection | MUUTAA.ML",
  description: "Define Business Objectives & KPI Selection",
}

export default function KPISelectionPage() {
  return <KPISelectionClientPage />
}
