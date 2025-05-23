import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import {classifications, forecastData, products} from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const date = searchParams.get("date")

        if (!date) {
            return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
        }


        // Query forecast data for all products at the specified date
        const data = await db
            .select({
                id: forecastData.id,
                productId: forecastData.productId,
                forecastTypeId: forecastData.forecastTypeId,
                date: forecastData.date,
                value: forecastData.value,
                type: forecastData.type,
                classificationId: forecastData.classificationId,
                classificationName: classifications.name,
                productName: products.name,
            })
            .from(forecastData)
            .leftJoin(classifications, eq(forecastData.classificationId, classifications.id))
            .leftJoin(products, eq(forecastData.productId, products.id))
            .where(
                and(
                    eq(forecastData.date, date),
                    eq(forecastData.type, "forecast"),
                ),
            )
        //console.log("Fetched forecast data for all products:", data)
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching forecast data for all products:", error)
        return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
    }
}
