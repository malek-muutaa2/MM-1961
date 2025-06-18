import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { eq } from "drizzle-orm"
import {uploadConfigurationColumns, uploadConfigurations} from "@/lib/db/schema";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const [config] = await db.select().from(uploadConfigurations).where(eq(uploadConfigurations.id, params.id))

    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    const columns = await db
      .select()
      .from(uploadConfigurationColumns)
      .where(eq(uploadConfigurationColumns.configId, params.id))

    return NextResponse.json({
      id: config.id,
      name: config.name,
      description: config.description,
      organization_type: config.organizationType,
      // organization_id: config.organizationId,
      source_type: config.sourceType,
      file_type: config.fileType,
      delimiter: config.delimiter,
      max_file_size: config?.maxFileSize || null,
      max_rows: config.maxRows,
      storage_config_id: config.storageConfigId,
      allow_partial_upload: config.allowPartialUpload,
      active: config.active,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
      columns: columns.map((col) => ({
        id: col.id,
        config_id: col.configId,
        name: col.name,
        display_name: col.displayName,
        data_type: col.dataType,
        required: col.required,
        pattern: col.pattern,
        min_length: col.minLength,
        max_length: col.maxLength,
        min_value: col.minValue ? Number.parseFloat(col.minValue) : null,
        max_value: col.maxValue ? Number.parseFloat(col.maxValue) : null,
        custom_validator: col.customValidator,
        position: col.position,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch configuration:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const body = await request.json()
    if(!params.id ){
        return NextResponse.json({ error: "Configuration ID is required" }, { status: 400 })
    }
    // Update the configuration
    const [updatedConfig] = await db
      .update(uploadConfigurations)
      .set({
        name: body.name,
        description: body.description,
        organizationType: body.organization_type,
        // organizationId: body.organization_id,
        sourceType: body.source_type,
        fileType: body.file_type,
        delimiter: body.delimiter,
        maxFileSize: body?.max_file_size || null,
        maxRows: body.max_rows,
        storageConfigId: body.storage_config_id,
        allowPartialUpload: body.allow_partial_upload,
        active: body.active,
        updatedAt: new Date(),
      })
      .where(eq(uploadConfigurations.id, params.id))
      .returning()

    if (!updatedConfig) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    // Delete existing columns and insert new ones
    if (body.columns) {
      await db.delete(uploadConfigurationColumns).where(eq(uploadConfigurationColumns.configId, params.id))

      if (body.columns.length > 0) {
        const columnsToInsert = body.columns.map((column: any) => ({
          configId: params.id,
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
    }

    return NextResponse.json({
      id: updatedConfig.id,
      name: updatedConfig.name,
      description: updatedConfig.description,
      organization_type: updatedConfig.organizationType,
      // organization_id: updatedConfig.organizationId,
      source_type: updatedConfig.sourceType,
      file_type: updatedConfig.fileType,
      delimiter: updatedConfig.delimiter,
      max_file_size: updatedConfig?.maxFileSize || null,
      max_rows: updatedConfig.maxRows,
      storage_config_id: updatedConfig.storageConfigId,
      active: updatedConfig.active,
      allow_partial_upload: updatedConfig.allowPartialUpload,
      created_at: updatedConfig.createdAt,
      updated_at: updatedConfig.updatedAt,
    })
  } catch (error) {
    console.error("Failed to update configuration:", error)
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    // Delete columns first (cascade should handle this, but being explicit)
    // todo : don't delete columns if they are used in operations
    // await db.delete(uploadConfigurationColumns).where(eq(uploadConfigurationColumns.configId, params.id))

    // Delete the configuration
    // await db.delete(uploadConfigurations).where(eq(uploadConfigurations.id, params.id))
    // update deleted_At to mark as deleted
    await db
      .update(uploadConfigurations)
      .set({ deletedAt: new Date() })
      .where(eq(uploadConfigurations.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete configuration:", error)
    return NextResponse.json({ error: "Failed to delete configuration" }, { status: 500 })
  }
}
