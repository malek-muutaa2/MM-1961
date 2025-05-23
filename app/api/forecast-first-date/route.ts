import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { forecastData } from "@/lib/db/schema"
import { eq, gt, min, and } from "drizzle-orm"

export async function GET() {
    try {
        // Get current date
        const today = new Date()

        // Find the first date with forecast data that is in the future
        const result = await db
            .select({
                minDate: min(forecastData.date),
            })
            .from(forecastData)
            .where(and(gt(forecastData.date, today), eq(forecastData.type, "forecast")))

        if (!result[0].minDate) {
            // If no future dates, return today's date
            return NextResponse.json({ date: today.toISOString() })
        }

        return NextResponse.json({ date: result[0].minDate.toString() })
    } catch (error) {
        console.error("Error fetching first forecast date:", error)

        // Return today's date as fallback
        const today = new Date()
        return NextResponse.json({ date: today.toISOString() })
    }
}
