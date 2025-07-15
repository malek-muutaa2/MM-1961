import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"

export async function GET() {
    try {
        // Get alerts count by severity
        const severityStats = await db
            .select({
                severity: alerts.severity,
                count: count(),
            })
            .from(alerts)
            .groupBy(alerts.severity)

        // Get alerts count by status
        const statusStats = await db
            .select({
                status: alerts.status,
                count: count(),
            })
            .from(alerts)
            .groupBy(alerts.status)

        // Get total alerts count
        const totalAlerts = await db.select({ count: count() }).from(alerts)

        // Get active alerts count
        const activeAlerts = await db.select({ count: count() }).from(alerts).where(eq(alerts.status, "active"))

        // Get resolved alerts count
        const resolvedAlerts = await db.select({ count: count() }).from(alerts).where(eq(alerts.status, "resolved"))

        return NextResponse.json({
            severityStats: severityStats.map((stat) => ({
                severity: stat.severity,
                count: stat.count,
            })),
            statusStats: statusStats.map((stat) => ({
                status: stat.status,
                count: stat.count,
            })),
            totalAlerts: totalAlerts[0]?.count || 0,
            activeAlerts: activeAlerts[0]?.count || 0,
            resolvedAlerts: resolvedAlerts[0]?.count || 0,
        })
    } catch (error) {
        console.error("Error fetching alert insights:", error)
        return NextResponse.json({ error: "Failed to fetch alert insights" }, { status: 500 })
    }
}
