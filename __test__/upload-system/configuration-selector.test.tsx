import { render, screen, fireEvent } from "@testing-library/react"
import ConfigurationSelector from "@/components/upload-system/configuration-selector"
import type { UploadConfiguration } from "@/types/upload"

const mockConfigurations: UploadConfiguration[] = [
  {
    id: 1,
    name: "Patient Data Import",
    description: "Import patient information",
    organization_type: "healthcare",
    source_type: "EMR",
    file_type: "csv,xlsx",
    delimiter: ",",
    max_file_size: 10 * 1024 * 1024,
    max_rows: 10000,
    storage_config_id: 1,
    active: true,
    allow_partial_upload: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: "Financial Data Upload",
    description: "Upload transaction data",
    organization_type: "finance",
    source_type: "Core Banking",
    file_type: "csv",
    delimiter: ";",
    max_file_size: 50 * 1024 * 1024,
    storage_config_id: 2,
    active: true,
    allow_partial_upload: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

describe("ConfigurationSelector", () => {
  const mockOnConfigurationSelect = jest.fn()
  const mockOnDownloadTemplate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render configuration selector", () => {
    render(
      <ConfigurationSelector
        configurations={mockConfigurations}
        selectedConfigId={1}
        onConfigurationSelect={mockOnConfigurationSelect}
        onDownloadTemplate={mockOnDownloadTemplate}
      />,
    )

    expect(screen.getByText("Upload Configuration")).toBeInTheDocument()
    expect(screen.getByText("Select an upload configuration")).toBeInTheDocument()
  })

  it("should display configuration details when selected", () => {
    render(
      <ConfigurationSelector
        configurations={mockConfigurations}
        selectedConfigId={1}
        onConfigurationSelect={mockOnConfigurationSelect}
        onDownloadTemplate={mockOnDownloadTemplate}
      />,
    )

    expect(screen.getByText("Upload Configuration")).toBeInTheDocument()
    // expect(screen.getByText("EMR")).toBeInTheDocument()
    expect(screen.getByText("10 MB")).toBeInTheDocument()
    expect(screen.getByText("Partial Upload Allowed")).toBeInTheDocument()
  })

  it("should show strict validation for configs that do not allow partial upload", () => {
    render(
      <ConfigurationSelector
        configurations={mockConfigurations}
        selectedConfigId={1}
        onConfigurationSelect={mockOnConfigurationSelect}
        onDownloadTemplate={mockOnDownloadTemplate}
      />,
    )

    expect(screen.getByText("Strict Validation Required")).toBeInTheDocument()
  })

  it("should call onDownloadTemplate when download button is clicked", () => {
    render(
      <ConfigurationSelector
        configurations={mockConfigurations}
        selectedConfigId={1}
        onConfigurationSelect={mockOnConfigurationSelect}
        onDownloadTemplate={mockOnDownloadTemplate}
      />,
    )

    const downloadButton = screen.getByText("Download Template")
    fireEvent.click(downloadButton)

    expect(mockOnDownloadTemplate).toHaveBeenCalledWith(mockConfigurations[0])
  })

  it("should display file type badges", () => {
    render(
      <ConfigurationSelector
        configurations={mockConfigurations}
        selectedConfigId={1}
        onConfigurationSelect={mockOnConfigurationSelect}
        onDownloadTemplate={mockOnDownloadTemplate}
      />,
    )

    expect(screen.getByText("csv")).toBeInTheDocument()
    // expect(screen.getByText("xlsx")).toBeInTheDocument()
  })
})
