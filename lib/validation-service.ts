export interface ValidationError {
  code: string
  message: string
  column?: string
  row?: number
  line?: number
  value?: any
  expected_format?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  processedRows: any[]
  totalRows: number
  validRows: number
}

export class ValidationService {
  private config: any
  private columns: any[]

  constructor(config: any, columns: any[]) {
    this.config = config
    this.columns = columns.sort((a, b) => a.position - b.position)
  }

  async validateFile(file: File): Promise<ValidationResult> {
    const content = await file.text()
    return this.validateContent(content)
  }

  validateContent(content: string): ValidationResult {
    const lines = content.split("\n").filter((line) => line.trim())
    const errors: ValidationError[] = []
    const processedRows: any[] = []
    console.log("line length : ", lines?.length)



    if (lines.length === 0) {
      errors.push({
        code: "EMPTY_FILE",
        message: "File is empty",
        line: 0,
      })
      return {
        isValid: false,
        errors,
        processedRows: [],
        totalRows: 0,
        validRows: 0,
      }
    }

    if (lines.length === 1) {
      errors.push({
        code: "ROW_NOT_FOUND",
        message: "no rows found in file",
        line: 1,
      })
      return {
        isValid: false,
        errors,
        processedRows: [],
        totalRows: 0,
        validRows: 0,
      }
    }

    // Parse headers
    const headerLine = lines[0]
    // check if respect delimiter
    if (!headerLine.includes(this.config.delimiter)) {
      errors.push({
        code: "INVALID_DELIMITER",
        message: `Header line does not contain the expected delimiter '${this.config.delimiter}'`,
        line: 1,
      })
      return {
        isValid: false,
        errors,
        processedRows: [],
        totalRows: lines.length - 1,
        validRows: 0,
      }
    }
    const headers = this.parseCSVLine(headerLine, this.config.delimiter)

    // Validate headers
    const headerErrors = this.validateHeaders(headers)
    errors.push(...headerErrors)

    // If critical header errors exist and partial upload is not allowed, stop here
    if (headerErrors.length > 0 && !this.config.allow_partial_upload) {
      return {
        isValid: false,
        errors,
        processedRows: [],
        totalRows: lines.length - 1,
        validRows: 0,
      }
    }

    // Validate data rows
    const dataLines = lines.slice(1)
    let validRowCount = 0

    console.log("dataLines length : ", dataLines?.length)

    console.log("this.config.maxRows =: ", this.config.maxRows)

    if(this.config?.maxRows && dataLines?.length > this.config?.maxRows) {
        errors.push({
            code: "MAX_ROWS_EXCEEDED",
            message: `File exceeds maximum allowed rows (${this.config?.maxRows || 0})`,
            line: 1,
        })
        return {
            isValid: false,
            errors,
            processedRows: [],
            totalRows: dataLines.length,
            validRows: 0,
        }
    }else {
      console.log("dataLines length is within maxRows limit")
    }

    dataLines.forEach((line, index) => {
      const lineNumber = index + 2 // +2 because we skip header and arrays are 0-indexed
      const rowNumber = index + 1 // +1 because data rows start at 1

      try {
        const values = this.parseCSVLine(line, this.config.delimiter)
        const rowData: any = {}
        const rowErrors: ValidationError[] = []

        // Validate each column
        headers.forEach((header, colIndex) => {
          const value = values[colIndex]?.trim() || ""
          const columnConfig = this.columns.find((col) => col.name === header)

          if (columnConfig) {
            const columnErrors = this.validateColumnValue(value, columnConfig, rowNumber, lineNumber)
            rowErrors.push(...columnErrors)

            if (columnErrors.length === 0) {
              rowData[header] = this.convertValue(value, columnConfig.data_type)
            }
          }else {
            // uknown column find in configuration
            // check if the header exists in rowErrors
            if (rowErrors.some((error) => error.column !== header)) {
              // If the error for this column already exists, skip adding it again
              console.warn(`Column '${header}' not found in configuration at row ${rowNumber}, line ${lineNumber}`)
              rowErrors.push({
                code: "UNEXPECTED_COLUMN",
                message: `Column '${header}' is not defined in the configuration`,
                column: header,
                row: rowNumber,
                line: lineNumber,
                value: value,
              })
            }

          }
        })

        // If row has errors and partial upload is not allowed, add to errors
        if (rowErrors.length > 0) {
          errors.push(...rowErrors)

          // Only include valid data if partial upload is allowed
          if (this.config.allow_partial_upload && Object.keys(rowData).length > 0) {
            processedRows.push({ ...rowData, _row_number: rowNumber, _has_errors: true })
          }
        } else {
          processedRows.push({ ...rowData, _row_number: rowNumber, _has_errors: false })
          validRowCount++
        }
      } catch (parseError: any) {
        errors.push({
          code: "PARSE_ERROR",
          message: `Failed to parse line: ${parseError.message}`,
          row: rowNumber,
          line: lineNumber,
          value: line,
        })
      }
    })

    const isValid = errors.length === 0 || (this.config.allow_partial_upload && validRowCount > 0)

    return {
      isValid,
      errors,
      processedRows,
      totalRows: dataLines.length,
      validRows: validRowCount,
    }
  }

