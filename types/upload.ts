export interface UploadConfiguration {
  id: string
  name: string
  description: string
  organization_type: string
  organization_id?: string
  source_type: string
  file_type: string
  delimiter: string
  max_file_size: number
  max_rows?: number
  storage_config_id: string
  active: boolean
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface UploadConfigurationColumn {
  id: string
  config_id: string
  name: string
  display_name: string
  data_type: "string" | "number" | "date" | "boolean" | "email"
  required: boolean
  pattern?: string
  min_length?: number
  max_length?: number
  min_value?: number
  max_value?: number
  custom_validator?: string
  position: number
}

export interface UploadStorageConfiguration {
  id: string
  name: string
  description: string
  storage_type: "vercel_blob" | "s3" | "local" | "azure_blob" | "gcs"
  bucket_name?: string
  base_path: string
  path_template: string
  region?: string
  aws_access_key_id?: string
  aws_secret_access_key?: string
  access_type?: "public" | "private"
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  gcs_project_id?: string
  gcs_key_filename?: string
  azure_account_name?: string
  azure_account_key?: string
  container_name?: string
  azure_sas_token?: string
}

export interface UploadOperation {
  id: string
  config_id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number
  row_count: number
  status: "pending" | "processing" | "completed" | "failed" | "partially_completed"
  error_count: number
  validation_errors: any
  started_at: Date
  completed_at?: Date
}

export interface UploadOperationError {
  id: string
  operation_id: string
  row_number?: number
  column_name?: string
  error_code: string
  error_message: string
  raw_value?: string
}

export interface ValidationError {
  code: string
  message: string
  column?: string
  row?: number
  value?: string
}

export interface UploadResponse {
  status: "success" | "failed" | "partially_completed"
  operation_id?: string
  error?: {
    code: string
    message: string
    details?: {
      file_level_errors?: ValidationError[]
      row_level_errors?: {
        total: number
        samples: ValidationError[]
      }
    }
  }
}

export interface OrganizationType {
  id: string
  name: string
  source_types: string[]
}
