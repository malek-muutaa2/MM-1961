import { ValidationService } from "../../lib/validation-service"
import type { UploadConfigurationColumn } from "../../types/upload"

describe("ValidationService", () => {
  const mockConfig = {
    id: "test-config",
    name: "Test Configuration",
    delimiter: ",",
    allow_partial_upload: false,
  }

  const mockColumns: UploadConfigurationColumn[] = [
    {
      id: 1,
      config_id: 1,
      name: "name",
      display_name: "Full Name",
      data_type: "string",
      required: true,
      min_length: 2,
      max_length: 50,
      position: 0,
    },
    {
      id: 2,
      config_id: 2,
      name: "age",
      display_name: "Age",
      data_type: "number",
      required: true,
      min_value: 0,
      max_value: 120,
      position: 1,
    },
    {
      id: 3,
      config_id: 3,
      name: "birth_date",
      display_name: "Birth Date",
      data_type: "date",
      required: true,
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      position: 2,
    },
    {
      id: 4,
      config_id: 2,
      name: "active",
      display_name: "Active Status",
      data_type: "boolean",
      required: false,
      position: 3,
    },
  ]

  describe("Header Validation", () => {
    it("should pass validation with all required headers", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,1993-01-15,true"

      const result = validationService.validateContent(csvContent)

      const headerErrors = result.errors.filter((e) => e.line === 1)
      expect(headerErrors).toHaveLength(0)
    })

    it("should fail validation with missing required headers", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age\nJohn Doe,30"

      const result = validationService.validateContent(csvContent)

      const headerErrors = result.errors.filter((e) => e.code === "MISSING_REQUIRED_COLUMN")
      expect(headerErrors).toHaveLength(1)
      expect(headerErrors[0].message).toContain("Birth Date")
    })

    it("should detect duplicate headers", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,name,age,birth_date\nJohn,Doe,30,1993-01-15"

      const result = validationService.validateContent(csvContent)

      const duplicateErrors = result.errors.filter((e) => e.code === "DUPLICATE_COLUMN")
      expect(duplicateErrors).toHaveLength(1)
      expect(duplicateErrors[0].message).toContain("appears 2 times")
    })
  })

  describe("String Validation", () => {
    it("should validate string length constraints", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nA,30,1993-01-15,true"

      const result = validationService.validateContent(csvContent)

      const lengthErrors = result.errors.filter((e) => e.code === "VALUE_TOO_SHORT")
      expect(lengthErrors).toHaveLength(1)
      expect(lengthErrors[0].column).toBe("name")
    })

    it("should validate string pattern matching", () => {
      const patternColumn: UploadConfigurationColumn = {
        id: 5,
        config_id: 1,
        name: "email",
        display_name: "Email",
        data_type: "string",
        required: true,
        pattern: "^[^@]+@[^@]+\\.[^@]+$",
        position: 4,
      }

      const validationService = new ValidationService(mockConfig, [...mockColumns, patternColumn])
      const csvContent = "name,age,birth_date,active,email\nJohn Doe,30,1993-01-15,true,invalid-email"

      const result = validationService.validateContent(csvContent)

      const patternErrors = result.errors.filter((e) => e.code === "PATTERN_MISMATCH")
      expect(patternErrors).toHaveLength(1)
      expect(patternErrors[0].column).toBe("email")
    })
  })

  describe("Number Validation", () => {
    it("should validate number format", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,not-a-number,1993-01-15,true"

      const result = validationService.validateContent(csvContent)

      const numberErrors = result.errors.filter((e) => e.code === "INVALID_NUMBER")
      expect(numberErrors).toHaveLength(1)
      expect(numberErrors[0].column).toBe("age")
    })

    it("should validate number range constraints", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,150,1993-01-15,true"

      const result = validationService.validateContent(csvContent)

      const rangeErrors = result.errors.filter((e) => e.code === "VALUE_TOO_LARGE")
      expect(rangeErrors).toHaveLength(1)
      expect(rangeErrors[0].column).toBe("age")
    })
  })

  describe("Date Validation", () => {
    it("should validate date format with pattern", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,01/15/1993,true"

      const result = validationService.validateContent(csvContent)

      const dateErrors = result.errors.filter((e) => e.code === "DATE_FORMAT_MISMATCH")
      expect(dateErrors).toHaveLength(1)
      expect(dateErrors[0].column).toBe("birth_date")
      expect(dateErrors[0].expected_format).toContain("YYYY-MM-DD")
    })

    it("should validate date parsing", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,2023-13-45,true"

      const result = validationService.validateContent(csvContent)

      const dateErrors = result.errors.filter((e) => e.code === "INVALID_DATE")
      expect(dateErrors).toHaveLength(1)
      expect(dateErrors[0].column).toBe("birth_date")
    })
  })

  describe("Boolean Validation", () => {
    it("should validate boolean values", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,1993-01-15,maybe"

      const result = validationService.validateContent(csvContent)

      const booleanErrors = result.errors.filter((e) => e.code === "INVALID_BOOLEAN")
      expect(booleanErrors).toHaveLength(1)
      expect(booleanErrors[0].column).toBe("active")
    })

    it("should accept valid boolean values", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const testCases = ["true", "false", "1", "0", "yes", "no", "y", "n"]

      testCases.forEach((boolValue) => {
        const csvContent = `name,age,birth_date,active\nJohn Doe,30,1993-01-15,${boolValue}`
        const result = validationService.validateContent(csvContent)
        const booleanErrors = result.errors.filter((e) => e.code === "INVALID_BOOLEAN")
        expect(booleanErrors).toHaveLength(0)
      })
    })
  })

  describe("Required Field Validation", () => {
    it("should fail validation for missing required fields", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\n,30,1993-01-15,true"

      const result = validationService.validateContent(csvContent)

      const requiredErrors = result.errors.filter((e) => e.code === "MISSING_REQUIRED_VALUE")
      expect(requiredErrors).toHaveLength(1)
      expect(requiredErrors[0].column).toBe("name")
    })
  })

  describe("Partial Upload Configuration", () => {
    it("should allow partial upload when configured", () => {
      const partialConfig = { ...mockConfig, allow_partial_upload: true }
      const validationService = new ValidationService(partialConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,1993-01-15,true\n,invalid,bad-date,maybe"

      const result = validationService.validateContent(csvContent)

      expect(result.isValid).toBe(true)
      expect(result.validRows).toBe(1)
      expect(result.totalRows).toBe(2)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it("should reject file when partial upload is disabled", () => {
      const strictConfig = { ...mockConfig, allow_partial_upload: false }
      const validationService = new ValidationService(strictConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\nJohn Doe,30,1993-01-15,true\n,invalid,bad-date,maybe"

      const result = validationService.validateContent(csvContent)

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe("CSV Parsing", () => {
    it("should handle quoted fields with commas", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = 'name,age,birth_date,active\n"Doe, John",30,1993-01-15,true'

      const result = validationService.validateContent(csvContent)

      expect(result.processedRows).toHaveLength(1)
      expect(result.processedRows[0].name).toBe("Doe, John")
    })

    it("should handle escaped quotes in fields", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = 'name,age,birth_date,active\n"John ""Johnny"" Doe",30,1993-01-15,true'

      const result = validationService.validateContent(csvContent)

      expect(result.processedRows).toHaveLength(1)
      expect(result.processedRows[0].name).toBe('John "Johnny" Doe')
    })

    it("should handle different delimiters", () => {
      const semicolonConfig = { ...mockConfig, delimiter: ";" }
      const validationService = new ValidationService(semicolonConfig, mockColumns)
      const csvContent = "name;age;birth_date;active\nJohn Doe;30;1993-01-15;true"

      const result = validationService.validateContent(csvContent)

      expect(result.processedRows).toHaveLength(1)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe("Error Reporting", () => {
    it("should provide detailed error information", () => {
      const validationService = new ValidationService(mockConfig, mockColumns)
      const csvContent = "name,age,birth_date,active\n,invalid,bad-date,maybe"

      const result = validationService.validateContent(csvContent)

      const errors = result.errors
      expect(errors.length).toBeGreaterThan(0)

      errors.forEach((error) => {
        expect(error).toHaveProperty("code")
        expect(error).toHaveProperty("message")
        expect(error).toHaveProperty("row")
        expect(error).toHaveProperty("line")
        expect(error).toHaveProperty("column")
      })
    })
  })
})
