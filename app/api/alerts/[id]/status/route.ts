import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alerts, alertComments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {getCurrentUser} from "@/lib/getCurrentUser";


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Get current user from session
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 })
        }

        console.log("Current user:", currentUser)
        // Await params first
        const resolvedParams = await params
        const alertId = Number.parseInt(resolvedParams.id)
        const { status, comment, currentStatus } = await request.json()

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        // Validate status against enum
        const validStatuses = ["active", "acknowledged", "resolved", "snoozed", "dismissed"]
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        // Update alert status
        const updatedAlert = await db
            .update(alerts)
            .set({
                status: status as any,
                resolvedAt: status === "resolved" ? new Date() : null,
            })
            .where(eq(alerts.id, alertId))
            .returning()

        if (updatedAlert.length === 0) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 })
        }

        // Add comment with status change information
        const commentText = comment
            ? `${comment}`
            : `Status changed from "${currentStatus}" to "${status}"`

        await db.insert(alertComments).values({
            alertId,
            updatedStatus: status as any,
            comment: commentText,
            createdAt: new Date(),
            createdBy: currentUser.id, // TODO: Get from session
        })

        return NextResponse.json({
            message: "Alert status updated successfully",
            alert: updatedAlert[0],
        })
    } catch (error) {
        console.error("Error updating alert status:", error)
        return NextResponse.json({ error: "Failed to update alert status" }, { status: 500 })
    }
}
