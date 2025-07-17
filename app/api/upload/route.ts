import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import {
  uploadConfigurations,
  uploadConfigurationColumns,
  uploadStorageConfigurations,
  uploadOperations,
} from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { StorageService } from "@/lib/storage"
import type { UploadResponse, ValidationError } from "@/types/upload"
import {getCurrentUser} from "@/lib/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const configIdString = formData.get("config_id") as string
    const configId = configIdString ? parseInt(configIdString, 10) : null
    const user = await getCurrentUser();
    const userId = user?.id;

    if(isNaN(<number>configId)) {
        return NextResponse.json(
            {
            status: "failed",
            error: {
                code: "INVALID_CONFIG_ID",
                message: "Configuration ID must be a valid number",
            },
            } as UploadResponse,
            { status: 400 },
        )
    }

    if (!file || !configId) {
      return NextResponse.json(
        {
          status: "failed",
          error: {
            code: "MISSING_PARAMETERS",
            message: "File and configuration ID are required",
          },
        } as UploadResponse,
        { status: 400 },
      )
    }

    // Get configuration with storage config and columns
    const [config] = await db
      .select({
        id: uploadConfigurations.id,
        name: uploadConfigurations.name,
        fileType: uploadConfigurations.fileType,
        delimiter: uploadConfigurations.delimiter,
        maxFileSize: uploadConfigurations.maxFileSize,
        maxRows: uploadConfigurations.maxRows,
        allowPartialUpload: uploadConfigurations.allowPartialUpload,
        storageConfig: {
          id: uploadStorageConfigurations.id,
          storageType: uploadStorageConfigurations.storageType,
          basePath: uploadStorageConfigurations.basePath,
          pathTemplate: uploadStorageConfigurations.pathTemplate,
          accessType: uploadStorageConfigurations.accessType,
          bucketName: uploadStorageConfigurations.bucketName,
          region: uploadStorageConfigurations.region,
          awsAccessKeyId: uploadStorageConfigurations.awsAccessKeyId,
          awsSecretAccessKey: uploadStorageConfigurations.awsSecretAccessKey,
        },
      })
      .from(uploadConfigurations)
      .leftJoin(uploadStorageConfigurations, eq(uploadConfigurations.storageConfigId, uploadStorageConfigurations.id))
      .where(eq(uploadConfigurations.id, configId))

    if (!config) {
      return NextResponse.json(
        {
          status: "failed",
          error: {
            code: "INVALID_CONFIG",
            message: "Configuration not found",
          },
        } as UploadResponse,
        { status: 404 },
      )
    }

    const columns = await db
      .select()
      .from(uploadConfigurationColumns)
      .where(eq(uploadConfigurationColumns.configId, configId))

    // Validate file
    const validationErrors = await validateFile(file, config)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          status: "failed",
          error: {
            code: "VALIDATION_ERROR",
            message: "File validation failed",
            details: {
              file_level_errors: validationErrors,
            },
          },
        } as UploadResponse,
        { status: 400 },
      )
    }

    // Process file content
    const fileContent = await file.text()
    const { rowErrors, processedRows } = await processFileContent(fileContent, { ...config, columns })

    // Upload to storage using storage service
    const storageService = new StorageService({
      storage_type: config.storageConfig?.storageType as any,
      base_path: config.storageConfig?.basePath ?? "uploads",
      path_template: config.storageConfig?.pathTemplate ?? "{base_path}/{uuid}.{ext}",
      access_type: config.storageConfig?.accessType as any,
      aws_access_key_id: config.storageConfig?.awsAccessKeyId ?? "",
      aws_secret_access_key: config.storageConfig?.awsSecretAccessKey ?? "",
      bucket_name: config.storageConfig?.bucketName ?? "",
      region: config.storageConfig?.region ?? "us-east-1",
    })

    const uploadResult = await storageService.uploadFile(file, {
      organization_id: "MUUTAA", // This would come from the authenticated user
      user_id: userId, // This would come from the authenticated user
    })

    // Create operation record in database
    const [operation] = await db
      .insert(uploadOperations)
      .values({
        configId: configId,
        userId: userId,
        fileName: file.name,
        filePath: uploadResult.pathname,
        fileSize: file.size,
        rowCount: processedRows.length,
        status: rowErrors.length > 0 ? "partially_completed" : "completed",
        errorCount: rowErrors.length,
        validationErrors: rowErrors.length > 0 ? { errors: rowErrors } : null,
      })
      .returning()

    console.log(`File uploaded successfully: ${uploadResult.url}`)

    if (rowErrors.length > 0) {
      return NextResponse.json({
        status: "partially_completed",
        operation_id: operation.id,
        error: {
          code: "VALIDATION_ERRORS",
          message: `File processed with ${rowErrors.length} validation errors`,
          details: {
            row_level_errors: {
              total: rowErrors.length,
              samples: rowErrors.slice(0, 5),
            },
          },
        },
      } as unknown as UploadResponse)
    }

    return NextResponse.json({
      status: "success",
      operation_id: operation.id,
    } as unknown as UploadResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        status: "failed",
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      } as UploadResponse,
      { status: 500 },
    )
  }
}

