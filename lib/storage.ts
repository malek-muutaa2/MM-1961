import {put, del, list} from "@vercel/blob"
import {S3StorageService} from "./storage/aws-s3"
import {GCSStorageService} from "./storage/gcs"
import {AzureBlobStorageService} from "./storage/azure-blob"

export interface StorageConfig {
    storage_type: "vercel_blob" | "s3" | "gcs" | "azure_blob"
    base_path: string
    path_template: string
    access_type?: "public" // | "private"
    bucket_name?: string
    container_name?: string
    region?: string
    // AWS S3 credentials
    aws_access_key_id?: string
    aws_secret_access_key?: string
    // GCS credentials
    gcs_project_id?: string
    gcs_key_filename?: string
    gcs_credentials?: any
    // Azure credentials
    azure_account_name?: string
    azure_account_key?: string
    azure_sas_token?: string
}

export interface UploadResult {
    url: string
    pathname: string
    size: number
    storage_type: string
}

export class StorageError extends Error {
    public code: string
    public provider: string
    public retryable: boolean

    constructor(message: string) {
        super(message);
        this.name = "StorageError";
        this.code = "";
        this.provider = "";
        this.retryable = false;
    }

}

export class StorageService {
    private readonly config: StorageConfig

    constructor(config: StorageConfig) {
        this.config = config
    }

    async uploadFile(file: File, metadata: Record<string, any> = {}): Promise<UploadResult> {
        const filePath = this.generateFilePath(file.name, metadata)

        try {
            switch (this.config.storage_type) {
                case "vercel_blob":
                    return await this.uploadToVercelBlob(file, filePath)
                case "s3":
                    return await this.uploadToS3(file, filePath)
                case "gcs":
                    return await this.uploadToGCS(file, filePath)
                case "azure_blob":
                    return await this.uploadToAzureBlob(file, filePath)
                default:
                    throw this.createStorageError(
                        `Unsupported storage type: ${this.config.storage_type}`,
                        "UNSUPPORTED_STORAGE_TYPE",
                        false,
                    )
            }
        } catch (error: any) {
            if (error instanceof StorageError) {
                throw error
            }
            throw this.createStorageError(`Upload failed: ${error.message}`, "UPLOAD_FAILED", this.isRetryableError(error))
        }
    }

    private async uploadToVercelBlob(file: File, filePath: string): Promise<UploadResult> {
        try {
            const blob = await put(filePath, file, {
                access: this.config.access_type || "public",
                addRandomSuffix: true,
                contentType: file.type,
                cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year cache
            })

            return {
                url: blob.url,
                pathname: blob.pathname,
                size: file.size,
                storage_type: "vercel_blob",
            }
        } catch (error: any) {
            throw this.createStorageError(`Vercel Blob upload failed: ${error.message}`, "VERCEL_BLOB_ERROR", true)
        }
    }

    private async uploadToS3(file: File, filePath: string): Promise<UploadResult> {
        if (!this.config.aws_access_key_id || !this.config.aws_secret_access_key) {
            throw this.createStorageError("AWS credentials not configured", "MISSING_CREDENTIALS", false)
        }

        const s3Service = new S3StorageService({
            accessKeyId: this.config.aws_access_key_id,
            secretAccessKey: this.config.aws_secret_access_key,
            region: this.config.region || "us-east-1",
            bucketName: this.config.bucket_name!,
        })

        try {
            const result = await s3Service.uploadFile(file, filePath)
            return {
                ...result,
                storage_type: "s3",
            }
        } catch (error: any) {
            throw this.createStorageError(error.message, "S3_ERROR", error.message.includes("timeout"))
        }
    }

    private async uploadToGCS(file: File, filePath: string): Promise<UploadResult> {
        if (!this.config.gcs_project_id) {
            throw this.createStorageError("GCS project ID not configured", "MISSING_CREDENTIALS", false)
        }

        const gcsService = new GCSStorageService({
            projectId: this.config.gcs_project_id,
            keyFilename: this.config.gcs_key_filename,
            credentials: this.config.gcs_credentials,
            bucketName: this.config.bucket_name!,
        })

        try {
            const result = await gcsService.uploadFile(file, filePath)
            return {
                ...result,
                storage_type: "gcs",
            }
        } catch (error: any) {
            throw this.createStorageError(error.message, "GCS_ERROR", error.message.includes("timeout"))
        }
    }

    private async uploadToAzureBlob(file: File, filePath: string): Promise<UploadResult> {
        if (!this.config.azure_account_name || !this.config.azure_account_key) {
            throw this.createStorageError("Azure credentials not configured", "MISSING_CREDENTIALS", false)
        }

        const azureService = new AzureBlobStorageService({
            accountName: this.config.azure_account_name,
            accountKey: this.config.azure_account_key,
            containerName: this.config.container_name || this.config.bucket_name!,
            sasToken: this.config.azure_sas_token,
        })

        try {
            const result = await azureService.uploadFile(file, filePath)
            return {
                ...result,
                storage_type: "azure_blob",
            }
        } catch (error: any) {
            throw this.createStorageError(error.message, "AZURE_ERROR", error.message.includes("timeout"))
        }
    }

