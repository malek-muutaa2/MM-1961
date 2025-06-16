import { POST } from "@/app/api/upload/enhanced/route"
import type { NextRequest } from "next/server"

// Mock dependencies
jest.mock("@/lib/db/dbpostgres")
jest.mock("@/lib/storage")
jest.mock("@/lib/validation-service")

describe("Enhanced Upload API", () => {
  const mockFormData = new FormData()
  const mockFile = new File(["test,content\nvalue1,value2"], "test.csv", { type: "text/csv" })
  mockFormData.append("file", mockFile)
  mockFormData.append("config_id", "1")

  const mockRequest = {
    formData: jest.fn().mockResolvedValue(mockFormData),
  } as unknown as NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should handle successful upload with no validation errors", async () => {
    // Mock database responses
    const mockConfig = {
      id: 1,
      name: "Test Config",
      fileType: "csv",
      delimiter: ",",
      maxFileSize: 1024 * 1024,
      allowPartialUpload: false,
      storageConfig: {
        storageType: "s3",
        basePath: "uploads",
        pathTemplate: "{base_path}/{uuid}.{ext}",
        bucketName: "test-bucket",
        region: "us-east-1",
        awsAccessKeyId: "test-key",
        awsSecretAccessKey: "test-secret",
      },
    }

    const mockColumns = [
      {
        configId: 1,
        name: "test",
        displayName: "Test Column",
        dataType: "string",
        required: true,
        position: 0,
      },
    ]

    // Mock validation service
    const mockValidationResult = {
      isValid: true,
      errors: [],
      processedRows: [{ test: "value1" }],
      totalRows: 1,
      validRows: 1,
    }

    // Mock storage service
    const mockUploadResult = {
      url: "https://test-bucket.s3.amazonaws.com/uploads/file.csv",
      pathname: "uploads/file.csv",
      size: 1024,
      storage_type: "s3",
    }

    jest.doMock("../lib/db", () => ({
      db: {
        select: jest.fn().mockReturnValue({
          from: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockResolvedValue([mockConfig]),
            }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ id: "operation-id" }]),
          }),
        }),
      },
    }))

    jest.doMock("../../lib/validation-service", () => ({
      ValidationService: jest.fn().mockImplementation(() => ({
        validateFile: jest.fn().mockResolvedValue(mockValidationResult),
      })),
    }))

    jest.doMock("../../lib/storage", () => ({
      StorageService: jest.fn().mockImplementation(() => ({
        uploadFile: jest.fn().mockResolvedValue(mockUploadResult),
      })),
    }))

    const response = await POST(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.status).toBe("success")
    expect(result.operation_id).toBe("operation-id")
    expect(result.processed_rows).toBe(1)
    expect(result.total_rows).toBe(1)
  })

  it("should handle validation errors with partial upload allowed", async () => {
    const mockValidationResult = {
      isValid: true,
      errors: [
        {
          code: "MISSING_REQUIRED_VALUE",
          message: "Test field is required",
          column: "test",
          row: 2,
          line: 3,
        },
      ],
      processedRows: [{ test: "value1" }],
      totalRows: 2,
      validRows: 1,
    }

    jest.doMock("@/lib/validation-service", () => ({
      ValidationService: jest.fn().mockImplementation(() => ({
        validateFile: jest.fn().mockResolvedValue(mockValidationResult),
      })),
    }))

    const response = await POST(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.status).toBe("partially_completed")
    expect(result.error.details.row_level_errors.total).toBe(1)
    expect(result.error.details.row_level_errors.all_errors).toHaveLength(1)
  })

  it("should reject upload when validation fails and partial upload is disabled", async () => {
    const mockValidationResult = {
      isValid: false,
      errors: [
        {
          code: "MISSING_REQUIRED_COLUMN",
          message: "Required column missing",
          line: 1,
        },
      ],
      processedRows: [],
      totalRows: 1,
      validRows: 0,
    }

    jest.doMock("@/lib/validation-service", () => ({
      ValidationService: jest.fn().mockImplementation(() => ({
        validateFile: jest.fn().mockResolvedValue(mockValidationResult),
      })),
    }))

    const response = await POST(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.status).toBe("failed")
    expect(result.error.code).toBe("VALIDATION_FAILED")
  })

  it("should handle missing parameters", async () => {
    const invalidFormData = new FormData()
    const invalidRequest = {
      formData: jest.fn().mockResolvedValue(invalidFormData),
    } as unknown as NextRequest

    const response = await POST(invalidRequest)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.status).toBe("failed")
    expect(result.error.code).toBe("MISSING_PARAMETERS")
  })

  it("should handle storage errors", async () => {
    const mockValidationResult = {
      isValid: true,
      errors: [],
      processedRows: [{ test: "value1" }],
      totalRows: 1,
      validRows: 1,
    }

    jest.doMock("@/lib/storage", () => ({
      StorageService: jest.fn().mockImplementation(() => ({
        uploadFile: jest.fn().mockRejectedValue(new Error("Storage failed")),
      })),
    }))

    const response = await POST(mockRequest)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.status).toBe("failed")
    expect(result.error.code).toBe("STORAGE_ERROR")
  })
})
