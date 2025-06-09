import { put, del, list } from "@vercel/blob"

export interface StorageConfig {
  storage_type: "vercel_blob" | "s3" | "local" | "azure_blob"
  base_path: string
  path_template: string
  access_type: "public" | undefined
  bucket_name?: string | null
  region?: string | null
}

export interface UploadResult {
  url: string
  pathname: string
  size: number
}

export class StorageService {
  private config: StorageConfig

  constructor(config: StorageConfig) {
    this.config = config
  }

  async uploadFile(file: File, metadata: Record<string, any> = {}): Promise<UploadResult> {
    const filePath = this.generateFilePath(file.name, metadata)

    switch (this.config.storage_type) {
      case "vercel_blob":
        return this.uploadToVercelBlob(file, filePath)
      case "s3":
        throw new Error("S3 storage not implemented in this version")
      default:
        throw new Error(`Unsupported storage type: ${this.config.storage_type}`)
    }
  }

  private async uploadToVercelBlob(file: File, filePath: string): Promise<UploadResult> {
    try {
      const blob = await put(filePath, file, {
        access: this.config.access_type ?? "public",
        addRandomSuffix: true,
        contentType: file.type,
        cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year cache
      })

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
      }
    } catch (error: any) {
      console.error("Vercel Blob upload failed:", error)
      throw new Error(`Failed to upload file to Vercel Blob: ${error?.message}`)
    }
  }

  private generateFilePath(fileName: string, metadata: Record<string, any>): string {
    const now = new Date()
    const fileExtension = fileName?.split(".")?.pop()

    let path = this.config.path_template || "{base_path}/{uuid}.{ext}"

    // Replace placeholders
    const replacements: Record<string, string> = {
      base_path: this.config.base_path,
      organization_id: metadata?.organization_id ?? "default",
      user_id: metadata?.user_id ?? "anonymous",
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString().padStart(2, "0"),
      day: now.getDate().toString().padStart(2, "0"),
      hour: now.getHours().toString().padStart(2, "0"),
      minute: now.getMinutes().toString().padStart(2, "0"),
      second: now.getSeconds().toString().padStart(2, "0"),
      uuid: crypto.randomUUID(),
      timestamp: now.getTime().toString(),
      ext: fileExtension ?? "bin",
    }

    for (const [key, value] of Object.entries(replacements)) {
      path = path.replace(new RegExp(`{${key}}`, "g"), value)
    }

    return path
  }

  async deleteFile(pathname: string): Promise<void> {
    switch (this.config.storage_type) {
      case "vercel_blob":
        await del(pathname)
        break
      default:
        throw new Error(`Delete not implemented for storage type: ${this.config.storage_type}`)
    }
  }

  async listFiles(prefix?: string): Promise<any[]> {
    switch (this.config.storage_type) {
      case "vercel_blob":
        const result = await list({ prefix })
        return result.blobs
      default:
        throw new Error(`List not implemented for storage type: ${this.config.storage_type}`)
    }
  }

  async getFileInfo(pathname: string): Promise<any> {
    switch (this.config.storage_type) {
      case "vercel_blob":
        const { head } = await import("@vercel/blob")
        return await head(pathname)
      default:
        throw new Error(`Get file info not implemented for storage type: ${this.config.storage_type}`)
    }
  }
}
