export interface UploadConfiguration {
  id: number
  name: string
  description: string
  organization_type: string
  organization_id?: string
  source_type: string
  file_type: string
  delimiter: string
  max_file_size: number
  max_rows?: number
  storage_config_id: number
  active: boolean
  allow_partial_upload: boolean // New field to control upload behavior on validation errors
  created_at: Date
  updated_at: Date
}

export interface UploadConfigurationColumn {
  id: number
  config_id: number | undefined
  name: string
  display_name: string
  data_type: "string" | "number" | "date" | "boolean" | "email"
  required: boolean
  valuesRequired: boolean
  pattern?: string
  min_length?: number
  max_length?: number
  min_value?: number
  max_value?: number
  custom_validator?: string
  position: number
}

export interface UploadStorageConfiguration {
  id: number
  name: string
  description: string
  storage_type: "vercel_blob" | "s3" | "local" | "azure_blob" | "gcs"
  bucket_name?: string
  container_name?: string
  gcs_project_id?: string
  gcs_key_filename?: string
  azure_account_name?: string
  azure_account_key?: string
  azure_sas_token?: string
  base_path: string
  path_template: string
  region?: string
  aws_access_key_id?: string
  aws_secret_access_key?: string
  access_type?: "public" | "private"
  created_at: Date
  updated_at: Date
}

export interface ValidationError {
  code: string
  message: string
  column?: string
  row?: number
  line?: number
  value?: string
  expected_format?: string
}

export interface UploadResponse {
  status: "success" | "failed" | "partially_completed"
  operation_id?: string
  processed_rows?: number
  total_rows?: number
  error?: {
    code: string
    message: string
    details?: {
      file_level_errors?: ValidationError[]
      row_level_errors?: {
        total: number
        samples: ValidationError[]
        all_errors: ValidationError[] // Complete list of all validation errors
      }
    }
  }
}

export interface OrganizationType {
  id: number
  name: string
  source_types: string[]
}