  private validateHeaders(headers: string[]): ValidationError[] {
    const errors: ValidationError[] = []
    const requiredColumns = this.columns.filter((col) => col.required)
    console.log("headers :: ", headers)
    // Check for missing required columns
    requiredColumns.forEach((column) => {
      if (!headers.includes(column.name)) {
        errors.push({
          code: "MISSING_REQUIRED_COLUMN",
          message: `Required column '${column.display_name}' (${column.name}) is missing from file headers`,
          column: column.name,
          line: 1,
        })
      }
    })

    // Check for duplicate headers
    const headerCounts = headers.reduce(
      (acc, header) => {
        acc[header] = (acc[header] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    Object.entries(headerCounts).forEach(([header, count]) => {
      if (count > 1) {
        errors.push({
          code: "DUPLICATE_COLUMN",
          message: `Column '${header}' appears ${count} times in headers`,
          column: header,
          line: 1,
        })
      }
    })


    // Vérifier l'ordre des colonnes
    const expectedOrder = this.columns.map((col) => col.name)
    let orderMismatch = false
    for (let i = 0; i < Math.min(headers.length, expectedOrder.length); i++) {
      if (headers[i] !== expectedOrder[i]) {
        orderMismatch = true
        break
      }
    }
    if (orderMismatch) {
      errors.push({
        code: "COLUMN_ORDER_MISMATCH",
        message: `Columns are not in the expected order. \n Expected: [${expectedOrder.join(", ")}], \n Found: [${headers.join(", ")}]`,
        line: 1,
      })
    }

    return errors
  }

  private validateColumnValue(
    value: string,
    columnConfig: any,
    rowNumber: number,
    lineNumber: number,
  ): ValidationError[] {
    const errors: ValidationError[] = []

    // todo : check if valuesRequired
    // Required field validation
    if (columnConfig.valuesRequired && !value || columnConfig.valuesRequired && value.trim() === "") {
      errors.push({
        code: "MISSING_REQUIRED_VALUE",
        message: `${columnConfig.display_name} is required`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
      return errors // Don't continue validation if required field is empty
    } else if (columnConfig.valuesRequired && ["null", "undefined", "NaN"].includes(value)) {
        errors.push({
            code: "INVALID_REQUIRED_VALUE",
            message: `${columnConfig.display_name} cannot be null, undefined, or NaN`,
            column: columnConfig.name,
            row: rowNumber,
            line: lineNumber,
            value: value,
        })
        return errors // Don't continue validation if required field is invalid
    }

    // Skip further validation for empty optional fields
    if (!value && !columnConfig.valuesRequired) {
      return errors
    }

    // Data type specific validation
    switch (columnConfig.data_type) {
      case "string":
        errors.push(...this.validateStringValue(value, columnConfig, rowNumber, lineNumber))
        break
      case "number":
        errors.push(...this.validateNumberValue(value, columnConfig, rowNumber, lineNumber))
        break
      case "date":
        errors.push(...this.validateDateValue(value, columnConfig, rowNumber, lineNumber))
        break
      case "boolean":
        errors.push(...this.validateBooleanValue(value, columnConfig, rowNumber, lineNumber))
        break
    }

    return errors
  }

  private validateStringValue(
    value: string,
    columnConfig: any,
    rowNumber: number,
    lineNumber: number,
  ): ValidationError[] {
    const errors: ValidationError[] = []

    if (columnConfig.valuesRequired && !value || columnConfig.valuesRequired && value.trim() === "") {
      errors.push({
        code: "MISSING_REQUIRED_VALUE",
        message: `${columnConfig.display_name} is required`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
      return errors // Don't continue validation if required field is empty
    } else if (columnConfig.valuesRequired && ["null", "undefined", "NaN"].includes(value)) {
      errors.push({
        code: "INVALID_REQUIRED_VALUE",
        message: `${columnConfig.display_name} cannot be null, undefined, or NaN`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
      return errors // Don't continue validation if required field is invalid
    }
    // Length validation
    if (columnConfig.min_length && value.length < columnConfig.min_length) {
      errors.push({
        code: "VALUE_TOO_SHORT",
        message: `${columnConfig.display_name} must be at least ${columnConfig.min_length} characters (current: ${value.length})`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
    }

    if (columnConfig.max_length && value.length > columnConfig.max_length) {
      errors.push({
        code: "VALUE_TOO_LONG",
        message: `${columnConfig.display_name} must be at most ${columnConfig.max_length} characters (current: ${value.length})`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
    }

    // Pattern validation
    if (columnConfig.pattern) {
      try {
        const regex = new RegExp(columnConfig.pattern)
        if (!regex.test(value)) {
          errors.push({
            code: "PATTERN_MISMATCH",
            message: `${columnConfig.display_name} format is invalid`,
            column: columnConfig.name,
            row: rowNumber,
            line: lineNumber,
            value: value,
            expected_format: columnConfig.pattern,
          })
        }
      } catch (regexError) {
        errors.push({
          code: "INVALID_PATTERN",
          message: `Invalid pattern configuration for ${columnConfig.display_name}`,
          column: columnConfig.name,
          row: rowNumber,
          line: lineNumber,
          value: value,
        })
      }
    }

    return errors
  }

  private validateNumberValue(
    value: string,
    columnConfig: any,
    rowNumber: number,
    lineNumber: number,
  ): ValidationError[] {
    const errors: ValidationError[] = []

    // Check if it's a valid number
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      errors.push({
        code: "INVALID_NUMBER",
        message: `${columnConfig.display_name} must be a valid number`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
        expected_format: "Valid number (e.g., 123, 45.67, -89)",
      })
      return errors
    }

    // Range validation
    if (columnConfig.min_value !== undefined && numValue < columnConfig.min_value) {
      errors.push({
        code: "VALUE_TOO_SMALL",
        message: `${columnConfig.display_name} must be at least ${columnConfig.min_value} (current: ${numValue})`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
    }

    if (columnConfig.max_value !== undefined && numValue > columnConfig.max_value) {
      errors.push({
        code: "VALUE_TOO_LARGE",
        message: `${columnConfig.display_name} must be at most ${columnConfig.max_value} (current: ${numValue})`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
      })
    }

    return errors
  }

  // private isValidDate(dateString: string, format?: string): boolean {
  //   // If format is provided, use it
  //   if (format) {
  //     return validateWithFormat(dateString, format);
  //   }
  //
  //   // Otherwise use general pattern validation
  //   return validateGeneralPattern(dateString);
  // }
  private validateGeneralPattern(dateString: string): boolean {
    // Test against common patterns
    const patterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY
      /^\d{1,2}-\d{1,2}-\d{4}$/ // M-D-YYYY
    ];

    // Check if any pattern matches
    const patternMatch = patterns.some(pattern => pattern.test(dateString));
    if (!patternMatch) return false;

    // Convert to Date object and validate
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  private validateWithFormat(dateString: string, format: string): boolean {
    // Create regex based on format
    let regexPattern = format
        .replace(/yyyy/g, '\\d{4}')
        .replace(/yy/g, '\\d{2}')
        .replace(/MM/g, '(0[1-9]|1[0-2])')
        .replace(/M/g, '([1-9]|1[0-2])')
        .replace(/dd/g, '(0[1-9]|[12][0-9]|3[01])')
        .replace(/d/g, '([1-9]|[12][0-9]|3[01])')
        .replace(/\//g, '\\/')
        .replace(/-/g, '\\-');

    const formatRegex = new RegExp(`^${regexPattern}$`);

    // Check format match
    if (!formatRegex.test(dateString)) return false;

    // Extract date components based on format
    const formatParts = format.split(/[\/\-]/);
    const dateParts = dateString.split(/[\/\-]/);

    const dateObj: any = {};
    formatParts.forEach((part, i) => {
      dateObj[part] = parseInt(dateParts[i], 10);
    });

    // Create Date object (months are 0-indexed in JavaScript)
    const year = dateObj.yyyy || (dateObj.yy ? 2000 + dateObj.yy : null);
    const month = (dateObj.MM || dateObj.M) - 1;
    const day = dateObj.dd || dateObj.d;

    const date = new Date(year, month, day);

    // Validate date (check if rolled over to next month)
    return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
    );
  }

  private validateDateValue(
    value: string,
    columnConfig: any,
    rowNumber: number,
    lineNumber: number,
  ): ValidationError[] {
    const errors: ValidationError[] = []

    // If pattern is specified, validate against it first
    if (columnConfig.pattern) {
      try {
        // const regex = new RegExp(columnConfig.pattern)
        // if (!regex.test(value)) {
        if (!this.validateWithFormat(value, columnConfig.pattern)) {
          errors.push({
            code: "DATE_FORMAT_MISMATCH",
            message: `${columnConfig.display_name} must match the required date format`,
            column: columnConfig.name,
            row: rowNumber,
            line: lineNumber,
            value: value,
            expected_format: this.getDateFormatExample(columnConfig.pattern),
          })
          return errors
        }
      } catch (regexError) {
        errors.push({
          code: "INVALID_DATE_PATTERN",
          message: `Invalid date pattern configuration for ${columnConfig.display_name}`,
          column: columnConfig.name,
          row: rowNumber,
          line: lineNumber,
          value: value,
        })
        return errors
      }
    }

    // Try to parse the date
    // const parsedDate = new Date(value)
    // if (isNaN(parsedDate.getTime())) {
    if (!this.validateGeneralPattern(value)) {
      errors.push({
        code: "INVALID_DATE",
        message: `${columnConfig.display_name} is not a valid date`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
        expected_format: columnConfig.pattern
          ? this.getDateFormatExample(columnConfig.pattern)
          : "Valid date (e.g., 2024-01-15, 01/15/2024, 2024-01-15T10:30:00)",
      })
    }

    return errors
  }

  private validateBooleanValue(
    value: string,
    columnConfig: any,
    rowNumber: number,
    lineNumber: number,
  ): ValidationError[] {
    const errors: ValidationError[] = []

    const lowerValue = value.toLowerCase()
    const validBooleans = ["true", "false", "1", "0", "yes", "no", "y", "n"]

    if (!validBooleans.includes(lowerValue)) {
      errors.push({
        code: "INVALID_BOOLEAN",
        message: `${columnConfig.display_name} must be a valid boolean value`,
        column: columnConfig.name,
        row: rowNumber,
        line: lineNumber,
        value: value,
        expected_format: "true/false, 1/0, yes/no, y/n",
      })
    }

    return errors
  }

  private getDateFormatExample(pattern: string): string {
    // Convert regex patterns to human-readable examples
    const formatExamples: Record<string, string> = {
      "^\\d{4}-\\d{2}-\\d{2}$": "YYYY-MM-DD (e.g., 2024-01-15)",
      "^\\d{2}/\\d{2}/\\d{4}$": "MM/DD/YYYY (e.g., 01/15/2024)",
      "^\\d{2}-\\d{2}-\\d{4}$": "DD-MM-YYYY (e.g., 15-01-2024)",
      "^\\d{4}/\\d{2}/\\d{2}$": "YYYY/MM/DD (e.g., 2024/01/15)",
      "^\\d{1,2}/\\d{1,2}/\\d{4}$": "M/D/YYYY (e.g., 1/15/2024)",
      "^\d{1,2}-\d{1,2}-\d{4}$" : "M-D-YYYY (e.g., 1-15-2024)",
      "^\d{2}-\d{2}-\d{4}$": "MM-DD-YYYY (e.g., 01-15-2024)",

    }

    return formatExamples[pattern] || `Pattern: ${pattern}`
  }

  private parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i += 2
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
          i++
        }
      } else if (char === delimiter && !inQuotes) {
        // End of field
        result.push(current?.trim()?.replace("\r", "")?.replace("\n", ""))
        current = ""
        i++
      } else {
        current += char
        i++
      }
    }

    // Add the last field
    result.push(current?.trim()?.replace("\r", "")?.replace("\n", ""))
    return result
  }

  private convertValue(value: string, dataType: string): any {
    if (!value) return null

    switch (dataType) {
      case "number":
        return Number.parseFloat(value)
      case "boolean":
        const lowerValue = value.toLowerCase()
        return ["true", "1", "yes", "y"].includes(lowerValue)
      case "date":
        return new Date(value)
      default:
        return value
    }
  }
}