async function validateFile(file: File, config: any): Promise<ValidationError[]> {
  const errors: ValidationError[] = []

  // Check file type
  const fileExtension = file.name.split(".").pop()?.toLowerCase()
  const allowedTypes = config.fileType.split(",").map((t: string) => t.trim())

  if (!allowedTypes.includes(fileExtension)) {
    errors.push({
      code: "INVALID_FILE_TYPE",
      message: `File type '${fileExtension}' not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    })
  }

  // Check file size
  if (file.size > config.maxFileSize) {
    errors.push({
      code: "FILE_TOO_LARGE",
      message: `File size exceeds maximum allowed size of ${config.maxFileSize} bytes`,
    })
  }

  return errors
}

async function processFileContent(content: string, config: any) {
  const lines = content.split("\n").filter((line) => line.trim())
  const headers = lines[0].split(config.delimiter).map((h: string) => h.trim())
  const dataRows = lines.slice(1)

  const rowErrors: ValidationError[] = []
  const processedRows: any[] = []

  // Validate headers
  const requiredColumns = config.columns.filter((col: any) => col.required)

  for (const requiredCol of requiredColumns) {
    if (!headers.includes(requiredCol.name)) {
      rowErrors.push({
        code: "MISSING_REQUIRED_COLUMN",
        message: `Required column '${requiredCol.displayName}' is missing`,
        column: requiredCol.name,
      })
    }
  }

  // Validate rows
  dataRows.forEach((row, index) => {
    const values = row.split(config.delimiter).map((v: string) => v.trim())
    const rowData: any = {}

    headers.forEach((header, colIndex) => {
      const value = values[colIndex] || ""
      const columnConfig = config.columns.find((col: any) => col.name === header)

      if (columnConfig) {
        const validationError = validateColumnValue(value, columnConfig, index + 2)
        if (validationError) {
          rowErrors.push(validationError)
        } else {
          rowData[header] = value
        }
      }
    })

    if (Object.keys(rowData).length > 0) {
      processedRows.push(rowData)
    }
  })

  return { rowErrors, processedRows }
}

function validateColumnValue(value: string, columnConfig: any, rowNumber: number): ValidationError | null {
  // Required check
  if (columnConfig.valuesRequired && !value) {
    return {
      code: "MISSING_REQUIRED_VALUE",
      message: `${columnConfig.displayName} is required`,
      column: columnConfig.name,
      row: rowNumber,
      value,
    }
  }

  if (!value) return null // Skip validation for empty optional fields

  // Data type validation
  switch (columnConfig.dataType) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return {
          code: "INVALID_EMAIL",
          message: `${columnConfig.displayName} must be a valid email address`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      break

    case "number": {
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue)) {
        return {
          code: "INVALID_NUMBER",
          message: `${columnConfig.displayName} must be a valid number`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      if (columnConfig.minValue !== undefined && numValue < Number.parseFloat(columnConfig.minValue)) {
        return {
          code: "VALUE_TOO_SMALL",
          message: `${columnConfig.displayName} must be at least ${columnConfig.minValue}`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      if (columnConfig.maxValue !== undefined && numValue > Number.parseFloat(columnConfig.maxValue)) {
        return {
          code: "VALUE_TOO_LARGE",
          message: `${columnConfig.displayName} must be at most ${columnConfig.maxValue}`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      break

    }
    case "string": {
      if (columnConfig.minLength && value.length < columnConfig.minLength) {
        return {
          code: "VALUE_TOO_SHORT",
          message: `${columnConfig.displayName} must be at least ${columnConfig.minLength} characters`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      if (columnConfig.maxLength && value.length > columnConfig.maxLength) {
        return {
          code: "VALUE_TOO_LONG",
          message: `${columnConfig.displayName} must be at most ${columnConfig.maxLength} characters`,
          column: columnConfig.name,
          row: rowNumber,
          value,
        }
      }
      if (columnConfig.pattern) {
        const regex = new RegExp(columnConfig.pattern)
        if (!regex.test(value)) {
          return {
            code: "PATTERN_MISMATCH",
            message: `${columnConfig.displayName} format is invalid`,
            column: columnConfig.name,
            row: rowNumber,
            value,
          }
        }
      }
      break
    }
  }

  return null
}
