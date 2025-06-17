import { StorageService } from "@/lib/storage"

// Mock the storage implementations
jest.mock("../../lib/storage/aws-s3")
jest.mock("@vercel/blob")

describe("StorageService", () => {
  const mockS3Config = {
    storage_type: "s3" as const,
    base_path: "test-uploads",
    path_template: "{base_path}/{uuid}.{ext}",
    bucket_name: "test-bucket",
    region: "us-east-1",
    aws_access_key_id: "test-key",
    aws_secret_access_key: "test-secret",
  }

  const mockFile = new File(["test content"], "test.csv", { type: "text/csv" })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("S3 Storage", () => {
    it("should upload file to S3 successfully", async () => {
      const storageService = new StorageService(mockS3Config)

      // Mock S3 service
      const mockS3Upload = jest.fn().mockResolvedValue({
        url: "https://test-bucket.s3.us-east-1.amazonaws.com/test-uploads/file.csv",
        pathname: "test-uploads/file.csv",
        size: 1024,
        storage_type: 's3',
      })

      jest.doMock("../../lib/storage/aws-s3", () => ({
        S3StorageService: jest.fn().mockImplementation(() => ({
          uploadFile: mockS3Upload,
        })),
      }))

      const result = await storageService.uploadFile(mockFile)
      console.log("Mock S3 upload result: donneee ", storageService)

      // expect(result).toHaveProperty("url")
      // expect(result).toHaveProperty("pathname")
      // expect(result).toHaveProperty("size")
      expect(result).toHaveProperty("storage_type")
      expect(result.storage_type).toBe("s3")
    })

    console.log("Mock S3 upload result: donneee ", mockFile)

    it("should handle S3 upload errors", async () => {
      const storageService = new StorageService(mockS3Config)

      const mockS3Upload = jest.fn().mockRejectedValue(new Error("S3 upload failed"))

      jest.doMock("../../lib/storage/aws-s3", () => ({
        S3StorageService: jest.fn().mockImplementation(() => ({
          uploadFile: mockS3Upload,
        })),
      }))

      // await expect(storageService.uploadFile(mockFile)).rejects.toThrow("Upload failed")
        await expect(storageService.uploadFile(mockFile)).rejects.toThrow(storageService.createStorageError("S3 upload failed", "UPLOAD_FAILED", true))
    })

    it("should handle missing credentials", async () => {
      const invalidConfig = {
        ...mockS3Config,
        aws_access_key_id: undefined,
        aws_secret_access_key: undefined,
      }

      const storageService = new StorageService(invalidConfig)

      await expect(storageService.uploadFile(mockFile)).rejects.toThrow(storageService.createStorageError("AWS credentials not configured", "MISSING_CREDENTIALS", false))
    })
  })

  describe("File Path Generation", () => {
    it("should generate file path with template variables", () => {
      const storageService = new StorageService(mockS3Config)
      const metadata = {
        organization_id: "org-123",
        user_id: "user-456",
      }

      // Access private method for testing
      const generateFilePath = (storageService as any).generateFilePath.bind(storageService)
      const filePath = generateFilePath("test.csv", metadata)

      expect(filePath).toContain("test-uploads")
      expect(filePath).toContain(".csv")
    })
  })

  describe("Error Handling", () => {
    it("should create storage errors with proper metadata", () => {
      const storageService = new StorageService(mockS3Config)

      // Access private method for testing
      const createStorageError = (storageService as any).createStorageError.bind(storageService)
      const error = createStorageError("Test error", "TEST_CODE", true)

      expect(error.message).toBe("Test error")
      expect(error.code).toBe("TEST_CODE")
      expect(error.provider).toBe("s3")
      expect(error.retryable).toBe(true)
    })

    it("should identify retryable errors", () => {
      const storageService = new StorageService(mockS3Config)

      // Access private method for testing
      const isRetryableError = (storageService as any).isRetryableError.bind(storageService)

      expect(isRetryableError({ message: "timeout error" })).toBe(true)
      expect(isRetryableError({ message: "network error" })).toBe(true)
      expect(isRetryableError({ message: "invalid credentials" })).toBe(false)
    })
  })
})
