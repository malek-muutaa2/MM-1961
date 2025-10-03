import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Settings,
  Share2,
  Eye,
  FileBarChart,
  Hospital,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Shared KPIs | Provider Collaboration",
  description: "Share and monitor KPIs with connected hospitals",
}

export default function ProviderSharedKPIsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared KPIs</h1>
          <p className="text-muted-foreground">Share and monitor KPIs with your connected hospitals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Configure Sharing</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Share2 size={16} />
            <span>Share New KPI</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Shared KPIs</CardTitle>
            <CardDescription>Total KPIs shared with hospitals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Across 8 hospitals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Adoption Rate</CardTitle>
            <CardDescription>Hospitals using shared KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <ArrowUpRight size={16} />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Improvement Rate</CardTitle>
            <CardDescription>KPIs showing improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <ArrowUpRight size={16} />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All KPIs (12)</TabsTrigger>
            <TabsTrigger value="critical">Critical Attention (3)</TabsTrigger>
            <TabsTrigger value="improving">Improving (8)</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search KPIs..." className="w-full md:w-[250px] pl-8" />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* KPI Cards */}
          <KPICard
            name="Expiry-Related Write-Offs"
            category="Continuous Operations"
            sharedWith={8}
            status="critical"
            trend="decreasing"
            trendValue={0.5}
            currentValue={3.8}
            targetValue={2.0}
            unit="%"
          />

          <KPICard
            name="Inventory Accuracy"
            category="Continuous Operations"
            sharedWith={7}
            status="warning"
            trend="increasing"
            trendValue={1.2}
            currentValue={94.2}
            targetValue={98.0}
            unit="%"
          />

          <KPICard
            name="Stockout Rate"
            category="Continuous Operations"
            sharedWith={8}
            status="improving"
            trend="decreasing"
            trendValue={0.8}
            currentValue={4.5}
            targetValue={2.0}
            unit="%"
          />

          <KPICard
            name="Order Fill Rate"
            category="Continuous Operations"
            sharedWith={6}
            status="improving"
            trend="increasing"
            trendValue={1.5}
            currentValue={92.3}
            targetValue={98.0}
            unit="%"
          />

          <KPICard
            name="Inventory Turnover"
            category="Continuous Operations"
            sharedWith={5}
            status="improving"
            trend="increasing"
            trendValue={0.7}
            currentValue={8.2}
            targetValue={12.0}
            unit="turns"
          />
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <KPICard
            name="Expiry-Related Write-Offs"
            category="Continuous Operations"
            sharedWith={8}
            status="critical"
            trend="decreasing"
            trendValue={0.5}
            currentValue={3.8}
            targetValue={2.0}
            unit="%"
          />

          <KPICard
            name="Inventory Carrying Cost"
            category="Financial Optimization"
            sharedWith={7}
            status="critical"
            trend="decreasing"
            trendValue={0.3}
            currentValue={24.5}
            targetValue={18.0}
            unit="%"
          />

          <KPICard
            name="Cash-to-Cash Cycle Time"
            category="Financial Optimization"
            sharedWith={6}
            status="critical"
            trend="decreasing"
            trendValue={1.1}
            currentValue={62.3}
            targetValue={45.0}
            unit="days"
          />
        </TabsContent>

        <TabsContent value="improving" className="space-y-4">
          <KPICard
            name="Stockout Rate"
            category="Continuous Operations"
            sharedWith={8}
            status="improving"
            trend="decreasing"
            trendValue={0.8}
            currentValue={4.5}
            targetValue={2.0}
            unit="%"
          />

          <KPICard
            name="Order Fill Rate"
            category="Continuous Operations"
            sharedWith={6}
            status="improving"
            trend="increasing"
            trendValue={1.5}
            currentValue={92.3}
            targetValue={98.0}
            unit="%"
          />

          <KPICard
            name="Inventory Turnover"
            category="Continuous Operations"
            sharedWith={5}
            status="improving"
            trend="increasing"
            trendValue={0.7}
            currentValue={8.2}
            targetValue={12.0}
            unit="turns"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface KPICardProps {
  name: string
  category: string
  sharedWith: number
  status: "critical" | "warning" | "improving" | "on_target"
  trend: "increasing" | "decreasing" | "stable"
  trendValue: number
  currentValue: number
  targetValue: number
  unit: string
}

function KPICard({
  name,
  category,
  sharedWith,
  status,
  trend,
  trendValue,
  currentValue,
  targetValue,
  unit,
}: Readonly<KPICardProps>) {
  const getStatusBadge = () => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle size={12} /> Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-amber-500">
            <Clock size={12} /> Needs Attention
          </Badge>
        )
      case "improving":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-emerald-600 border-emerald-600">
            <ArrowUpRight size={12} /> Improving
          </Badge>
        )
      case "on_target":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-emerald-600 border-emerald-600">
            <CheckCircle2 size={12} /> On Target
          </Badge>
        )
      default:
        return null
    }
  }

  const getTrendIndicator = () => {
    if (trend === "increasing") {
      return (
        <div
          className={`flex items-center gap-1 text-sm ${
            name === "Stockout Rate" || name === "Inventory Carrying Cost" ? "text-destructive" : "text-emerald-600"
          }`}
        >
          <ArrowUpRight size={16} />
          <span>{trendValue}% from last month</span>
        </div>
      )
    } else if (trend === "decreasing") {
      return (
        <div
          className={`flex items-center gap-1 text-sm ${
            name === "Stockout Rate" || name === "Inventory Carrying Cost" ? "text-emerald-600" : "text-destructive"
          }`}
        >
          <ArrowDownRight size={16} />
          <span>{trendValue}% from last month</span>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{name}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{category}</Badge>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hospital size={14} />
              <span>Shared with {sharedWith} hospitals</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-2xl font-bold">
              {currentValue}
              {unit}{" "}
              <span className="text-sm text-muted-foreground">
                / {targetValue}
                {unit}
              </span>
            </div>
            {getTrendIndicator()}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye size={14} />
                <span>View Details</span>
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <Settings size={14} />
                <span>Manage Sharing</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
