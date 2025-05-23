import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { products } from "@/lib/db/schema"

export async function GET() {
  try {
    const productsList = await db.query.products.findMany({
      with: {
        classification: {
          columns: {
            name: true,
          },
        },
      },
    });
    //console.log("Products List:", productsList)
    // Transform the data to match the expected format
    const formattedProducts = productsList.map((product) => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      // Add default values for missing fields
      sku: `SKU-${product.id}`,
      classificationId: product.classificationId,
        classificationName: product.classification?.name,
      unit: "Box",
    }))
//console.log("Formatted Products:", formattedProducts)
    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
