"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import {
  Database,
  Settings,
  Home,
  LineChart,
  AlertTriangle,
  CheckSquare,
  PieChart,
  Lightbulb,
  TrendingUp,
  BarChart,
  Hospital,
  ShieldCheck,
  Building,
  UserPlus,
  FileBarChart,
  Calendar,
  FileUp,
  History,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useRole } from "@/contexts/role-context"
import {getCurrentUser} from "@/lib/getCurrentUser";
import {UserType} from "@/lib/db/schema";

export function  AppSidebar({userinfo}: UserType) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const { role } = useRole()
  if(!userinfo) {
    return null
  }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          {isCollapsed ? (
            <div className="h-8 w-8 overflow-hidden">
              <Image
                src="/images/muutaa-logo.png"
                alt="MUUTAA Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-8">
              <Image
                src="/images/muutaa-logo.png"
                alt="MUUTAA Logo"
                width={120}
                height={32}
                unoptimized
                className="object-contain"
              />
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard - Show for all roles */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* KPI Management - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>KPI Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Continuous Operations">
                    <Link href="/kpis/continuous-operations">
                      <LineChart />
                      <span>Continuous Operations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Financial Optimization">
                    <Link href="/kpis/financial-optimization">
                      <PieChart />
                      <span>Financial Optimization</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="KPI Dependencies">
                    <Link href="/kpis/dependencies">
                      <Database />
                      <span>KPI Dependencies</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Insights & Actions - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Insights & Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Alerts">
                    <Link href="/alerts">
                      <AlertTriangle />
                      <span>Alerts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Action Plans">
                    <Link href="/actions">
                      <CheckSquare />
                      <span>Action Plans</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="AI Insights">
                    <Link href="/insights">
                      <Lightbulb />
                      <span>AI Insights</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Event Manager">
                    <Link href="/events">
                      <Calendar />
                      <span>Event Manager</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Demand Sensing - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Demand Sensing</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Product Demand">
                    <Link href="/demand/products">
                      <BarChart />
                      <span>Product Demand</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Forecasting">
                    <Link href="/demand/forecasting">
                      <TrendingUp />
                      <span>Forecasting</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Provider Collaboration Module - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Provider Collaboration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Hospital Network">
                    <Link href="/collaboration/provider/network">
                      <Hospital />
                      <span>Hospital Network</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Invite Hospitals">
                    <Link href="/collaboration/provider/invite">
                      <UserPlus />
                      <span>Invite Hospitals</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Shared KPIs">
                    <Link href="/collaboration/provider/shared-kpis">
                      <FileBarChart />
                      <span>Shared KPIs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Hospital Collaboration Module - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Hospital Collaboration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Provider Connections">
                    <Link href="/collaboration/hospital/connections">
                      <Building />
                      <span>Provider Connections</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Data Sharing Settings">
                    <Link href="/collaboration/hospital/data-sharing">
                      <ShieldCheck />
                      <span>Data Sharing Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Shared KPIs">
                    <Link href="/collaboration/hospital/shared-kpis">
                      <FileBarChart />
                      <span>Shared KPIs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Rafed Provider Module - Show for Rafed Provider only */}
        {(role === "rafed-provider" || role === "obtivian") && (
          <SidebarGroup>
            <SidebarGroupLabel>Rafed Provider</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Upload Forecast">
                    <Link href="/rafed-provider/upload">
                      <FileUp />
                      <span>Upload Forecast</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Previous Uploads">
                    <Link href="/rafed-provider/history">
                      <History />
                      <span>Previous Uploads</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Rafed Admin Module - Show for Rafed Admin only */}
        {(role === "rafed-admin" || role === "obtivian") && (
          <SidebarGroup>
            <SidebarGroupLabel>Rafed Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Provider Submissions">
                    <Link href="/rafed-admin/submissions">
                      <Database />
                      <span>Provider Submissions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Submission Reports">
                    <Link href="/rafed-admin/reports">
                      <FileBarChart />
                      <span>Submission Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Anomaly Detection">
                    <Link href="/rafed-admin/anomalies">
                      <AlertTriangle />
                      <span>Anomaly Detection</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Order Management">
                    <Link href="/rafed-admin/orders">
                      <CheckSquare />
                      <span>Order Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="User Management">
                    <Link href="/rafed-admin/users">
                      <Users />
                      <span>User Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Configuration - Show for Obtivian only */}
        {role === "obtivian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Configuration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Data Sources">
                    <Link href="/settings/data-sources">
                      <Database />
                      <span>Data Sources</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{userinfo.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {role === "rafed-admin"
                      ? "Rafed Administrator"
                      : role === "rafed-provider"
                        ? "Rafed Provider"
                        : "Supply Chain Manager"}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
