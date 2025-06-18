import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts, alertTemplates, alertKpis, alertTemplateFields, alertFieldValues } from "@/lib/db/schema"
import { eq, desc, asc, count, like, or, inArray, and } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("size") || "10")
        const search = searchParams.get("search") || ""
        const column = searchParams.get("column") || "triggeredAt"
        const order = searchParams.get("order") || "desc"
        const severity = searchParams.get("severity") || ""
        const offset = (page - 1) * limit

        console.log("=== API Request Debug ===")
        console.log("Severity filter:", severity)
        console.log("All params:", { page, limit, search, column, order, severity })

        // Build base query
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

        // Build where conditions array
        const whereConditions = []

        // Add search filter if provided
        if (search) {
            whereConditions.push(
                or(
                    like(alertTemplates.name, `%${search}%`),
                    like(alertTemplates.messageEn, `%${search}%`),
                    like(alertKpis.name, `%${search}%`),
                ),
            )
        }

        // Add severity filter if provided - THIS IS THE KEY FIX
        if (severity && severity.trim() !== "") {
            const severityValues = severity
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            console.log("Parsed severity values:", severityValues)

            if (severityValues.length > 0) {
                // Use direct string comparison instead of inArray for debugging
                if (severityValues.length === 1) {
                    whereConditions.push(eq(alerts.severity, severityValues[0]))
                    console.log("Single severity filter:", severityValues[0])
                } else {
                    whereConditions.push(inArray(alerts.severity, severityValues))
                    console.log("Multiple severity filter:", severityValues)
                }
            }
        }

        // Apply where conditions
        if (whereConditions.length > 0) {
            if (whereConditions.length === 1) {
                query = query.where(whereConditions[0])
            } else {
                query = query.where(and(...whereConditions))
            }
        }

        // Add sorting
        if (column === "severity") {
            query = order === "desc" ? query.orderBy(desc(alerts.severity)) : query.orderBy(asc(alerts.severity))
        } else if (column === "title") {
            query = order === "desc" ? query.orderBy(desc(alertTemplates.name)) : query.orderBy(asc(alertTemplates.name))
        } else if (column === "status") {
            query = order === "desc" ? query.orderBy(desc(alerts.status)) : query.orderBy(asc(alerts.status))
        } else if (column === "kpi") {
            query = order === "desc" ? query.orderBy(desc(alertKpis.name)) : query.orderBy(asc(alertKpis.name))
        } else if (column === "timestamp" || column === "triggeredAt") {
            query = order === "desc" ? query.orderBy(desc(alerts.triggeredAt)) : query.orderBy(asc(alerts.triggeredAt))
        } else {
            query = order === "desc" ? query.orderBy(desc(alerts.triggeredAt)) : query.orderBy(asc(alerts.triggeredAt))
        }

        // Get total count for pagination with same filters
        let countQuery = db
            .select({ count: count() })
            .from(alerts)
            .leftJoin(alertTemplates, eq(alerts.alertTemplateId, alertTemplates.id))
            .leftJoin(alertKpis, eq(alertTemplates.kpiId, alertKpis.id))

        // Apply same where conditions to count query
        if (whereConditions.length > 0) {
            if (whereConditions.length === 1) {
                countQuery = countQuery.where(whereConditions[0])
            } else {
                countQuery = countQuery.where(and(...whereConditions))
            }
        }

        const totalCountResult = await countQuery
        const totalCount = totalCountResult[0]?.count || 0

        // Execute paginated query
        const alertsData = await query.limit(limit).offset(offset)

        console.log(`=== Query Results ===`)
        console.log(`Total alerts found: ${totalCount}`)
        console.log(`Alerts on this page: ${alertsData.length}`)
        console.log(
            "Sample alert severities:",
            alertsData.map((a) => ({ id: a.id, severity: a.severity })),
        )

        // For each alert, fetch its field values and hydrate message
        const enrichedAlerts = await Promise.all(
            alertsData.map(async (alert) => {
                // Get field values for this alert
                const fieldValues = await db
                    .select({
                        fieldId: alertFieldValues.fieldId,
                        value: alertFieldValues.value,
                        fieldName: alertTemplateFields.name,
                    })
                    .from(alertFieldValues)
                    .leftJoin(alertTemplateFields, eq(alertFieldValues.fieldId, alertTemplateFields.id))
                    .where(eq(alertFieldValues.alertId, alert.id))

                // Create a map of field names to values
                const valueMap: Record<string, string> = {}
                fieldValues.forEach((fv) => {
                    if (fv.fieldName) {
                        valueMap[fv.fieldName] = fv.value || ""
                    }
                })

                // Replace placeholders in the message template
                let hydratedMessage = alert.templateMessage || ""
                Object.entries(valueMap).forEach(([fieldName, value]) => {
                    const placeholder = `{${fieldName}}`
                    hydratedMessage = hydratedMessage.replace(new RegExp(placeholder, "g"), value)
                })

                // Calculate time ago
                const timeAgo = alert.triggeredAt
                    ? `${Math.floor((Date.now() - new Date(alert.triggeredAt).getTime()) / (1000 * 60 * 60))} hours ago`
                    : "Unknown"

                return {
                    id: alert.id,
                    title: alert.templateName || "Unknown Alert",
                    description: hydratedMessage,
                    kpi: alert.kpiName || "Unknown KPI",
                    severity: alert.severity || "info",
                    status: alert.status || "active",
                    timestamp: timeAgo,
                    isRead: alert.status !== "active", // Consider non-active alerts as read
                }
            }),
        )

        const totalPages = Math.ceil(totalCount / limit)

        console.log("=== Final Response ===")
        console.log(
            "Enriched alerts severities:",
            enrichedAlerts.map((a) => ({ id: a.id, severity: a.severity })),
        )

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
