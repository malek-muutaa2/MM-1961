import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadOperations, uploadConfigurations, uploadStorageConfigurations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { StorageService } from "@/lib/storage"

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    try {

        const { id } = params; // No need to await here in API routes

        // Get file operation with storage configuration
        const [operation] = await db
            .select({
                id: uploadOperations.id,
                filePath: uploadOperations.filePath,
                storageConfig: {
                    storageType: uploadStorageConfigurations.storageType,
                    bucketName: uploadStorageConfigurations.bucketName,
                    basePath: uploadStorageConfigurations.basePath,
                    pathTemplate: uploadStorageConfigurations.pathTemplate,
                    region: uploadStorageConfigurations.region,
                    accessType: uploadStorageConfigurations.accessType,
                    awsAccessKeyId: uploadStorageConfigurations.awsAccessKeyId,
                    awsSecretAccessKey: uploadStorageConfigurations.awsSecretAccessKey,
                    azureAccountName: uploadStorageConfigurations.azureAccountName,
                    azureAccountKey: uploadStorageConfigurations.azureAccountKey,
                    gcsProjectId: uploadStorageConfigurations.gcsProjectId,
                },
            })
            .from(uploadOperations)
            .leftJoin(uploadConfigurations, eq(uploadOperations.configId, uploadConfigurations.id))
            .leftJoin(uploadStorageConfigurations, eq(uploadConfigurations.storageConfigId, uploadStorageConfigurations.id))
            .where(eq(uploadOperations.id, id))

        if (!operation) {
            return NextResponse.json({ error: "File not found" }, { status: 404 })
        }else if (!operation.storageConfig) {
            return NextResponse.json({ error: "Storage configuration not found for this file" }, { status: 404 })
        }

        // Create storage service and delete file
        const storageService = new StorageService({
            storage_type: operation.storageConfig.storageType as any,
            base_path: operation.storageConfig.basePath,
            path_template: operation.storageConfig.pathTemplate,
            bucket_name: operation.storageConfig.bucketName || "",
            region: operation.storageConfig.region || "",
            access_type: operation.storageConfig.accessType as any,
            aws_access_key_id: operation.storageConfig.awsAccessKeyId || "",
            aws_secret_access_key: operation.storageConfig.awsSecretAccessKey || "",
            azure_account_name: operation.storageConfig.azureAccountName || "",
            azure_account_key: operation.storageConfig.azureAccountKey || "",
            gcs_project_id: operation.storageConfig.gcsProjectId || "",
        })

        try {
            await storageService.deleteFile(operation.filePath)
        } catch (storageError) {
            console.error("Storage deletion failed:", storageError)
            // Continue with database deletion even if storage deletion fails
            // This prevents orphaned database records
        }

        // Delete from database
        // await db.delete(uploadOperations).where(eq(uploadOperations.id, id))
        // update deleted_At to mark as deleted
        await db
            .update(uploadOperations).set({ deletedAt: new Date() })
            .where(eq(uploadOperations.id, id))

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Failed to delete file:", error)
        return NextResponse.json(
            {
                error: "Failed to delete file",
                details: error.message,
            },
            { status: 500 },
        )
    }
}
