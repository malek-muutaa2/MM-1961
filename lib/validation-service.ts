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
    private readonly config: any
    private readonly columns: any[]

    constructor(config: any, columns: any[]) {
        this.config = config
        this.columns = columns.toSorted((a, b) => a.position - b.position)
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

        if (this.config?.maxRows && dataLines?.length > this.config?.maxRows) {
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
        } else {
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
                    } else {
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
                        processedRows.push({...rowData, _row_number: rowNumber, _has_errors: true})
                    }
                } else {
                    processedRows.push({...rowData, _row_number: rowNumber, _has_errors: false})
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
            case "datetime":
                // For datetime, we can use the same validation as date for now
                errors.push(...this.validateDatetimeValue(value, columnConfig, rowNumber, lineNumber))
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

    // private validateWithFormat(dateString: string, format: string): boolean {
    //   if (!format) throw new Error('INVALID_DATE_PATTERN: Format string is empty');
    //   // Create regex based on format
    //   const normalizedFormat = format.toLowerCase();
    //   const validTokens = ['yyyy', 'yy', 'mm', 'm', 'dd', 'd', '/', '-'];
    //   const tokens = normalizedFormat.split(/(yyyy|yy|mm|m|dd|d|[\/\-])/).filter(Boolean);
    //
    //   for (const token of tokens) {
    //     if (!validTokens.includes(token)) {
    //       throw new Error(`INVALID_DATE_PATTERN: Unsupported token in date pattern : '${token}'`);
    //     }
    //   }
    //
    //   let regexPattern = normalizedFormat
    //       .replace(/yyyy/g, '\\d{4}')
    //       .replace(/yy/g, '\\d{2}')
    //       .replace(/mm/g, '(0[1-9]|1[0-2])')
    //       .replace(/m/g, '([1-9]|1[0-2])')
    //       .replace(/dd/g, '(0[1-9]|[12][0-9]|3[01])')
    //       .replace(/d/g, '([1-9]|[12][0-9]|3[01])')
    //       .replace(/\//g, '\\/')
    //       .replace(/-/g, '\\-');
    //
    //   const formatRegex = new RegExp(`^${regexPattern}$`);
    //
    //   // Check format match
    //   if (!formatRegex.test(dateString)) {
    //     console.log("format not match ::: 1")
    //     return false;
    //   }
    //
    //   // Extract date components based on format
    //   const formatParts = normalizedFormat.split(/[\/\-]/);
    //   const dateParts = dateString.split(/[\/\-]/);
    //
    //   const dateObj: any = {};
    //   formatParts.forEach((part, i) => {
    //     dateObj[part] = parseInt(dateParts[i], 10);
    //   });
    //
    //   // Create Date object (months are 0-indexed in JavaScript)
    //   const year = dateObj.yyyy || (dateObj.yy ? 2000 + dateObj.yy : null);
    //   const month = (dateObj.mm || dateObj.m) - 1;
    //   const day = dateObj.dd || dateObj.d;
    //
    //   const date = new Date(year, month, day);
    //
    //
    //   // Validate date (check if rolled over to next month)
    //   return (
    //       date.getFullYear() === year &&
    //       date.getMonth() === month &&
    //       date.getDate() === day
    //   );
    // }

    // private validateWithFormat(dateString: string, format: string): boolean {
    //     try {
    //         // Normalize the format to lowercase
    //         const normalizedFormat = format.toLowerCase();
    //
    //         // Validate the format pattern first
    //         // if (!/^(yyyy|yy)([\/\-])(mm|m)(\2)(dd|d)$/.test(normalizedFormat)) {
    //         //
    //         //     console.log("regexError : ", regexError.message)
    //         //     throw new Error('INVALID_DATE_PATTERN: Unsupported date format');
    //         // }
    //         console.log("format not match :::  ", normalizedFormat)
    //
    //         // Create proper regex pattern parts
    //         const yearPattern = normalizedFormat.startsWith('yyyy') ? '\\d{4}' : '\\d{2}';
    //         // yyyy can be includes in data
    //         const monthPattern = normalizedFormat.includes('mm') ? '(0[1-9]|1[0-2])' : '([1-9]|1[0-2])';
    //         const dayPattern = normalizedFormat.includes('dd') ? '(0[1-9]|[12][0-9]|3[01])' : '([1-9]|[12][0-9]|3[01])';
    //         const separator = normalizedFormat.includes('/') ? '\\/' : '\\-';
    //
    //         // Construct the complete regex pattern
    //         const regexPattern = `^${yearPattern}${separator}${monthPattern}${separator}${dayPattern}$`;
    //         const formatRegex = new RegExp(regexPattern);
    //
    //         // Test format match
    //         if (!formatRegex.test(dateString)) {
    //             console.log("regexPattern : ", regexPattern)
    //             console.error('Format does not match:', normalizedFormat, dateString);
    //             return false;
    //         }
    //
    //         // // Extract date components
    //         // const dateParts = dateString.split(/[\/\-]/);
    //         // const year = normalizedFormat.startsWith('yyyy') ?
    //         //     parseInt(dateParts[0], 10) : normalizedFormat.endsWith('yyyy') ?
    //         //     2000 + parseInt(dateParts[0], 10) :
    //         //     2000 + parseInt(dateParts[0], 10);
    //         // const month = parseInt(dateParts[1], 10) - 1;
    //         // const day = parseInt(dateParts[2], 10);
    //         //
    //         // // Validate date components
    //         // if (month < 0 || month > 11) return false;
    //         // if (day < 1 || day > 31) return false;
    //         //
    //         // // Check if date is valid
    //         // const date = new Date(year, month, day);
    //         // return (
    //         //     date.getFullYear() === year &&
    //         //     date.getMonth() === month &&
    //         //     date.getDate() === day
    //         // );
    //
    //           // Extract date components based on format
    //           const formatParts = normalizedFormat.split(/[\/\-]/);
    //           const dateParts = dateString.split(/[\/\-]/);
    //
    //           const dateObj: any = {};
    //           formatParts.forEach((part, i) => {
    //             dateObj[part] = parseInt(dateParts[i], 10);
    //           });
    //
    //           // Create Date object (months are 0-indexed in JavaScript)
    //           const year = dateObj.yyyy || (dateObj.yy ? 2000 + dateObj.yy : null);
    //           const month = (dateObj.mm || dateObj.m) - 1;
    //           const day = dateObj.dd || dateObj.d;
    //
    //           const date = new Date(year, month, day);
    //
    //           // Validate date (check if rolled over to next month)
    //           return (
    //               date.getFullYear() === year &&
    //               date.getMonth() === month &&
    //               date.getDate() === day
    //           );
    //     } catch (error: any) {
    //         console.error('Date validation error:', error.message);
    //         return false;
    //     }
    // }

    private validateWithFormat(dateString: string, format: string): boolean {
        try {
            const normalizedFormat = format.toLowerCase();
            const separator = normalizedFormat.includes('/') ? '/' : '-';

            // Parse the format to determine component positions
            const formatParts = normalizedFormat.split(separator);
            const componentMap = {
                year: { index: -1, pattern: '' },
                month: { index: -1, pattern: '' },
                day: { index: -1, pattern: '' }
            };

            // Identify component positions and patterns
            formatParts.forEach((part, index) => {
                if (part.includes('yy')) {
                    componentMap.year.index = index;
                    componentMap.year.pattern = part.includes('yyyy') ? '\\d{4}' : '\\d{2}';
                } else if (part.includes('m')) {
                    componentMap.month.index = index;
                    componentMap.month.pattern = part.includes('mm') ? '(0[1-9]|1[0-2])' : '([1-9]|1[0-2])';
                } else if (part.includes('d')) {
                    componentMap.day.index = index;
                    componentMap.day.pattern = part.includes('dd') ? '(0[1-9]|[12][0-9]|3[01])' : '([1-9]|[12][0-9]|3[01])';
                }
            });

            // Build regex pattern in correct order
            const regexParts = formatParts.map(part => {
                if (part.includes('yy')) return componentMap.year.pattern;
                if (part.includes('m')) return componentMap.month.pattern;
                if (part.includes('d')) return componentMap.day.pattern;
                throw new Error('INVALID_DATE_PATTERN');
            });

            const regexPattern = `^${regexParts.join(separator === '/' ? '\\/' : '\\-')}$`;
            const formatRegex = new RegExp(regexPattern);

            if (!formatRegex.test(dateString)) return false;

            // Extract components based on their positions
            const dateParts = dateString.split(separator);
            const yearStr = dateParts[componentMap.year.index];
            const monthStr = dateParts[componentMap.month.index];
            const dayStr = dateParts[componentMap.day.index];

            const year = componentMap.year.pattern === '\\d{4}'
                ? parseInt(yearStr, 10)
                : 2000 + parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10) - 1;
            const day = parseInt(dayStr, 10);

            // Validate date
            const date = new Date(year, month, day);
            return (
                date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day
            );
        } catch (error) {
            console.error('Date validation error:', error);
            return false;
        }
    }

    private isValidDateFormat(format: string): boolean {
        const normalizedFormat = format.toLowerCase();
        const DATE_FORMAT_REGEX =
            /^(?:(y{2,4}|m{1,2}|d{1,2})([\/-])(y{2,4}|m{1,2}|d{1,2})\2(y{2,4}|m{1,2}|d{1,2})|(?:(y{2,4}|m{1,2}|d{1,2})([\/-])(y{2,4}|m{1,2}|d{1,2})\6(y{2,4}|m{1,2}|d{1,2})))$/;
        const parts = normalizedFormat.split(/[-/]/);

        const allowedParts = ['yyyy', 'yy', 'mm', 'm', 'dd', 'd'];

        const hasValidParts = parts.length === 3 && parts.every((p) => allowedParts.includes(p));

        const hasSameSeparator = /^([dmy]{1,4})([-/])([dmy]{1,4})\2([dmy]{1,4})$/i.test(normalizedFormat);

        return hasValidParts && hasSameSeparator;
    }

    /**
     * Valide une chaîne datetime selon un format spécifié
     * @param dateTimeString La chaîne datetime à valider (ex: "2024-01-15T10:30:00")
     * @param format Le format attendu (ex: "yyyy-mm-ddThh:mm:ss")
     * @returns boolean indiquant si le datetime est valide
     */
    private validateDateTimeWithFormat(dateTimeString: string, format: string): boolean {
        try {
            // On sépare la partie date et heure du format
            const [dateFormat, timeFormat] = format.toLowerCase().split(/[ t]/);
            const [datePart, timePart] = dateTimeString.split(/[ t]/);

            // Valider la partie date
            if (!this.validateDateWithFormat(datePart, dateFormat)) {
                return false;
            }

            // Si un format d'heure est spécifié, valider la partie heure
            if (timeFormat && timePart) {
                // Construire le regex pour l'heure
                // Exemples de timeFormat: "hh:mm:ss", "hh:mm"
                let timeRegexPattern = timeFormat
                    .replace(/hh/g, '\\d{2}')
                    .replace(/mm/g, '\\d{2}')
                    .replace(/ss/g, '\\d{2}')
                    .replace(/:/g, '\\:');
                const timeRegex = new RegExp(`^${timeRegexPattern}$`);
                if (!timeRegex.test(timePart)) {
                    return false;
                }
                // Vérifier la validité des composantes de l'heure
                const [hh, mm, ss] = timePart.split(':').map(Number);
                if (
                    isNaN(hh) || hh < 0 || hh > 23 ||
                    isNaN(mm) || mm < 0 || mm > 59 ||
                    (timeFormat.includes('ss') && (isNaN(ss) || ss < 0 || ss > 59))
                ) {
                    return false;
                }
            } else if (timeFormat && !timePart) {
                // Format d'heure attendu mais non présent
                return false;
            }

            return true;
        } catch (error) {
            console.error('Datetime validation error:', error);
            return false;
        }
    }


    /**
     * Validates a date string against a specified format
     * @param dateString The date string to validate (e.g., "12-31-2023")
     * @param format The format pattern (e.g., "MM-DD-YYYY")
     * @returns boolean indicating if the date is valid
     */
    private validateDateWithFormat(dateString: string, format: string): boolean {
        try {
            // Normalize the format to lowercase and validate structure
            const normalizedFormat = format.toLowerCase();
            const separator = /[/-]/.exec(normalizedFormat)?.[0] || '-';
            // const pattern = /^(yyyy|yy)([\/\-]?(mm|m)([\/\-]?(dd|d))|((mm|m)([\/\-]?(dd|d)([\/\-]?(yyyy|yy)))|((dd|d)([\/\-]?(mm|m)([\/\-]?(yyyy|yy))))$/
            // if (!pattern.test(normalizedFormat)) {
            //     throw new Error('INVALID_FORMAT_PATTERN');
            // }
            if (!this.isValidDateFormat(normalizedFormat)) {
                throw new Error('INVALID_FORMAT_PATTERN');
            }

            // Parse the format components
            const formatParts = normalizedFormat.split(separator);
            const componentMap: Record<string, {index: number, pattern: string, type: string}> = {};

            formatParts.forEach((part, index) => {
                if (part.includes('yy')) {
                    componentMap.year = {
                        index,
                        pattern: part === 'yyyy' ? '\\d{4}' : '\\d{2}',
                        type: 'year'
                    };
                } else if (part.includes('m')) {
                    componentMap.month = {
                        index,
                        pattern: part === 'mm' ? '(0[1-9]|1[0-2])' : '([1-9]|1[0-2])',
                        type: 'month'
                    };
                } else if (part.includes('d')) {
                    componentMap.day = {
                        index,
                        pattern: part === 'dd' ? '(0[1-9]|[12][0-9]|3[01])' : '([1-9]|[12][0-9]|3[01])',
                        type: 'day'
                    };
                }
            });

            // console.log("componentMap = ", componentMap)

            // Build regex pattern
            const regexParts = formatParts.map(part => {
                if (part.includes('yy')) return componentMap.year.pattern;
                if (part.includes('m')) return componentMap.month.pattern;
                if (part.includes('d')) return componentMap.day.pattern;
                return '';
            });

            console.log(" regexParts = ", regexParts)

            const regexPattern = `^${regexParts.join(`\\${separator}`)}$`;
            const formatRegex = new RegExp(regexPattern);
            console.log("formatRegex = ", formatRegex)
            // Test format match
            if (!formatRegex.test(dateString)) {
                return false;
            }

            // Extract date components
            const dateParts = dateString.split(separator);
            const getValue = (type: string) => {
                const part = componentMap[type];
                return parseInt(dateParts[part.index], 10);
            };

            let year = getValue('year');
            const month = getValue('month') - 1;
            const day = getValue('day');

            // Adjust 2-digit years
            if (componentMap.year.pattern === '\\d{2}') {
                year = 2000 + year;
            }

            // Validate date components
            if (month < 0 || month > 11) return false;
            if (day < 1 || day > 31) return false;

            // Check if date is valid
            const date = new Date(year, month, day);
            return (
                date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day
            );
        } catch (error) {
            console.error('Date validation error:', error);
            return false;
        }
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
                // if (!this.validateWithFormat(value, columnConfig?.pattern)) {
                if (!this.validateDateWithFormat(value, columnConfig?.pattern)) {
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
            } catch (regexError: any) {
                console.log("regexError : ", regexError.message)
                console.log("format not match :::  ", columnConfig?.pattern)
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

    private validateDatetimeValue(
        value: string,
        columnConfig: any,
        rowNumber: number,
        lineNumber: number,
    ): ValidationError[] {
        const errors: ValidationError[] = []

        // If pattern is specified, validate against it first
        if (columnConfig.pattern) {
            try {
                // if (!this.validateWithFormat(value, columnConfig?.pattern)) {
                if (!this.validateDateTimeWithFormat(value, columnConfig?.pattern)) {
                    errors.push({
                        code: "DATETIME_FORMAT_MISMATCH",
                        message: `${columnConfig.display_name} must match the required datetime format`,
                        column: columnConfig.name,
                        row: rowNumber,
                        line: lineNumber,
                        value: value,
                        expected_format: this.getDateFormatExample(columnConfig.pattern),
                    })
                    return errors
                }
            } catch (regexError: any) {
                console.log("regexError : ", regexError.message)
                console.log("format not match :::  ", columnConfig?.pattern)
                errors.push({
                    code: "INVALID_DATETIME_PATTERN",
                    message: `Invalid datetime pattern configuration for ${columnConfig.display_name}`,
                    column: columnConfig.name,
                    row: rowNumber,
                    line: lineNumber,
                    value: value,
                })
                return errors
            }
        }

        // Try to parse the datetime
        const parsedDate = new Date(value)
        if (isNaN(parsedDate.getTime())) {
            errors.push({
                code: "INVALID_DATETIME",
                message: `${columnConfig.display_name} is not a valid datetime`,
                column: columnConfig.name,
                row: rowNumber,
                line: lineNumber,
                value: value,
                expected_format: columnConfig.pattern
                    ? this.getDateFormatExample(columnConfig.pattern)
                    : "Valid datetime (e.g., 2024-01-15T10:30:00, 01/15/2024 10:30 AM)",
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
            "^\d{1,2}-\d{1,2}-\d{4}$": "M-D-YYYY (e.g., 1-15-2024)",
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
