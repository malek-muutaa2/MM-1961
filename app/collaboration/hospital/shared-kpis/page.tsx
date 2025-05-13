import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Settings,
  FileBarChart,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Shared KPIs | Hospital Collaboration",
  description: "View and manage KPIs shared by providers",
}

export default function HospitalSharedKPIsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared KPIs</h1>
          <p className="text-muted-foreground">View and manage KPIs shared by your providers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Privacy Settings</span>
          </Button>
          <Button className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>Manage Access</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Received KPIs</CardTitle>
            <CardDescription>Total KPIs shared with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-sm text-muted-foreground">From 5 providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Performance</CardTitle>
            <CardDescription>KPIs meeting targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">64%</div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <ArrowUpRight size={16} />
              <span>9% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Critical KPIs</CardTitle>
            <CardDescription>KPIs needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <div className="flex items-center gap-1 text-sm text-destructive">
              <ArrowUpRight size={16} />
              <span>1 more than last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All KPIs (14)</TabsTrigger>
            <TabsTrigger value="critical">Critical Attention (4)</TabsTrigger>
            <TabsTrigger value="by-provider">By Provider</TabsTrigger>
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
            provider="MedSupply Inc."
            status="critical"
            trend="increasing"
            trendValue={0.8}
            currentValue={4.2}
            targetValue={2.0}
            unit="%"
            accessLevel="full"
          />

          <KPICard
            name="Inventory Accuracy"
            category="Continuous Operations"
            provider="MedSupply Inc."
            status="warning"
            trend="increasing"
            trendValue={0.5}
            currentValue={93.8}
            targetValue={98.0}
            unit="%"
            accessLevel="full"
          />

          <KPICard
            name="Stockout Rate"
            category="Continuous Operations"
            provider="PharmaDirect"
            status="improving"
            trend="decreasing"
            trendValue={1.2}
            currentValue={3.8}
            targetValue={2.0}
            unit="%"
            accessLevel="limited"
          />

          <KPICard
            name="Order Fill Rate"
            category="Continuous Operations"
            provider="MedSupply Inc."
            status="improving"
            trend="increasing"
            trendValue={2.1}
            currentValue={94.5}
            targetValue={98.0}
            unit="%"
            accessLevel="full"
          />

          <KPICard
            name="Inventory Turnover"
            category="Continuous Operations"
            provider="HealthEquip Co."
            status="on_target"
            trend="increasing"
            trendValue={0.9}
            currentValue={11.8}
            targetValue={12.0}
            unit="turns"
            accessLevel="limited"
          />
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <KPICard
            name="Expiry-Related Write-Offs"
            category="Continuous Operations"
            provider="MedSupply Inc."
            status="critical"
            trend="increasing"
            trendValue={0.8}
            currentValue={4.2}
            targetValue={2.0}
            unit="%"
            accessLevel="full"
          />

          <KPICard
            name="Inventory Carrying Cost"
            category="Financial Optimization"
            provider="PharmaDirect"
            status="critical"
            trend="increasing"
            trendValue={1.1}
            currentValue={25.8}
            targetValue={18.0}
            unit="%"
            accessLevel="full"
          />

          <KPICard
            name="Cash-to-Cash Cycle Time"
            category="Financial Optimization"
            provider="MedSupply Inc."
            status="critical"
            trend="increasing"
            trendValue={2.3}
            currentValue={64.5}
            targetValue={45.0}
            unit="days"
            accessLevel="limited"
          />

          <KPICard
            name="Total Supply Chain Cost"
            category="Financial Optimization"
            provider="HealthEquip Co."
            status="critical"
            trend="increasing"
            trendValue={0.7}
            currentValue={10.2}
            targetValue={7.5}
            unit="%"
            accessLevel="full"
          />
        </TabsContent>

        <TabsContent value="by-provider" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building size={18} />
              MedSupply Inc. (6 KPIs)
            </h3>

            <KPICard
              name="Expiry-Related Write-Offs"
              category="Continuous Operations"
              provider="MedSupply Inc."
              status="critical"
              trend="increasing"
              trendValue={0.8}
              currentValue={4.2}
              targetValue={2.0}
              unit="%"
              accessLevel="full"
            />

            <KPICard
              name="Inventory Accuracy"
              category="Continuous Operations"
              provider="MedSupply Inc."
              status="warning"
              trend="increasing"
              trendValue={0.5}
              currentValue={93.8}
              targetValue={98.0}
              unit="%"
              accessLevel="full"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building size={18} />
              PharmaDirect (4 KPIs)
            </h3>

            <KPICard
              name="Stockout Rate"
              category="Continuous Operations"
              provider="PharmaDirect"
              status="improving"
              trend="decreasing"
              trendValue={1.2}
              currentValue={3.8}
              targetValue={2.0}
              unit="%"
              accessLevel="limited"
            />

            <KPICard
              name="Inventory Carrying Cost"
              category="Financial Optimization"
              provider="PharmaDirect"
              status="critical"
              trend="increasing"
              trendValue={1.1}
              currentValue={25.8}
              targetValue={18.0}
              unit="%"
              accessLevel="full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface KPICardProps {
  name: string
  category: string
  provider: string
  status: "critical" | "warning" | "improving" | "on_target"
  trend: "increasing" | "decreasing" | "stable"
  trendValue: number
  currentValue: number
  targetValue: number
  unit: string
  accessLevel: "full" | "limited" | "none"
}

function KPICard({
  name,
  category,
  provider,
  status,
  trend,
  trendValue,
  currentValue,
  targetValue,
  unit,
  accessLevel,
}: KPICardProps) {
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
          <Badge variant="warning" className="flex items-center gap-1 bg-amber-500">
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

  const getAccessBadge = () => {
    switch (accessLevel) {
      case "full":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-600">
            <Eye size={12} /> Full Access
          </Badge>
        )
      case "limited":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-600">
            <EyeOff size={12} /> Limited Access
          </Badge>
        )
      case "none":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-gray-600 border-gray-600">
            <Lock size={12} /> No Access
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
            name === "Stockout Rate" ||
            name === "Inventory Carrying Cost" ||
            name === "Cash-to-Cash Cycle Time" ||
            name === "Total Supply Chain Cost" ||
            name === "Expiry-Related Write-Offs"
              ? "text-destructive"
              : "text-emerald-600"
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
            name === "Stockout Rate" ||
            name === "Inventory Carrying Cost" ||
            name === "Cash-to-Cash Cycle Time" ||
            name === "Total Supply Chain Cost" ||
            name === "Expiry-Related Write-Offs"
              ? "text-emerald-600"
              : "text-destructive"
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
              {getAccessBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building size={14} />
              <span>Shared by {provider}</span>
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
                <span>Access Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
