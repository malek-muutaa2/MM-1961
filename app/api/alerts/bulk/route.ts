import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts, users } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { inArray } from "drizzle-orm"

// Type definitions for the bulk insert request
interface BulkAlertData {
    alertTemplateId: number
    severity: "critical" | "warning" | "info" | "low"
    status?: "active" | "acknowledged" | "resolved" | "snoozed" | "dismissed"
    triggeredAt?: string
    createdBy?: number // User ID who created the alert
}

interface BulkInsertRequest {
    alerts: BulkAlertData[]
}

export async function POST(request: Request) {
    try {


        // Parse request body
        const body: BulkInsertRequest = await request.json()

        // Validate request structure
        if (!body.alerts || !Array.isArray(body.alerts) || body.alerts.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: alerts array is required and cannot be empty" },
                { status: 400 },
            )
        }

        // Validate each alert data
        const validationErrors: string[] = []
        const createdByIds: number[] = []

        body.alerts.forEach((alert, index) => {
            if (!alert.alertTemplateId) {
                validationErrors.push(`Alert ${index + 1}: alertTemplateId is required`)
            }
            if (!alert.severity) {
                validationErrors.push(`Alert ${index + 1}: severity is required`)
            }
            if (alert.severity && !["critical", "warning", "info", "low"].includes(alert.severity)) {
                validationErrors.push(`Alert ${index + 1}: invalid severity value`)
            }
            if (alert.status && !["active", "acknowledged", "resolved", "snoozed", "dismissed"].includes(alert.status)) {
                validationErrors.push(`Alert ${index + 1}: invalid status value`)
            }

            // Collect all createdBy IDs for validation
            if (alert.createdBy) {
                if (!createdByIds.includes(alert.createdBy)) {
                    createdByIds.push(alert.createdBy)
                }
            }
        })

        if (validationErrors.length > 0) {
            return NextResponse.json({ error: "Validation errors", details: validationErrors }, { status: 400 })
        }

        // Verify that all createdBy user IDs exist in the users table
        if (createdByIds.length > 0) {
            console.log(`Verifying ${createdByIds.length} user IDs exist:`, createdByIds)

            const existingUsers = await db.select({ id: users.id }).from(users).where(inArray(users.id, createdByIds))

            const existingUserIds = existingUsers.map((u) => u.id)
            const nonExistentUserIds = createdByIds.filter((id) => !existingUserIds.includes(id))

            if (nonExistentUserIds.length > 0) {
                return NextResponse.json(
                    {
                        error: "Invalid user references",
                        details: `The following user IDs do not exist: ${nonExistentUserIds.join(", ")}`,
                        nonExistentUserIds,
                    },
                    { status: 400 },
                )
            }

            console.log(`All user IDs verified successfully: ${existingUserIds.join(", ")}`)
        }


        // Start transaction for bulk insert
        const insertedAlerts = await db.transaction(async (tx) => {
            const results = []

            for (const alertData of body.alerts) {
                // Insert alert - Remove the id field to let it auto-increment
                const [insertedAlert] = await tx
                    .insert(alerts)
                    .values({
                        alertTemplateId: alertData.alertTemplateId,
                        severity: alertData.severity,
                        status: alertData.status || "active",
                        triggeredAt: alertData.triggeredAt ? new Date(alertData.triggeredAt) : new Date(),
                        createdBy: alertData.createdBy
                    })
                    .returning({
                        alertTemplateId: alerts.alertTemplateId,
                        severity: alerts.severity,
                        status: alerts.status,
                        triggeredAt: alerts.triggeredAt,
                        createdBy: alerts.createdBy,
                    })

                results.push(insertedAlert)
            }

            return results
        })

        console.log(`Successfully inserted ${insertedAlerts.length} alerts`)

        return NextResponse.json({
            success: true,
            message: `Successfully inserted ${insertedAlerts.length} alerts`,
            data: {
                insertedCount: insertedAlerts.length,
                alerts: insertedAlerts,
                verifiedUserIds: createdByIds.length > 0 ? createdByIds : null,
            },
        })
    } catch (error) {
        console.error("Error in bulk alert insert:", error)

        // Handle specific database errors
        if (error instanceof Error) {
            if (error.message.includes("foreign key constraint")) {
                return NextResponse.json(
                    { error: "Invalid reference: Check that alertTemplateId and createdBy values exist" },
                    { status: 400 },
                )
            }
            if (error.message.includes("duplicate key")) {
                return NextResponse.json(
                    {
                        error: "Duplicate entry detected",
                        details: "One or more alerts could not be inserted due to duplicate keys",
                    },
                    { status: 409 },
                )
            }
            if (error.message.includes("violates unique constraint")) {
                return NextResponse.json(
                    {
                        error: "Unique constraint violation",
                        details: "One or more alerts violate database constraints",
                    },
                    { status: 409 },
                )
            }
        }

        return NextResponse.json({ error: "Internal server error during bulk insert" }, { status: 500 })
    }
}
