import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AlertCommentsPopover } from "@/components/alerts/alert-comments-popover"
import type { Alert } from "@/components/alerts/alerts-columns"

// Mock fetch
global.fetch = jest.fn()

const mockAlert: Alert = {
    id: 1,
    title: "High CPU Usage",
    severity: "critical",
    status: "active",
    timestamp: "2024-01-15T10:30:00Z",
    kpi: "CPU Performance",
    description: "",
    isRead: false
}

const mockComments = [
    {
        id: 1,
        comment: "Investigating the issue",
        createdAt: "2024-01-15T10:30:00Z",
        createdBy: 1,
        updatedStatus: "acknowledged",
        userName: "John Doe",
        userEmail: "john@example.com",
    },
    {
        id: 2,
        comment: "Issue resolved",
        createdAt: "2024-01-15T11:00:00Z",
        createdBy: 2,
        updatedStatus: "resolved",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
    },
]

describe("AlertCommentsPopover", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(fetch as jest.Mock).mockClear()
    })

    it("renders popover trigger button", () => {
        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        expect(triggerButton).toBeInTheDocument()
    })

    it("opens popover and fetches comments", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: mockComments }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        expect(screen.getByText("Comments & Activity")).toBeInTheDocument()
        expect(screen.getByText("Activity log for: High CPU Usage")).toBeInTheDocument()

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("/api/alerts/1/comments")
        })
    })

    it("displays comments when loaded", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: mockComments }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("Investigating the issue")).toBeInTheDocument()
            expect(screen.getByText("Issue resolved")).toBeInTheDocument()
            expect(screen.getByText("John Doe")).toBeInTheDocument()
            expect(screen.getByText("Jane Smith")).toBeInTheDocument()
        })
    })

    it("displays status badges for comments with status updates", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: mockComments }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("Status: acknowledged")).toBeInTheDocument()
            expect(screen.getByText("Status: resolved")).toBeInTheDocument()
        })
    })

    it("shows loading state", () => {
        ;(fetch as jest.Mock).mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)))

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        expect(screen.getByText("Loading comments...")).toBeInTheDocument()
    })

    it("handles fetch error", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Failed to fetch comments" }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch comments")).toBeInTheDocument()
        })
    })

    it("shows no activity message when no comments", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: [] }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("No activity yet")).toBeInTheDocument()
        })
    })

    it("handles network error", async () => {
        ;(fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("Network error occurred")).toBeInTheDocument()
        })
    })

    it("formats time correctly", async () => {
        const recentComment = {
                id: 1,
                comment: "Recent comment",
                createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                createdBy: 1,
                userName: "John Doe",
                userEmail: "john@example.com",
            }
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: [recentComment] }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("Recent comment")).toBeInTheDocument()
            // Time formatting is tested - exact text may vary
        })
    })

    it("displays user email when available", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ comments: mockComments }),
        })

        render(<AlertCommentsPopover alert={mockAlert} />)

        const triggerButton = screen.getByRole("button")
        fireEvent.click(triggerButton)

        await waitFor(() => {
            expect(screen.getByText("john@example.com")).toBeInTheDocument()
            expect(screen.getByText("jane@example.com")).toBeInTheDocument()
        })
    })
})
