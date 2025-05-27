import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import {classifications, forecastData, products} from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

export async function GET() {
    try {
        // Query all forecast data (excluding historical data)
        const data = await db
            .select({
                id: forecastData.id,
                productId: forecastData.productId,
                forecastTypeId: forecastData.forecastTypeId,
                date: forecastData.date,
                value: forecastData.value,
                classificationName: classifications.name,
                productName: products.name,

            })
            .from(forecastData)
            .leftJoin(classifications, eq(forecastData.classificationId, classifications.id))
            .leftJoin(products, eq(forecastData.productId, products.id))
            .where(eq(forecastData.type, "forecast")) // Only get forecast data, not historical
            .orderBy(asc(forecastData.date), asc(forecastData.productId))
        console.log("Fetched complete forecast data:", data)

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching complete forecast data:", error)
        return NextResponse.json({ error: "Failed to fetch complete forecast data" }, { status: 500 })
    }
}
