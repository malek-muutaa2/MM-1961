"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { UserType } from "@/lib/db/schema"
import {
    Users,
    Shield,
    Activity,
    Database,
    Settings,
    AlertTriangle,
    TrendingUp,
    FileText,
    UserCheck,
    Clock,
    UserCog,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { AdminUsersTable } from "./admin-users-table"
import { useState } from "react"
import {UserManagement} from "@/components/rafed-admin/user-management";

interface AdminPortalDashboardProps {
    currentUser: UserType
    totalUsers: number
    recentUsers: UserType[]
    roleStats: Array<{ role: string; count: number }>
    activeSessions: number

}

export function AdminPortalDashboard({
                                         currentUser,
                                         totalUsers,
                                         recentUsers,
                                         roleStats,
    activeSessions
                                     }: AdminPortalDashboardProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const totalRoles = roleStats.length

    const stats = [
        {
            title: "Total Users",
            value: totalUsers.toString(),
            description: "Registered users in the system",
            icon: Users,
            trend: `${totalRoles} different roles`,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active Sessions",
            value: activeSessions.toString(),
            description: "Users active in last 24 hours",
            icon: Activity,
            trend: "Real-time data",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        // {
        //     title: "System Health",
        //     value: "98.5%",
        //     description: "Overall system uptime",
        //     icon: TrendingUp,
        //     trend: "Last 30 days",
        //     color: "text-emerald-600",
        //     bgColor: "bg-emerald-50",
        // },
        // {
        //     title: "Pending Actions",
        //     value: "3",
        //     description: "Items requiring attention",
        //     icon: AlertTriangle,
        //     trend: "2 critical",
        //     color: "text-orange-600",
        //     bgColor: "bg-orange-50",
        // },
    ]

    const quickActions = [
        {
            title: "User Management",
            description: "Manage users, roles, and permissions",
            icon: Users,
            href: "/rafed-admin/users",
            color: "text-blue-600",
        },
        {
            title: "Role & Permissions",
            description: "Configure roles and access control",
            icon: UserCog,
            href: "/rafed-admin/users",
            color: "text-indigo-600",
        },
        {
            title: "System Settings",
            description: "Configure system-wide settings",
            icon: Settings,
            href: "/settings",
            color: "text-purple-600",
        },
        {
            title: "Reports & Analytics",
            description: "View detailed system reports",
            icon: FileText,
            href: "/rafed-admin/reports",
            color: "text-green-600",
        },
        {
            title: "Database Management",
            description: "Monitor and manage database",
            icon: Database,
            href: "/settings/data-sources",
            color: "text-orange-600",
        },
    ]

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Admin":
                return "destructive"
            case "Provider":
                return "default"
            case "Supplier":
                return "secondary"
            case "User":
                return "outline"
            case "Viewer":
                return "secondary"
            default:
                return "outline"
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="space-y-6">

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>


            {/*<Card>*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle className="flex items-center gap-2">*/}
            {/*            <Users className="h-5 w-5" />*/}
            {/*            User Management*/}
            {/*        </CardTitle>*/}
            {/*        <CardDescription>*/}
            {/*            Search and filter users by role/permission. Change user roles directly in the table.*/}
            {/*        </CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*        <AdminUsersTable users={allUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}

            {/* Recent Activity and Role Distribution */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Recent Users
                        </CardTitle>
                        <CardDescription>Latest user registrations with role information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.image || undefined} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                                    </div>
                                </div>
                            ))}
                            {recentUsers.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent users</p>
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                            <Link href="/rafed-admin/users">View All Users & Manage Roles</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Role Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCog className="h-5 w-5" />
                            Role Distribution
                        </CardTitle>
                        <CardDescription>Overview of user roles in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {roleStats.map((roleStat) => (
                                <div key={roleStat.role} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getRoleColor(roleStat.role) as any}>{roleStat.role}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{roleStat.count} users</span>
                                        <span className="text-xs text-muted-foreground">
                      ({((roleStat.count / totalUsers) * 100).toFixed(1)}%)
                    </span>
                                    </div>
                                </div>
                            ))}
                            {roleStats.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No role data available</p>
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                            <Link href="/rafed-admin/users">Manage Roles & Permissions</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Navigate to role/permission management and other administrative modules</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <Link key={action.title} href={action.href}>
                                    <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <Icon className={`h-6 w-6 ${action.color}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm">{action.title}</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
            {/* System Status */}
            {/*<Card>*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle className="flex items-center gap-2">*/}
            {/*            <Activity className="h-5 w-5" />*/}
            {/*            System Status*/}
            {/*        </CardTitle>*/}
            {/*        <CardDescription>Current system health and service metrics</CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">*/}
            {/*            <div className="space-y-2">*/}
            {/*                <div className="flex items-center justify-between">*/}
            {/*                    <div className="flex items-center gap-2">*/}
            {/*                        <div className="h-2 w-2 rounded-full bg-green-500" />*/}
            {/*                        <span className="text-sm">API Services</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <Badge variant="outline" className="text-green-600 w-full justify-center">*/}
            {/*                    Operational*/}
            {/*                </Badge>*/}
            {/*            </div>*/}
            {/*            <div className="space-y-2">*/}
            {/*                <div className="flex items-center justify-between">*/}
            {/*                    <div className="flex items-center gap-2">*/}
            {/*                        <div className="h-2 w-2 rounded-full bg-green-500" />*/}
            {/*                        <span className="text-sm">Database</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <Badge variant="outline" className="text-green-600 w-full justify-center">*/}
            {/*                    Operational*/}
            {/*                </Badge>*/}
            {/*            </div>*/}
            {/*            <div className="space-y-2">*/}
            {/*                <div className="flex items-center justify-between">*/}
            {/*                    <div className="flex items-center gap-2">*/}
            {/*                        <div className="h-2 w-2 rounded-full bg-yellow-500" />*/}
            {/*                        <span className="text-sm">Storage</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <Badge variant="outline" className="text-yellow-600 w-full justify-center">*/}
            {/*                    Degraded*/}
            {/*                </Badge>*/}
            {/*            </div>*/}
            {/*            <div className="space-y-2">*/}
            {/*                <div className="flex items-center justify-between">*/}
            {/*                    <div className="flex items-center gap-2">*/}
            {/*                        <div className="h-2 w-2 rounded-full bg-green-500" />*/}
            {/*                        <span className="text-sm">Authentication</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <Badge variant="outline" className="text-green-600 w-full justify-center">*/}
            {/*                    Operational*/}
            {/*                </Badge>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="pt-4 mt-4 border-t">*/}
            {/*            <div className="flex items-center justify-between text-sm">*/}
            {/*  <span className="text-muted-foreground flex items-center gap-2">*/}
            {/*    <Clock className="h-4 w-4" />*/}
            {/*    Last checked*/}
            {/*  </span>*/}
            {/*                <span className="font-medium">{formatDistanceToNow(new Date(), { addSuffix: true })}</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
        </div>
    )
}
