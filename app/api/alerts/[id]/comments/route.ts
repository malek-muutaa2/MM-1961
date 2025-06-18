import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { alertComments, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        console.log("Fetching comments for alert ID:", params)

        // Await params first
        const resolvedParams = await params
        const alertId = Number.parseInt(resolvedParams.id)

        console.log("Parsed alert ID:", alertId)

        if (isNaN(alertId)) {
            console.error("Invalid alert ID:", resolvedParams.id)
            return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
        }

        // Get comments for this alert with user information
        console.log("Querying database for comments...")

        const comments = await db
            .select({
                id: alertComments.id,
                comment: alertComments.comment,
                createdAt: alertComments.createdAt,
                createdBy: alertComments.createdBy,
                updatedStatus: alertComments.updatedStatus,
                userName: users.name,
                userEmail: users.email,
            })
            .from(alertComments)
            .leftJoin(users, eq(alertComments.createdBy, users.id))
            .where(eq(alertComments.alertId, alertId))
            .orderBy(desc(alertComments.createdAt))

        console.log("Raw comments from DB:", comments)

        // Process comments with user information
        const processedComments = comments.map((comment) => {
            console.log("Processing comment:", comment)

            return {
                id: comment.id || 0,
                comment: comment.comment || "",
                createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString(),
                createdBy: comment.createdBy || 0,
                updatedStatus: comment.updatedStatus || null,
                userName: comment.userName || "Unknown User",
                userEmail: comment.userEmail || "",
            }
        })

        console.log("Processed comments:", processedComments)

        return NextResponse.json({
            success: true,
            comments: processedComments,
        })
    } catch (error) {
        console.error("Error fetching comments:", error)
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

        return NextResponse.json(
            {
                error: "Failed to fetch comments",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        const { comment, currentStatus } = await request.json()

        if (!comment || comment.trim() === "") {
            return NextResponse.json({ error: "Comment is required" }, { status: 400 })
        }

        console.log("Adding comment:", { alertId, comment, currentStatus, userId: currentUser.id })

        // Add comment with current status and user info
        const commentText = currentStatus ? `[Status: ${currentStatus}] ${comment}` : comment

        const newComment = await db
            .insert(alertComments)
            .values({
                alertId,
                updatedStatus: currentStatus as any,
                comment: commentText,
                createdAt: new Date(),
                createdBy: currentUser.id, // Use actual user ID from session
            })
            .returning()

        console.log("Comment added successfully:", newComment[0])

        // Return the comment with user information
        return NextResponse.json({
            success: true,
            message: "Comment added successfully",
            comment: {
                ...newComment[0],
                userName: currentUser.name,
                userEmail: currentUser.email,
            },
        })
    } catch (error) {
        console.error("Error adding comment:", error)
        return NextResponse.json(
            {
                error: "Failed to add comment",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
