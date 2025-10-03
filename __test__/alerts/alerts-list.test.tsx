import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { AlertsList } from "@/components/alerts/alerts-list"

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(() => null),
    }),
}))

// Mock toast
jest.mock("@/hooks/use-toast", () => ({
    useToast: () => ({
        toast: jest.fn(),
    }),
}))

const mockAlertsResponse = {
    alerts: [
        {
            id: 1,
            title: "Critical System Alert",
            description: "System is experiencing high CPU usage",
            kpi: "CPU Usage",
            severity: "critical",
            timestamp: "2024-01-15T10:30:00Z",
            isRead: false,
        },
        {
            id: 2,
            title: "Warning Memory Alert",
            description: "Memory usage is above threshold",
            kpi: "Memory Usage",
            severity: "warning",
            timestamp: "2024-01-15T09:15:00Z",
            isRead: true,
        },
    ],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 2,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    },
}

describe("AlertsList Component", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("renders alerts list with data successfully", async () => {
        // Mock successful API response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockAlertsResponse,
        })

        render(<AlertsList />)

        // Wait for the data to load and check if alerts are rendered
        await waitFor(
            () => {
                expect(screen.getByText("Critical System Alert")).toBeInTheDocument()
            },
            { timeout: 3000 },
        )

        expect(screen.getByText("Warning Memory Alert")).toBeInTheDocument()
        expect(screen.getByText("System is experiencing high CPU usage")).toBeInTheDocument()
        expect(screen.getByText("Memory usage is above threshold")).toBeInTheDocument()
        expect(screen.getByText("CPU Usage")).toBeInTheDocument()
        expect(screen.getByText("Memory Usage")).toBeInTheDocument()
    })

    test("displays loading state initially", async () => {
        // Mock delayed response
        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: async () => mockAlertsResponse,
                            }),
                        200,
                    ),
                ),
        )

        render(<AlertsList />)

        // Check that table is present (loading state shows table with skeleton)
        expect(screen.getByRole("table")).toBeInTheDocument()

        // Check for table headers
        expect(screen.getByText("Alert")).toBeInTheDocument()
        expect(screen.getByText("KPI")).toBeInTheDocument()
        expect(screen.getByText("Severity")).toBeInTheDocument()
        expect(screen.getByText("Time")).toBeInTheDocument()

        // Wait for data to load
        await waitFor(
            () => {
                expect(screen.getByText("Critical System Alert")).toBeInTheDocument()
            },
            { timeout: 3000 },
        )
    })


})
