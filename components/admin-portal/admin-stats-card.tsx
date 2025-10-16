"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface AdminStatsCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: string
    color?: string
}

export function AdminStatsCard({
                                   title,
                                   value,
                                   description,
                                   icon: Icon,
                                   trend,
                                   color = "text-primary",
                               }: AdminStatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                {trend && <p className="text-xs text-muted-foreground mt-2">{trend}</p>}
            </CardContent>
        </Card>
    )
}
