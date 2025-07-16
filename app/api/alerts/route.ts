import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts, alertTemplates, alertKpis, alertTemplateFields, alertFieldValues } from "@/lib/db/schema"
import { eq, desc, asc, count, like, or, inArray, and } from "drizzle-orm"

function buildWhereConditions(search: string, severity: string) {
    const conditions = []

    if (search) {
        conditions.push(
            or(
                like(alertTemplates.name, `%${search}%`),
                like(alertTemplates.messageEn, `%${search}%`),
                like(alertKpis.name, `%${search}%`)
            )
        )
    }

    const severities = severity.split(",").map(s => s.trim()).filter(Boolean)
    if (severities.length === 1) {
        conditions.push(eq(alerts.severity, severities[0]))
    } else if (severities.length > 1) {
        conditions.push(inArray(alerts.severity, severities))
    }

    return conditions
}

function applySorting(query: any, column: string, order: string) {
    const direction = order === "desc" ? desc : asc

    switch (column) {
        case "severity":
            return query.orderBy(direction(alerts.severity))
        case "title":
            return query.orderBy(direction(alertTemplates.name))
        case "status":
            return query.orderBy(direction(alerts.status))
        case "kpi":
            return query.orderBy(direction(alertKpis.name))
        case "timestamp":
        case "triggeredAt":
        default:
            return query.orderBy(direction(alerts.triggeredAt))
    }
}

async function getTotalCount(whereConditions: any[]) {
    let query = db
        .select({ count: count() })
        .from(alerts)
        .leftJoin(alertTemplates, eq(alerts.alertTemplateId, alertTemplates.id))
        .leftJoin(alertKpis, eq(alertTemplates.kpiId, alertKpis.id))

    if (whereConditions.length === 1) {
        query = query.where(whereConditions[0])
    } else if (whereConditions.length > 1) {
        query = query.where(and(...whereConditions))
    }

    const result = await query
    return result[0]?.count || 0
}

async function enrichAlerts(alertsData: any[]) {
    return await Promise.all(alertsData.map(async (alert) => {
        const fieldValues = await db
            .select({
                fieldId: alertFieldValues.fieldId,
                value: alertFieldValues.value,
                fieldName: alertTemplateFields.name,
            })
            .from(alertFieldValues)
            .leftJoin(alertTemplateFields, eq(alertFieldValues.fieldId, alertTemplateFields.id))
            .where(eq(alertFieldValues.alertId, alert.id))

        const valueMap = Object.fromEntries(fieldValues.map(fv => [fv.fieldName, fv.value ?? ""]))

        let hydratedMessage = alert.templateMessage ?? ""
        for (const [key, val] of Object.entries(valueMap)) {
            hydratedMessage = hydratedMessage.replace(new RegExp(`{${key}}`, "g"), val)
        }

        const timeAgo = alert.triggeredAt
            ? `${Math.floor((Date.now() - new Date(alert.triggeredAt).getTime()) / (1000 * 60 * 60))} hours ago`
            : "Unknown"

        return {
            id: alert.id,
            title: alert.templateName ?? "Unknown Alert",
            description: hydratedMessage,
            kpi: alert.kpiName ?? "Unknown KPI",
            severity: alert.severity ?? "info",
            status: alert.status || "active",
            timestamp: timeAgo,
            isRead: alert.status !== "active",
        }
    }))
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") ?? "1", 10)
        const limit = parseInt(searchParams.get("size") ?? "10", 10)
        const search = searchParams.get("search") ?? ""
        const column = searchParams.get("column") ?? "triggeredAt"
        const order = searchParams.get("order") ?? "desc"
        const severity = searchParams.get("severity") ?? ""
        const offset = (page - 1) * limit

        const whereConditions = buildWhereConditions(search, severity)

        let query = db
            .select({
                id: alerts.id,
                status: alerts.status,
                severity: alerts.severity,
                triggeredAt: alerts.triggeredAt,
                resolvedAt: alerts.resolvedAt,
                templateName: alertTemplates.name,
                templateMessage: alertTemplates.messageEn,
                kpiName: alertKpis.name,
            })
            .from(alerts)
            .leftJoin(alertTemplates, eq(alerts.alertTemplateId, alertTemplates.id))
            .leftJoin(alertKpis, eq(alertTemplates.kpiId, alertKpis.id))

        if (whereConditions.length === 1) {
            query = query.where(whereConditions[0])
        } else if (whereConditions.length > 1) {
            query = query.where(and(...whereConditions))
        }

        query = applySorting(query, column, order)

        const totalCount = await getTotalCount(whereConditions)
        const alertsData = await query.limit(limit).offset(offset)
        const enrichedAlerts = await enrichAlerts(alertsData)
        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            alerts: enrichedAlerts,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        })
    } catch (error) {
        console.error("Error fetching alerts:", error)
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }
}
