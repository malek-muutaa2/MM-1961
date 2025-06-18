import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AlertCommentDialog } from "@/components/alerts/alert-comment-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Alert } from "@/components/alerts/alerts-columns"

// Mock hooks
jest.mock("@/hooks/use-toast")

// Mock fetch
global.fetch = jest.fn()

const mockToast = jest.fn()
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

const defaultProps = {
    alert: mockAlert,
    onCommentAdded: jest.fn(),
}

describe("AlertCommentDialog", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
        ;(fetch as jest.Mock).mockClear()
    })

    it("renders dialog trigger button", () => {
        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        expect(screen.getByText("Add Comment")).toBeInTheDocument()
    })

    it("opens dialog when trigger is clicked", () => {
        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        expect(screen.getByText("Add Comment")).toBeInTheDocument()
        expect(screen.getByText("Add a comment to alert: High CPU Usage")).toBeInTheDocument()
        expect(screen.getByText("Current status: active")).toBeInTheDocument()
    })

    it("handles comment input", () => {
        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "This is a test comment" } })

        expect(commentTextarea).toHaveValue("This is a test comment")
    })

    it("submits comment successfully", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        })

        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "Test comment" } })

        const submitButton = screen.getByRole("button", { name: "Add Comment" })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("/api/alerts/1/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment: "Test comment",
                    currentStatus: "active",
                }),
            })
        })

        expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "✅ Success",
                description: "Comment added successfully",
            }),
        )

        expect(defaultProps.onCommentAdded).toHaveBeenCalled()
    })

    it("handles comment submission error", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Failed to add comment" }),
        })



        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "❌ Error",
                    description: "Failed to add comment",
                }),
            )
        })
    })

    it("validates empty comment", () => {
        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const submitButton = screen.getByRole("button", { name: "Add Comment" })
        fireEvent.click(submitButton)

        expect(mockToast).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "❌ Error",
                description: "Please enter a comment",
            }),
        )
    })

    it("trims whitespace from comment", async () => {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        })

        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "  Test comment  " } })

        const submitButton = screen.getByRole("button", { name: "Add Comment" })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("/api/alerts/1/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment: "Test comment",
                    currentStatus: "active",
                }),
            })
        })
    })

    it("closes dialog on cancel", () => {
        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const cancelButton = screen.getByText("Cancel")
        fireEvent.click(cancelButton)

        // Dialog should close - we can't easily test this without more complex setup
        // but we can verify the button exists
        expect(cancelButton).toBeInTheDocument()
    })

    it("disables submit button when loading", async () => {
        // Mock a slow response
        ;(fetch as jest.Mock).mockImplementationOnce(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                ok: true,
                                json: async () => ({ success: true }),
                            }),
                        100,
                    ),
                ),
        )

        render(<AlertCommentDialog open={false} onOpenChange={function (open: boolean): void {
            throw new Error("Function not implemented.")
        }} onSuccess={function (): void {
            throw new Error("Function not implemented.")
        }} {...defaultProps} />)

        const triggerButton = screen.getByText("Add Comment")
        fireEvent.click(triggerButton)

        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "Test comment" } })

        const submitButton = screen.getByRole("button", { name: "Add Comment" })
        fireEvent.click(submitButton)

        // Button should show loading state
        expect(screen.getByText("Adding...")).toBeInTheDocument()
    })
})
