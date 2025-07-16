import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { uploadOperations, uploadConfigurations, uploadStorageConfigurations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const configId = searchParams.get("config_id")
        const storageType = searchParams.get("storage_type")
        const limit = Number.parseInt(searchParams.get("limit") ?? "100")

        // Build query with joins to get configuration and storage details
        const query = db
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
                configName: uploadConfigurations.name,
                storageType: uploadStorageConfigurations.storageType,
                storageConfigId: uploadConfigurations.storageConfigId,
            })
            .from(uploadOperations)
            .leftJoin(uploadConfigurations, eq(uploadOperations.configId, uploadConfigurations.id))
            .leftJoin(uploadStorageConfigurations, eq(uploadConfigurations.storageConfigId, uploadStorageConfigurations.id))
            .limit(limit)
            .orderBy(uploadOperations.startedAt)

        const operations = await query

        // For demo purposes, we'll also include some mock Vercel Blob files
        // In a real implementation, you would fetch from all storage providers
        const mockFiles = [
            {
                id: 1,
                fileName: "sample-data.csv",
                filePath: "uploads/2024-01/sample-data.csv",
                fileSize: 1024 * 50, // 50KB
                status: "completed",
                errorCount: 0,
                startedAt: new Date(Date.now() - 86400000), // 1 day ago
                completedAt: new Date(Date.now() - 86400000 + 5000),
                configId: 2,
                configName: "Patient Data Import",
                storageType: "vercel_blob",
                storageConfigId: 2,
            },
            {
                id: 2,
                fileName: "transactions.xlsx",
                filePath: "uploads/2024-01/transactions.xlsx",
                fileSize: 1024 * 200, // 200KB
                status: "partially_completed",
                errorCount: 5,
                startedAt: new Date(Date.now() - 43200000), // 12 hours ago
                completedAt: new Date(Date.now() - 43200000 + 8000),
                configId: 3,
                configName: "Transaction Data Upload",
                storageType: "s3",
                storageConfigId: 1,
            },
        ]

        // Combine real operations with mock files
        const allFiles = [...operations, ...mockFiles]

        // Apply filters
        let filteredFiles = allFiles
        if (configId && configId !== "all") {
            filteredFiles = filteredFiles.filter((file: any) => file.configId === configId)
        }
        if (storageType && storageType !== "all") {
            filteredFiles = filteredFiles.filter((file: any) => file.storageType === storageType)
        }

        // Format the response
        const formattedFiles = filteredFiles.map((file) => ({
            id: file.id,
            name: file.fileName,
            url: generateFileUrl(file.filePath, file.storageType ?? "local"),
            size: file.fileSize,
            uploadedAt: file.completedAt || file.startedAt,
            status: file.status,
            errorCount: file.errorCount,
            storage_type: file.storageType,
            config_id: file.configId,
            config_name: file.configName,
            pathname: file.filePath,
        }))

        return NextResponse.json({
            files: formattedFiles,
            total: formattedFiles.length,
        })
    } catch (error) {
        console.error("Failed to fetch enhanced files:", error)
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
    }
}

function generateFileUrl(filePath: string, storageType: string): string {
    // Generate appropriate URLs based on storage type
    switch (storageType) {
        case "vercel_blob":
            return `https://blob.vercel-storage.com/${filePath}`
        case "s3":
            return `https://s3.amazonaws.com/bucket-name/${filePath}`
        case "gcs":
            return `https://storage.googleapis.com/bucket-name/${filePath}`
        case "azure_blob":
            return `https://storageaccount.blob.core.windows.net/container/${filePath}`
        default:
            return `/files/${filePath}`
    }
}
