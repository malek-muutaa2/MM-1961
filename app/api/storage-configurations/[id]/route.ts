import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadStorageConfigurations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const body = await request.json()

    const [updatedConfig] = await db
      .update(uploadStorageConfigurations)
      .set({
        name: body.name,
        description: body.description,
        storageType: body.storage_type,
        bucketName: body.bucket_name,
        basePath: body.base_path,
        pathTemplate: body.path_template,
        region: body.region,
        awsAccessKeyId: body.aws_access_key_id,
        awsSecretAccessKey: body.aws_secret_access_key,
        accessType: body.access_type,
        updatedAt: new Date(),
      })
      .where(eq(uploadStorageConfigurations.id, params.id))
      .returning()

    if (!updatedConfig) {
      return NextResponse.json({ error: "Storage configuration not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: updatedConfig.id,
      name: updatedConfig.name,
      description: updatedConfig.description,
      storage_type: updatedConfig.storageType,
      bucket_name: updatedConfig.bucketName,
      base_path: updatedConfig.basePath,
      path_template: updatedConfig.pathTemplate,
      region: updatedConfig.region,
      aws_access_key_id: updatedConfig.awsAccessKeyId,
      aws_secret_access_key: updatedConfig.awsSecretAccessKey,
      access_type: updatedConfig.accessType,
      created_at: updatedConfig.createdAt,
      updated_at: updatedConfig.updatedAt,
    })
  } catch (error) {
    console.error("Failed to update storage configuration:", error)
    return NextResponse.json({ error: "Failed to update storage configuration" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  try {

    // await db.delete(uploadStorageConfigurations).where(eq(uploadStorageConfigurations.id, params.id))
      // todo : update deletedAt instead of deleting
      await db.update(
        uploadStorageConfigurations
      ).set({
        deletedAt: new Date(),
      }).where(eq(uploadStorageConfigurations.id, params.id));


    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete storage configuration:", error)
    return NextResponse.json({ error: "Failed to delete storage configuration" }, { status: 500 })
  }
}
