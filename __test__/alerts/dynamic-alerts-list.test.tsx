// import { render, screen, waitFor } from "@testing-library/react"
// import { DynamicAlertsList } from "@/components/alerts/dynamic-alerts-list"
// import jest from "jest-mock"

// // Mock fetch
// global.fetch = jest.fn()

// const mockAlerts = [
//     {
//         id: 1,
//         status: "active",
//         severity: "critical",
//         triggeredAt: "2024-01-15T10:30:00Z",
//         resolvedAt: null,
//         templateName: "High CPU Usage Alert",
//         templateMessage: "CPU usage is above threshold",
//         kpiName: "CPU Performance",
//         hydratedMessage: "CPU usage is at 95% which is above the 80% threshold",
//         fieldValues: { threshold: "80%", current: "95%" },
//     },
//     {
//         id: 2,
//         status: "resolved",
//         severity: "warning",
//         triggeredAt: "2024-01-15T09:15:00Z",
//         resolvedAt: "2024-01-15T10:00:00Z",
//         templateName: "Memory Warning",
//         templateMessage: "Memory usage is elevated",
//         kpiName: "Memory Usage",
//         hydratedMessage: "Memory usage is at 75% which is above the 70% warning threshold",
//         fieldValues: { threshold: "70%", current: "75%" },
//     },
// ]

// describe("DynamicAlertsList", () => {
//     beforeEach(() => {
//         jest.clearAllMocks()
//         ;(fetch as jest.Mock).mockClear()
//     })

//     it("renders loading state initially", () => {
//         ;(fetch as jest.Mock).mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)))

//         render(<DynamicAlertsList />)

//         expect(screen.getAllByTestId("skeleton")).toHaveLength(5)
//     })

//     it("fetches and displays alerts", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => mockAlerts,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("High CPU Usage Alert")).toBeInTheDocument()
//             expect(screen.getByText("Memory Warning")).toBeInTheDocument()
//         })

//         expect(fetch).toHaveBeenCalledWith("/api/alerts")
//     })

//     it("displays alert severity badges", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => mockAlerts,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("critical")).toBeInTheDocument()
//             expect(screen.getByText("warning")).toBeInTheDocument()
//         })
//     })

//     it("displays KPI information", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => mockAlerts,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("KPI: CPU Performance")).toBeInTheDocument()
//             expect(screen.getByText("KPI: Memory Usage")).toBeInTheDocument()
//         })
//     })

//     it("displays hydrated messages", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => mockAlerts,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("CPU usage is at 95% which is above the 80% threshold")).toBeInTheDocument()
//             expect(screen.getByText("Memory usage is at 75% which is above the 70% warning threshold")).toBeInTheDocument()
//         })
//     })

//     it("handles fetch error", async () => {
//         ;(fetch as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch alerts"))

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("Error Loading Alerts")).toBeInTheDocument()
//             expect(screen.getByText("Failed to fetch alerts")).toBeInTheDocument()
//         })
//     })

//     it("handles API error response", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: false,
//             status: 500,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("Error Loading Alerts")).toBeInTheDocument()
//             expect(screen.getByText("Failed to fetch alerts")).toBeInTheDocument()
//         })
//     })

//     it("shows no alerts message when empty", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => [],
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("No Active Alerts")).toBeInTheDocument()
//             expect(screen.getByText("All systems are running smoothly")).toBeInTheDocument()
//         })
//     })

//     it("formats time ago correctly", async () => {
//         const recentAlert = {
//                 ...mockAlerts[0],
//                 triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
//             }
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => [recentAlert],
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             expect(screen.getByText("2 hours ago")).toBeInTheDocument()
//         })
//     })

//     it("displays cards as clickable", async () => {
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => mockAlerts,
//         })

//         render(<DynamicAlertsList />)

//         await waitFor(() => {
//             const cards = screen.getAllByRole("generic")
//             const clickableCards = cards.filter((card) => card.className.includes("cursor-pointer"))
//             expect(clickableCards.length).toBeGreaterThan(0)
//         })
//     })
// })
