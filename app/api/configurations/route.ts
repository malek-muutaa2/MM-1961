import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadConfigurations, uploadConfigurationColumns, uploadStorageConfigurations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const configs = await db
      .select({
        id: uploadConfigurations.id,
        name: uploadConfigurations.name,
        description: uploadConfigurations.description,
        organizationType: uploadConfigurations.organizationType,
        organizationId: uploadConfigurations.organizationId,
        sourceType: uploadConfigurations.sourceType,
        fileType: uploadConfigurations.fileType,
        delimiter: uploadConfigurations.delimiter,
        maxFileSize: uploadConfigurations.maxFileSize,
        maxRows: uploadConfigurations.maxRows,
        storageConfigId: uploadConfigurations.storageConfigId,
        active: uploadConfigurations.active,
        createdAt: uploadConfigurations.createdAt,
        updatedAt: uploadConfigurations.updatedAt,
        storageConfig: {
          id: uploadStorageConfigurations.id,
          name: uploadStorageConfigurations.name,
          storageType: uploadStorageConfigurations.storageType,
          basePath: uploadStorageConfigurations.basePath,
        },
      })
      .from(uploadConfigurations)
      .leftJoin(uploadStorageConfigurations, eq(uploadConfigurations.storageConfigId, uploadStorageConfigurations.id))

    const formattedConfigs = configs.map((config: any) => ({
      id: config.id,
      name: config.name,
      description: config.description,
      organization_type: config.organizationType,
      organization_id: config.organizationId,
      source_type: config.sourceType,
      file_type: config.fileType,
      delimiter: config.delimiter,
      max_file_size: config.maxFileSize,
      max_rows: config.maxRows,
      storage_config_id: config.storageConfigId,
      active: config.active,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
      storage_config: config.storageConfig,
    }))

    return NextResponse.json(formattedConfigs)
  } catch (error) {
    console.error("Failed to fetch configurations:", error)
    return NextResponse.json({ error: "Failed to fetch configurations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Insert the configuration
    const [newConfig] = await db
      .insert(uploadConfigurations)
      .values({
        name: body.name,
        description: body.description,
        organizationType: body.organization_type,
        organizationId: body.organization_id,
        sourceType: body.source_type,
        fileType: body.file_type,
        delimiter: body.delimiter,
        maxFileSize: body.max_file_size,
        maxRows: body.max_rows,
        storageConfigId: body.storage_config_id,
        active: body.active ?? true,
        updatedAt: new Date(),
      })
      .returning()

    // Insert columns if provided
    if (body.columns && body.columns.length > 0) {
      const columnsToInsert = body.columns.map((column: any) => ({
        configId: newConfig.id,
        name: column.name,
        displayName: column.display_name,
        dataType: column.data_type,
        required: column.required ?? false,
        pattern: column.pattern,
        minLength: column.min_length,
        maxLength: column.max_length,
        minValue: column.min_value ? column.min_value.toString() : null,
        maxValue: column.max_value ? column.max_value.toString() : null,
        customValidator: column.custom_validator,
        position: column.position,
      }))

      await db.insert(uploadConfigurationColumns).values(columnsToInsert)
    }

    return NextResponse.json({
      id: newConfig.id,
      name: newConfig.name,
      description: newConfig.description,
      organization_type: newConfig.organizationType,
      organization_id: newConfig.organizationId,
      source_type: newConfig.sourceType,
      file_type: newConfig.fileType,
      delimiter: newConfig.delimiter,
      max_file_size: newConfig.maxFileSize,
      max_rows: newConfig.maxRows,
      storage_config_id: newConfig.storageConfigId,
      active: newConfig.active,
      created_at: newConfig.createdAt,
      updated_at: newConfig.updatedAt,
    })
  } catch (error) {
    console.error("Failed to create configuration:", error)
    return NextResponse.json({ error: "Failed to create configuration" }, { status: 500 })
  }
}
