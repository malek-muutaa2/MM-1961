import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { forecastData } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get("productId")

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
        }

        // Query forecast data for the specified product, ordered by date
        const data = await db
            .select({
                id: forecastData.id,
                type: forecastData.type,
                forecastTypeId: forecastData.forecastTypeId,
                date: forecastData.date,
                value: forecastData.value,
            })
            .from(forecastData)
            .where(eq(forecastData.productId, Number.parseInt(productId)))
            .orderBy(asc(forecastData.date)) // Order by date ascending

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching forecast data:", error)
        return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { productId, forecastTypeId, date, value } = body

        if (!productId || !forecastTypeId || !date || value === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if the forecast data already exists
        const existingData = await db
            .select()
            .from(forecastData)
            .where(
                and(
                    eq(forecastData.productId, Number.parseInt(productId)),
                    eq(forecastData.forecastTypeId, forecastTypeId),
                    eq(forecastData.date, new Date(date)),
                ),
            )

        let result

        if (existingData.length > 0) {
            // Update existing forecast data
            result = await db
                .update(forecastData)
                .set({
                    value: value,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(forecastData.productId, Number.parseInt(productId)),
                        eq(forecastData.forecastTypeId, forecastTypeId),
                        eq(forecastData.date, new Date(date)),
                    ),
                )
                .returning()
        } else {
            // Insert new forecast data
            result = await db
                .insert(forecastData)
                .values({
                    productId: Number.parseInt(productId),
                    forecastTypeId: forecastTypeId,
                    date: new Date(date),
                    value: value,
                    type: "forecast", // Default type
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning()
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error("Error updating forecast data:", error)
        return NextResponse.json({ error: "Failed to update forecast data" }, { status: 500 })
    }
}
