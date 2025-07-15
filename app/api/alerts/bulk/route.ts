import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts, users } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"

// Types
interface BulkAlertData {
    alertTemplateId: number
    severity: "critical" | "warning" | "info" | "low"
    status?: "active" | "acknowledged" | "resolved" | "snoozed" | "dismissed"
    triggeredAt?: string
    createdBy?: number
}

interface BulkInsertRequest {
    alerts: BulkAlertData[]
}

// --- Validation utilities ---

const VALID_SEVERITIES = ["critical", "warning", "info", "low"]
const VALID_STATUSES = ["active", "acknowledged", "resolved", "snoozed", "dismissed"]

function validateAlerts(alerts: BulkAlertData[]): { errors: string[], userIds: number[] } {
    const errors: string[] = []
    const userIds: Set<number> = new Set()

    alerts.forEach((alert, index) => {
        if (!alert.alertTemplateId)
            errors.push(`Alert ${index + 1}: alertTemplateId is required`)
        if (!alert.severity)
            errors.push(`Alert ${index + 1}: severity is required`)
        if (alert.severity && !VALID_SEVERITIES.includes(alert.severity))
            errors.push(`Alert ${index + 1}: invalid severity value`)
        if (alert.status && !VALID_STATUSES.includes(alert.status))
            errors.push(`Alert ${index + 1}: invalid status value`)
        if (alert.createdBy)
            userIds.add(alert.createdBy)
    })

    return { errors, userIds: Array.from(userIds) }
}

async function verifyUserIdsExist(userIds: number[]): Promise<number[] | null> {
    if (userIds.length === 0) return null

    const existingUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.id, userIds))

    const existingIds = existingUsers.map(u => u.id)
    const nonExistent = userIds.filter(id => !existingIds.includes(id))
    return nonExistent.length ? nonExistent : null
}

async function insertAlerts(alertsData: BulkAlertData[]) {
    return db.transaction(async (tx) => {
        const results = []

        for (const alert of alertsData) {
            const [inserted] = await tx
                .insert(alerts)
                .values({
                    alertTemplateId: alert.alertTemplateId,
                    severity: alert.severity,
                    status: alert.status ?? "active",
                    triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : new Date(),
                    createdBy: alert.createdBy,
                })
                .returning({
                    alertTemplateId: alerts.alertTemplateId,
                    severity: alerts.severity,
                    status: alerts.status,
                    triggeredAt: alerts.triggeredAt,
                    createdBy: alerts.createdBy,
                })

            results.push(inserted)
        }

        return results
    })
}

// --- Main Handler ---

export async function POST(request: Request) {
    try {
        const body: BulkInsertRequest = await request.json()

        if (!body.alerts || !Array.isArray(body.alerts) || body.alerts.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: alerts array is required and cannot be empty" },
                { status: 400 }
            )
        }

        const { errors, userIds } = validateAlerts(body.alerts)
        if (errors.length) {
            return NextResponse.json({ error: "Validation errors", details: errors }, { status: 400 })
        }

        const nonExistentUsers = await verifyUserIdsExist(userIds)
        if (nonExistentUsers) {
            return NextResponse.json(
                {
                    error: "Invalid user references",
                    details: `The following user IDs do not exist: ${nonExistentUsers.join(", ")}`,
                    nonExistentUserIds: nonExistentUsers,
                },
                { status: 400 }
            )
        }

        const insertedAlerts = await insertAlerts(body.alerts)

        return NextResponse.json({
            success: true,
            message: `Successfully inserted ${insertedAlerts.length} alerts`,
            data: {
                insertedCount: insertedAlerts.length,
                alerts: insertedAlerts,
                verifiedUserIds: userIds.length > 0 ? userIds : null,
            },
        })

    } catch (error) {
        console.error("Error in bulk alert insert:", error)

        if (error instanceof Error) {
            if (error.message.includes("foreign key constraint")) {
                return NextResponse.json(
                    { error: "Invalid reference: Check that alertTemplateId and createdBy values exist" },
                    { status: 400 }
                )
            }
            if (error.message.includes("duplicate key")) {
                return NextResponse.json(
                    {
                        error: "Duplicate entry detected",
                        details: "One or more alerts could not be inserted due to duplicate keys",
                    },
                    { status: 409 }
                )
            }
            if (error.message.includes("violates unique constraint")) {
                return NextResponse.json(
                    {
                        error: "Unique constraint violation",
                        details: "One or more alerts violate database constraints",
                    },
                    { status: 409 }
                )
            }
        }

        return NextResponse.json({ error: "Internal server error during bulk insert" }, { status: 500 })
    }
}
