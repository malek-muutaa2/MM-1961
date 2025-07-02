import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import EnhancedUploadInterface from "@/components/upload-system/enhanced-upload-interface"
import type { UploadConfiguration } from "@/types/upload"

// Mock fetch
global.fetch = jest.fn()

const mockConfigurations: UploadConfiguration[] = [
  {
    id: 1,
    name: "Test Configuration",
    description: "Test description",
    organization_type: "healthcare",
    source_type: "EMR",
    file_type: "csv",
    delimiter: ",",
    max_file_size: 10 * 1024 * 1024,
    storage_config_id: 1,
    active: true,
    allow_partial_upload: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

describe("EnhancedUploadInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  it("should render upload interface", () => {
    render(<EnhancedUploadInterface configurations={mockConfigurations} />)

    expect(screen.getByText("Upload Configuration")).toBeInTheDocument()
  })

  it("should show file upload section after configuration selection", () => {
    // render(<EnhancedUploadInterface configurations={mockConfigurations} />)
    // we have an  <ConfigurationSelector inside the EnhancedUploadInterface component and it should render the configuration selector


    // const select = screen.getByRole("combobox")
    const select = screen.findByRole('combobox', { name: /Choose Configuration/i }, { timeout: 3000 })

    const option = screen.getByText("Test Configuration 2")
    fireEvent.click(option)

    expect(screen.getByText("File Upload")).toBeInTheDocument()
    expect(screen.getByText("Drag and drop your file here")).toBeInTheDocument()
  })

  it("should handle file selection", () => {
    render(<EnhancedUploadInterface configurations={mockConfigurations} />)

    // Select configuration first
    const select = screen.getByRole("combobox")
    fireEvent.click(select)
    fireEvent.click(screen.getByText("Test Configuration"))

    // Create and select file
    const file = new File(["test,content"], "test.csv", { type: "text/csv" })
    const input = screen.getByRole("button", { name: /browse files/i })

    // Simulate file input change
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    expect(screen.getByText("test.csv")).toBeInTheDocument()
  })

  it("should handle successful upload", async () => {
    const mockResponse = {
      status: "success",
      operation_id: 1,
      processed_rows: 10,
      total_rows: 10,
    }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<EnhancedUploadInterface configurations={mockConfigurations} />)

    // Select configuration and file
    const select = screen.getByRole("combobox")
    fireEvent.click(select)
    fireEvent.click(screen.getByText("Test Configuration"))

    const file = new File(["test,content"], "test.csv", { type: "text/csv" })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)

    // Upload file
    const uploadButton = screen.getByText("Upload File")
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText("File uploaded successfully!")).toBeInTheDocument()
    })
  })

  it("should display validation errors", async () => {
    const mockResponse = {
      status: "partially_completed",
      operation_id: 1,
      processed_rows: 8,
      total_rows: 10,
      error: {
        code: "VALIDATION_ERRORS",
        message: "File processed with 5 validation errors",
        details: {
          row_level_errors: {
            total: 5,
            samples: [
              {
                code: "MISSING_REQUIRED_VALUE",
                message: "Name is required",
                column: "name",
                row: 2,
                line: 3,
                value: "",
              },
            ],
            all_errors: [
              {
                code: "MISSING_REQUIRED_VALUE",
                message: "Name is required",
                column: "name",
                row: 2,
                line: 3,
                value: "",
              },
            ],
          },
        },
      },
    }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<EnhancedUploadInterface configurations={mockConfigurations} />)

    // Select configuration and upload file
    const select = screen.getByRole("combobox")
    fireEvent.click(select)
    fireEvent.click(screen.getByText("Test Configuration"))

    const file = new File(["test,content"], "test.csv", { type: "text/csv" })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)

    const uploadButton = screen.getByText("Upload File")
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText("File uploaded with validation errors")).toBeInTheDocument()
      expect(screen.getByText("Validation Error Details")).toBeInTheDocument()
      expect(screen.getByText("MISSING_REQUIRED_VALUE")).toBeInTheDocument()
    })
  })

  it("should validate file type before upload", () => {
    render(<EnhancedUploadInterface configurations={mockConfigurations} />)

    // Mock alert
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})

    // Select configuration
    const select = screen.getByRole("combobox")
    fireEvent.click(select)
    fireEvent.click(screen.getByText("Test Configuration"))

    // Try to select invalid file type
    const file = new File(["test content"], "test.txt", { type: "text/plain" })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    })
    fireEvent.change(fileInput)

    expect(alertSpy).toHaveBeenCalledWith("File type not allowed. Allowed types: csv")

    alertSpy.mockRestore()
  })
})
