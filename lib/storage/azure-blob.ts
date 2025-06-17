// Azure Blob Storage Service Implementation
export interface AzureBlobConfig {
  accountName: string
  accountKey: string
  containerName: string
  sasToken?: string
}

export class AzureBlobStorageService {
  private readonly config: AzureBlobConfig

  constructor(config: AzureBlobConfig) {
    this.config = config
  }

  async uploadFile(file: File, filePath: string): Promise<{ url: string; pathname: string; size: number }> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("blobName", filePath)
      formData.append("containerName", this.config.containerName)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        const response = await fetch("/api/storage/azure/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Azure Blob upload failed: ${response.statusText}`)
        }

        const result = await response.json()
        return {
          url: `https://${this.config.accountName}.blob.core.windows.net/${this.config.containerName}/${filePath}`,
          pathname: filePath,
          size: file.size,
        }
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === "AbortError") {
          throw new Error("Azure Blob upload timeout - please try again")
        }
        throw error
      }
    } catch (error: any) {
      console.error("Azure Blob upload error:", error)
      throw new Error(`Azure Blob upload failed: ${error.message}`)
    }
  }

  async deleteFile(pathname: string): Promise<void> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch("/api/storage/azure/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blobName: pathname,
          containerName: this.config.containerName,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Azure Blob delete failed: ${response.statusText}`)
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Azure Blob delete timeout - please try again")
      }
      throw new Error(`Azure Blob delete failed: ${error.message}`)
    }
  }

  async listFiles(prefix?: string): Promise<any[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(
        `/api/storage/azure/list?prefix=${prefix || ""}&container=${this.config.containerName}`,
        {
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Azure Blob list failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result.files || []
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Azure Blob list timeout - please try again")
      }
      throw new Error(`Azure Blob list failed: ${error.message}`)
    }
  }
}