    async deleteFile(pathname: string): Promise<void> {
        try {
            switch (this.config.storage_type) {
                case "vercel_blob":
                    await del(pathname)
                    break
                case "s3":
                    const s3Service = new S3StorageService({
                        accessKeyId: this.config.aws_access_key_id!,
                        secretAccessKey: this.config.aws_secret_access_key!,
                        region: this.config.region || "us-east-1",
                        bucketName: this.config.bucket_name!,
                    })
                    await s3Service.deleteFile(pathname)
                    break
                case "gcs":
                    const gcsService = new GCSStorageService({
                        projectId: this.config.gcs_project_id!,
                        keyFilename: this.config.gcs_key_filename,
                        credentials: this.config.gcs_credentials,
                        bucketName: this.config.bucket_name!,
                    })
                    await gcsService.deleteFile(pathname)
                    break
                case "azure_blob":
                    const azureService = new AzureBlobStorageService({
                        accountName: this.config.azure_account_name!,
                        accountKey: this.config.azure_account_key!,
                        containerName: this.config.container_name || this.config.bucket_name!,
                        sasToken: this.config.azure_sas_token,
                    })
                    await azureService.deleteFile(pathname)
                    break
                default:
                    throw this.createStorageError(
                        `Delete not implemented for storage type: ${this.config.storage_type}`,
                        "UNSUPPORTED_OPERATION",
                        false,
                    )
            }
        } catch (error: any) {
            if (error instanceof StorageError) {
                throw error
            }
            throw this.createStorageError(`Delete failed: ${error.message}`, "DELETE_FAILED", this.isRetryableError(error))
        }
    }

    async listFiles(prefix?: string): Promise<any[]> {
        try {
            switch (this.config.storage_type) {
                case "vercel_blob":
                    const result = await list({prefix})
                    return result.blobs.map((blob) => ({
                        ...blob,
                        storage_type: "vercel_blob",
                    }))
                case "s3":
                    const s3Service = new S3StorageService({
                        accessKeyId: this.config.aws_access_key_id!,
                        secretAccessKey: this.config.aws_secret_access_key!,
                        region: this.config.region || "us-east-1",
                        bucketName: this.config.bucket_name!,
                    })
                    const s3Files = await s3Service.listFiles(prefix)
                    return s3Files.map((file) => ({...file, storage_type: "s3"}))
                case "gcs":
                    const gcsService = new GCSStorageService({
                        projectId: this.config.gcs_project_id!,
                        keyFilename: this.config.gcs_key_filename,
                        credentials: this.config.gcs_credentials,
                        bucketName: this.config.bucket_name!,
                    })
                    const gcsFiles = await gcsService.listFiles(prefix)
                    return gcsFiles.map((file) => ({...file, storage_type: "gcs"}))
                case "azure_blob":
                    const azureService = new AzureBlobStorageService({
                        accountName: this.config.azure_account_name!,
                        accountKey: this.config.azure_account_key!,
                        containerName: this.config.container_name || this.config.bucket_name!,
                        sasToken: this.config.azure_sas_token,
                    })
                    const azureFiles = await azureService.listFiles(prefix)
                    return azureFiles.map((file) => ({...file, storage_type: "azure_blob"}))
                default:
                    throw this.createStorageError(
                        `List not implemented for storage type: ${this.config.storage_type}`,
                        "UNSUPPORTED_OPERATION",
                        false,
                    )
            }
        } catch (error: any) {
            if (error instanceof StorageError) {
                throw error
            }
            throw this.createStorageError(`List failed: ${error.message}`, "LIST_FAILED", this.isRetryableError(error))
        }
    }

    private generateFilePath(fileName: string, metadata: Record<string, any>): string {
        const now = new Date()
        const fileExtension = fileName?.split(".")?.pop()
        const fileNameWithoutExt = fileName?.substring(0, fileName.lastIndexOf(".")) || "file_" + now.getFullYear() + "_" +  now.getMonth() + "_" + now.getDate() + "_" + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds()

        let path = this.config.path_template || "{base_path}/{uuid}.{ext}"

        // Replace placeholders
        const replacements: Record<string, string> = {
            base_path: this.config.base_path,
            organization_id: "default",
            user_id: metadata.user_id,
            year: now.getFullYear().toString(),
            month: (now.getMonth() + 1).toString().padStart(2, "0"),
            day: now.getDate().toString().padStart(2, "0"),
            hour: now.getHours().toString().padStart(2, "0"),
            minute: now.getMinutes().toString().padStart(2, "0"),
            second: now.getSeconds().toString().padStart(2, "0"),
            uuid: crypto?.randomUUID?.() || Math.random().toString(36).substring(2, 15) + "_" + metadata.user_id,
            timestamp: now.getTime().toString(),
            file_name: fileNameWithoutExt,
            ext: fileExtension ?? "bin",
        }

        for (const [key, value] of Object.entries(replacements)) {
            path = path.replace(new RegExp(`{${key}}`, "g"), value)
        }

        return path
    }

    createStorageError(message: string, code: string, retryable: boolean): StorageError {
        const error = new StorageError(message)
        error.code = code
        error.provider = this.config.storage_type
        error.retryable = retryable
        return error
    }

    private isRetryableError(error: any): boolean {
        const retryableMessages = ["timeout", "network", "connection", "temporary", "rate limit", "throttle"]

        const errorMessage = error.message?.toLowerCase() ?? ""
        return retryableMessages.some((msg) => errorMessage.includes(msg))
    }
}
