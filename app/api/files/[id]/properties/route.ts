import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadOperations, uploadConfigurations, uploadStorageConfigurations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        // Get file operation with configuration and storage details
        const [operation] = await db
            .select({
                id: uploadOperations.id,
                fileName: uploadOperations.fileName,
                filePath: uploadOperations.filePath,
                fileSize: uploadOperations.fileSize,
                status: uploadOperations.status,
                errorCount: uploadOperations.errorCount,
                startedAt: uploadOperations.startedAt,
                completedAt: uploadOperations.completedAt,
                configId: uploadOperations.configId,
                config: {
                    id: uploadConfigurations.id,
                    name: uploadConfigurations.name,
                    description: uploadConfigurations.description,
                    organizationType: uploadConfigurations.organizationType,
                    sourceType: uploadConfigurations.sourceType,
                    fileType: uploadConfigurations.fileType,
                    delimiter: uploadConfigurations.delimiter,
                    maxFileSize: uploadConfigurations.maxFileSize,
                    maxRows: uploadConfigurations.maxRows,
                },
                storageConfig: {
                    id: uploadStorageConfigurations.id,
                    name: uploadStorageConfigurations.name,
                    description: uploadStorageConfigurations.description,
                    storageType: uploadStorageConfigurations.storageType,
                    bucketName: uploadStorageConfigurations.bucketName,
                    basePath: uploadStorageConfigurations.basePath,
                    pathTemplate: uploadStorageConfigurations.pathTemplate,
                    region: uploadStorageConfigurations.region,
                    accessType: uploadStorageConfigurations.accessType,
                },
            })
            .from(uploadOperations)
            .leftJoin(uploadConfigurations, eq(uploadOperations.configId, uploadConfigurations.id))
            .leftJoin(uploadStorageConfigurations, eq(uploadConfigurations.storageConfigId, uploadStorageConfigurations.id))
            .where(eq(uploadOperations.id, params.id))

        if (!operation) {
            return NextResponse.json({ error: "File not found" }, { status: 404 })
        }

        return NextResponse.json({
            file: {
                id: operation.id,
                name: operation.fileName,
                path: operation.filePath,
                size: operation.fileSize,
                status: operation.status,
                error_count: operation.errorCount,
                uploaded_at: operation.startedAt,
                completed_at: operation.completedAt,
            },
            configuration: operation.config,
            storage_config: operation.storageConfig,
        })
    } catch (error) {
        console.error("Failed to fetch file properties:", error)
        return NextResponse.json({ error: "Failed to fetch file properties" }, { status: 500 })
    }
}
