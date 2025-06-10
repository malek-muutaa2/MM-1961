import { S3Client, PutObjectCommand, PutObjectRequest } from "@aws-sdk/client-s3";
// AWS S3 Storage Service Implementation
export interface S3Config {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucketName: string
}

export class S3StorageService {
  private config: S3Config

  constructor(config: S3Config) {
    this.config = config
  }

  async uploadFileSimulate(file: File, filePath: string): Promise<{ url: string; pathname: string; size: number }> {
    try {
      // In a real implementation, you would use the AWS SDK
      // For this demo, we'll simulate the upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("key", filePath)
      formData.append("bucket", this.config.bucketName)

      if(!file || !filePath) {
        throw new Error("File or file path is missing")
      }

      // Simulate AWS S3 upload with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        // This would be replaced with actual AWS SDK call
        const response = await fetch("/api/storage/s3/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`S3 upload failed: ${response.statusText}`)
        }

        const result = await response.json()

        return {
          url: `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${filePath}`,
          pathname: filePath,
          size: file.size,
        }
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === "AbortError") {
          throw new Error("S3 upload timeout - please try again")
        }
        throw error
      }
    } catch (error: any) {
      console.error("S3 upload error : ", error)
      throw new Error(`S3 upload failed : ${error.message}`)
    }
  }
  async uploadFile(file: File, filePath: string): Promise<{ url: string; pathname: string; size: number }> {
    try {
      // In a real implementation, you would use the AWS SDK
      // For this demo, we'll simulate the upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("key", filePath)
      formData.append("bucket", this.config.bucketName)

      if(!file || !filePath) {
        throw new Error("File or file path is missing")
      }
      console.log("Uploading file to S3 with path:", filePath);
      // console.log("config details : ", this.config)
      const s3Client = new S3Client({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });


      // Convert the file to a buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const uploadParams: any = {
        Bucket: this.config.bucketName,
        Key: filePath,
        Body: fileBuffer,
        ContentType: file.type || "application/octet-stream",

      };
      // console.log("Uploading file to S3:", uploadParams);

      // Simulate AWS S3 upload with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 3 second timeout

      try {
        // Upload the file to S3
        console.log("Sending PutObjectCommand to S3...");
        await s3Client.send(new PutObjectCommand(uploadParams), {
          abortSignal: controller.signal
        });

        clearTimeout(timeoutId)

        const publicUrl = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${filePath}`;

        // If you need a pre-signed URL instead (for private buckets):
        // const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
        //   Bucket: this.config.bucketName,
        //   Key: filePath,
        // }), { expiresIn: 3600 });

        return {
          url: publicUrl,
          pathname: filePath,
          size: file.size,
        };
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === "AbortError") {
          throw new Error("S3 upload timeout - please try again")
        }
        throw error
      }
    } catch (error: any) {
      console.error("S3 upload error : ", error)
      throw new Error(`S3 upload failed : ${error.message}`)
    }
  }


  async deleteFile(pathname: string): Promise<void> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch("/api/storage/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: pathname,
          bucket: this.config.bucketName,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`S3 delete failed: ${response.statusText}`)
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("S3 delete timeout - please try again")
      }
      throw new Error(`S3 delete failed: ${error.message}`)
    }
  }

  async listFiles(prefix?: string): Promise<any[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(`/api/storage/s3/list?prefix=${prefix || ""}&bucket=${this.config.bucketName}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`S3 list failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result.files || []
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("S3 list timeout - please try again")
      }
      throw new Error(`S3 list failed: ${error.message}`)
    }
  }
}
