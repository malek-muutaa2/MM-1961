// Google Cloud Storage Service Implementation
export interface GCSConfig {
  projectId: string
  keyFilename?: string
  credentials?: any
  bucketName: string
}

export class GCSStorageService {
  private readonly config: GCSConfig

  constructor(config: GCSConfig) {
    this.config = config
  }

  async uploadFile(file: File, filePath: string): Promise<{ url: string; pathname: string; size: number }> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", filePath)
      formData.append("bucketName", this.config.bucketName)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        const response = await fetch("/api/storage/gcs/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`GCS upload failed: ${response.statusText}`)
        }

        return {
          url: `https://storage.googleapis.com/${this.config.bucketName}/${filePath}`,
          pathname: filePath,
          size: file.size,
        }
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === "AbortError") {
          throw new Error("GCS upload timeout - please try again")
        }
        throw error
      }
    } catch (error :any) {
      console.error("GCS upload error:", error)
      throw new Error(`GCS upload failed: ${error.message}`)
    }
  }

  async deleteFile(pathname: string): Promise<void> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch("/api/storage/gcs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: pathname,
          bucketName: this.config.bucketName,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`GCS delete failed: ${response.statusText}`)
      }
    } catch (error :any) {
      if (error.name === "AbortError") {
        throw new Error("GCS delete timeout - please try again")
      }
      throw new Error(`GCS delete failed: ${error.message}`)
    }
  }

  async listFiles(prefix?: string): Promise<any[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(`/api/storage/gcs/list?prefix=${prefix || ""}&bucket=${this.config.bucketName}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`GCS list failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result.files || []
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("GCS list timeout - please try again")
      }
      throw new Error(`GCS list failed: ${error.message}`)
    }
  }
}
