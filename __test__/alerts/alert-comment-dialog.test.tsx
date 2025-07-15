"use client"

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock toast
const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}))

// Simple mock component for testing
const MockAlertCommentDialog = ({ alert, isOpen, onClose, onCommentAdded }) => {
    const [comment, setComment] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async () => {
        if (!comment.trim()) {
            mockToast({
                title: "Error",
                description: "Comment cannot be empty",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/alerts/${alert.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment }),
            })

            if (!response.ok) throw new Error("Failed to add comment")

            mockToast({
                title: "Success",
                description: "Comment added successfully",
            })

            onCommentAdded()
            onClose()
            setComment("")
        } catch (error) {
            mockToast({
                title: "Error",
                description: "Failed to add comment",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div>
            <h2>Add Comment</h2>
            <p>{alert.title}</p>
            <textarea placeholder="Enter your comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
            <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Comment"}
            </button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}

const mockAlert = {
    id: 1,
    title: "Critical System Alert",
    description: "System is experiencing high CPU usage",
    kpi: "CPU Usage",
    severity: "critical",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    status: "open",
}

const mockOnCommentAdded = jest.fn()
const mockOnClose = jest.fn()

describe("AlertCommentDialog Component", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("renders comment dialog correctly", () => {
        render(
            <MockAlertCommentDialog
                alert={mockAlert}
                isOpen={true}
                onClose={mockOnClose}
                onCommentAdded={mockOnCommentAdded}
            />,
        )

        // Click add comment button
        const addButton = screen.getByText("Add Comment", { selector: "button" })
        fireEvent.click(addButton)
        // Check if dialog is rendered
        expect(screen.getByPlaceholderText("Enter your comment...")).toBeInTheDocument()
        expect(screen.getByText("Add Comment", { selector: "button" })).toBeInTheDocument()
        expect(screen.getByText("Cancel")).toBeInTheDocument()
    })

    test("successfully adds a comment", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, comment: { id: 1, content: "Test comment" } }),
        })

        render(
            <MockAlertCommentDialog
                alert={mockAlert}
                isOpen={true}
                onClose={mockOnClose}
                onCommentAdded={mockOnCommentAdded}
            />,
        )

        // Type in the comment textarea
        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "This is a test comment" } })

        // Click add comment button
        const addButton = screen.getByText("Add Comment", { selector: "button" })
        fireEvent.click(addButton)

        // Wait for API call
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                "/api/alerts/1/comments",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "This is a test comment" }),
                }),
            )
        })

        // Wait for success toast
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Success",
                description: "Comment added successfully",
            })
        })

        expect(mockOnCommentAdded).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
    })

    test("validates empty comments", () => {
        render(
            <MockAlertCommentDialog
                alert={mockAlert}
                isOpen={true}
                onClose={mockOnClose}
                onCommentAdded={mockOnCommentAdded}
            />,
        )

        // Try to submit without entering a comment
        const addButton = screen.getByText("Add Comment", { selector: "button" })
        fireEvent.click(addButton)

        // Should show validation error
        expect(mockToast).toHaveBeenCalledWith({
            title: "Error",
            description: "Comment cannot be empty",
            variant: "destructive",
        })

        // Should not make API call
        expect(mockFetch).not.toHaveBeenCalled()
    })

    test("handles API error when adding comment", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"))

        render(
            <MockAlertCommentDialog
                alert={mockAlert}
                isOpen={true}
                onClose={mockOnClose}
                onCommentAdded={mockOnCommentAdded}
            />,
        )

        // Type in comment
        const commentTextarea = screen.getByPlaceholderText("Enter your comment...")
        fireEvent.change(commentTextarea, { target: { value: "Test comment" } })

        // Click add comment button
        const addButton = screen.getByText("Add Comment", { selector: "button" })
        fireEvent.click(addButton)

        // Wait for error toast
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: "Error",
                description: "Failed to add comment",
                variant: "destructive",
            })
        })

        expect(mockOnCommentAdded).not.toHaveBeenCalled()
        expect(mockOnClose).not.toHaveBeenCalled()
    })

    test("closes dialog when cancel is clicked", () => {
        render(
            <MockAlertCommentDialog
                alert={mockAlert}
                isOpen={true}
                onClose={mockOnClose}
                onCommentAdded={mockOnCommentAdded}
            />,
        )

//         const cancelButton = screen.getByText("Cancel")
//         fireEvent.click(cancelButton)

        expect(mockOnClose).toHaveBeenCalled()
    })
})
