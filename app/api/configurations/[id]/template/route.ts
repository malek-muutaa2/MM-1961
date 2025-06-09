import { type NextRequest, NextResponse } from "next/server"
import { uploadConfigurations, uploadConfigurationColumns } from "@/lib/db/schema";
import { eq } from "drizzle-orm"
import { db } from "@/lib/db/dbpostgres"

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    // Get configuration with columns
    const [config] = await db.select().from(uploadConfigurations).where(eq(uploadConfigurations.id, params.id))

    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    const columns = await db
      .select()
      .from(uploadConfigurationColumns)
      .where(eq(uploadConfigurationColumns.configId, params.id))
      .orderBy(uploadConfigurationColumns.position)

    if (columns.length === 0) {
      return NextResponse.json({ error: "No columns defined for this configuration" }, { status: 400 })
    }

    // Determine file extension based on configuration
    const fileExtension = config.fileType.split(",")[0].trim().toLowerCase()
    const fileName = `${config.name.replace(/\s+/g, "_")}_template.${fileExtension}`

    // Generate example data
    const headers = columns.map((col: { name: any }) => col.name)
    const exampleData = columns.map((col: { dataType: string; required: boolean }) => {
      switch (col.dataType) {
        case "string":
          return col.required ?  "Example Text" : ""
        case "number":
          return col.required ? "123" : ""
        case "date":
          return col.required ? "2023-01-01" : ""
        case "boolean":
          return col.required ? "true" : ""
        case "email":
          return col.required ? "example@example.com" : ""
        default:
          return ""
      }
    })

    // For simplicity in this demo, we'll just use CSV for all formats
    // In a real implementation, you would use the xlsx library for Excel files
    const delimiter = config.delimiter
    const headerRow = headers.join(delimiter)
    const exampleRow = exampleData.join(delimiter)
    const csvContent = `${headerRow}\n${exampleRow}`

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Failed to generate template:", error)
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}
