import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertsDataTable } from "@/components/alerts/alerts-data-table"
import { createAlertsColumns } from "@/components/alerts/alerts-columns"
import type { Alert } from "@/components/alerts/alerts-columns"

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}))

// Mock use-debounce
jest.mock("use-debounce", () => ({
    useDebouncedCallback: jest.fn((fn) => fn),
}))

// Mock components
jest.mock("@/components/Spinner", () => ({
    LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
}

const mockSearchParams = {
    get: jest.fn(),
}

const mockAlerts: Alert[] = [
    {
        id: 1,
        title: "High CPU Usage",
        severity: "critical",
        status: "active",
        timestamp: "2024-01-15T10:30:00Z",
        kpi: "CPU Performance",
        description: "",
        isRead: false
    },
    {
        id: 2,
        title: "Memory Warning",
        severity: "warning",
        status: "acknowledged",
        timestamp: "2024-01-15T09:15:00Z",
        kpi: "Memory Usage",
        description: "",
        isRead: false
    },
    {
        id: 3,
        title: "System Info",
        severity: "info",
        status: "resolved",
        timestamp: "2024-01-15T08:00:00Z",
        kpi: "System Health",
        description: "",
        isRead: false
    },
]

const defaultProps = {
    columns: createAlertsColumns(),
    data: mockAlerts,
    pageNumber: 1,
    numberOfPages: 3,
    search: "",
    size: "10",
    column: "timestamp",
    pathname: "/alerts",
    order: "desc",
}

describe("AlertsDataTable", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
        ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
        mockSearchParams.get.mockReturnValue(null)
    })

    it("renders alerts table with data", () => {
        render(<AlertsDataTable {...defaultProps} />)

        expect(screen.getByText("High CPU Usage")).toBeInTheDocument()
        expect(screen.getByText("Memory Warning")).toBeInTheDocument()
        expect(screen.getByText("System Info")).toBeInTheDocument()
    })

    it("displays severity badges correctly", () => {
        render(<AlertsDataTable {...defaultProps} />)

        expect(screen.getByText("critical")).toBeInTheDocument()
        expect(screen.getByText("warning")).toBeInTheDocument()
        expect(screen.getByText("info")).toBeInTheDocument()
    })

    it("displays status badges correctly", () => {
        render(<AlertsDataTable {...defaultProps} />)

        expect(screen.getByText("active")).toBeInTheDocument()
        expect(screen.getByText("acknowledged")).toBeInTheDocument()
        expect(screen.getByText("resolved")).toBeInTheDocument()
    })

    it("handles search input", async () => {
        render(<AlertsDataTable {...defaultProps} />)

        const searchInput = screen.getByPlaceholderText("Search alerts...")
        fireEvent.change(searchInput, { target: { value: "CPU" } })

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalled()
        })
    })



    it("displays pagination correctly", () => {
        render(<AlertsDataTable {...defaultProps} />)

        expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    })

    it("handles pagination navigation", () => {
        render(<AlertsDataTable {...defaultProps} />)



        const nextButton = screen.getAllByRole("link", { name: /next/i })
        fireEvent.click(nextButton[0]) // ou [1], selon le bouton que tu veux


        const prevButton = screen.getByRole("link", { name: /previous/i })
        expect(prevButton).toBeInTheDocument()
    })

    it("shows no data message when alerts array is empty", () => {
        render(<AlertsDataTable {...defaultProps} data={[]} />)

        expect(screen.getByText("No alerts found")).toBeInTheDocument()
    })

    it("displays severity filter count badge", () => {
        mockSearchParams.get.mockImplementation((param) => {
            if (param === "severity") return "critical,warning"
            return null
        })

        render(<AlertsDataTable {...defaultProps} />)

        expect(screen.getByText("2")).toBeInTheDocument()
    })
})