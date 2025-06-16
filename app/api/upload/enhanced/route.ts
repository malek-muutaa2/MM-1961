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
import { ValidationService } from "@/lib/validation-service"
import type { UploadResponse } from "@/types/upload"
import {getCurrentUser} from "@/lib/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const configId = formData.get("config_id") as unknown as number;
    const user = await getCurrentUser();
    const userId = user?.id;

      if(!userId) {
        return NextResponse.json(
            {
              status: "failed",
              error: {
                code: "UNAUTHORIZED",
                message: "User not authenticated",
              },
            } as UploadResponse,
            { status: 401 },
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
        .orderBy(uploadConfigurationColumns.position)

    // Enhanced validation using ValidationService
    const validationService = new ValidationService(
        { ...config, allow_partial_upload: config.allowPartialUpload },
        columns.map((col) => ({
          ...col,
          config_id: col.configId,
          display_name: col.displayName,
          data_type: col.dataType,
          min_length: col.minLength,
          max_length: col.maxLength,
          min_value: col.minValue ? Number.parseFloat(col.minValue) : undefined,
          max_value: col.maxValue ? Number.parseFloat(col.maxValue) : undefined,
          custom_validator: col.customValidator,
        })),
    )

    const validationResult = await validationService.validateFile(file)

    // If validation fails and partial upload is not allowed, return error
    if (!validationResult.isValid && !config.allowPartialUpload) {
      //   save upload_operation_errors with validation errors on db
        await db
            .insert(uploadOperations)
            .values({
                configId: configId,
                userId: userId, // This would come from the authenticated user
                fileName: file.name,
                filePath: "",
                fileSize: file.size,
                rowCount: validationResult.totalRows,
                status: "failed",
                errorCount: validationResult.errors.length,
                validationErrors: {
                errors: validationResult.errors,
                valid_rows: validationResult.validRows,
                total_rows: validationResult.totalRows,
                },
            })
            .returning()

      return NextResponse.json(
          {
            status: "failed",
            total_rows: validationResult.totalRows,
            processed_rows: 0,
            error: {
              code: "VALIDATION_FAILED",
              message: `File validation failed with ${validationResult.errors.length} errors`,
              details: {
                file_level_errors: validationResult.errors.filter((e) => !e.row),
                row_level_errors: {
                  total: validationResult.errors.filter((e) => e.row).length,
                  samples: validationResult.errors.filter((e) => e.row).slice(0, 10),
                  all_errors: validationResult.errors,
                },
              },
            },
          } as UploadResponse,
          { status: 400 },
      )
    }

    // Upload to storage using storage service (only S3 for now)
    const storageService = new StorageService({
      storage_type: config.storageConfig?.storageType as any,
      base_path: config.storageConfig?.basePath || "uploads",
      path_template: config.storageConfig?.pathTemplate || "{base_path}/{uuid}.{ext}",
      access_type: config.storageConfig?.accessType as any,
      bucket_name: config.storageConfig?.bucketName || "optivians-bucket",
      region: config.storageConfig?.region || "us-east-1",
      aws_access_key_id: config.storageConfig?.awsAccessKeyId || "",
      aws_secret_access_key: config.storageConfig?.awsSecretAccessKey || "",
    })

    let uploadResult
    try {
      uploadResult = await storageService.uploadFile(file, {
        organization_id: "MUUTAA", // This would come from the authenticated user
        user_id: userId, // This would come from the authenticated user
      })
    } catch (storageError: any) {
      return NextResponse.json(
          {
            status: "failed",
            error: {
              code: "STORAGE_ERROR",
              message: `Storage upload failed: ${storageError.message}`,
            },
          } as UploadResponse,
          { status: 500 },
      )
    }

    // Create operation record in database
    const [operation] = await db
        .insert(uploadOperations)
        .values({
          configId: configId,
          userId: userId, // This would come from the authenticated user
          fileName: file.name,
          filePath: uploadResult.pathname,
          fileSize: file.size,
          rowCount: validationResult.totalRows,
          status: validationResult.errors.length > 0 ? "partially_completed" : "completed",
          errorCount: validationResult.errors.length,
          validationErrors:
              validationResult.errors.length > 0
                  ? {
                    errors: validationResult.errors,
                    valid_rows: validationResult.validRows,
                    total_rows: validationResult.totalRows,
                  }
                  : null,
        })
        .returning()

    console.log(`File uploaded successfully: ${uploadResult.url}`)

    if (validationResult.errors.length > 0) {
      return NextResponse.json({
          status: "partially_completed",
          operation_id: operation.id,
          processed_rows: validationResult.validRows,
          total_rows: validationResult.totalRows,
          error: {
              code: "VALIDATION_ERRORS",
              message: `File processed with ${validationResult.errors.length} validation errors`,
              details: {
                  row_level_errors: {
                      total: validationResult.errors.filter((e) => e.row).length,
                      samples: validationResult.errors.filter((e) => e.row).slice(0, 10),
                      all_errors: validationResult.errors,
                  },
                  file_level_errors: validationResult.errors.filter((e) => !e.row),
              },
          },
      } as unknown as UploadResponse)
    }

    return NextResponse.json({
        status: "success",
        operation_id: operation.id,
        processed_rows: validationResult.validRows,
        total_rows: validationResult.totalRows,
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
