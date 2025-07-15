import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadStorageConfigurations } from "@/lib/db/schema"
import {isNull} from "drizzle-orm";

export async function GET() {
  try {
    const storageConfigs = await db.select().
    from(uploadStorageConfigurations)
        .where(isNull(uploadStorageConfigurations.deletedAt))

    const formattedConfigs = storageConfigs.map((config: any) => ({
      id: config.id,
      name: config.name,
      description: config.description,
      storage_type: config.storageType,
      bucket_name: config.bucketName,
      base_path: config.basePath,
      path_template: config.pathTemplate,
      region: config.region,
      aws_access_key_id: config.awsAccessKeyId,
      aws_secret_access_key: config.awsSecretAccessKey,
      access_type: config.accessType,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
    }))

    return NextResponse.json(formattedConfigs)
  } catch (error) {
    console.error("Failed to fetch storage configurations:", error)
    return NextResponse.json({ error: "Failed to fetch storage configurations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const [newConfig] = await db
      .insert(uploadStorageConfigurations)
      .values({
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
      .returning()

    return NextResponse.json({
      id: newConfig.id,
      name: newConfig.name,
      description: newConfig.description,
      storage_type: newConfig.storageType,
      bucket_name: newConfig.bucketName,
      base_path: newConfig.basePath,
      path_template: newConfig.pathTemplate,
      region: newConfig.region,
      aws_access_key_id: newConfig.awsAccessKeyId,
      aws_secret_access_key: newConfig.awsSecretAccessKey,
      access_type: newConfig.accessType,
      created_at: newConfig.createdAt,
      updated_at: newConfig.updatedAt,
    })
  } catch (error) {
    console.error("Failed to create storage configuration:", error)
    return NextResponse.json({ error: "Failed to create storage configuration" }, { status: 500 })
  }
}
