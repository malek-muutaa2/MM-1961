// import { render, screen, fireEvent, waitFor } from "@testing-library/react"
// import { AlertStatusUpdateDialog } from "@/components/alerts/alert-status-update-dialog"
// import { useToast } from "@/hooks/use-toast"
// import type { Alert } from "@/components/alerts/alerts-columns"

// // Mock hooks
// jest.mock("@/hooks/use-toast")

// // Mock fetch
// global.fetch = jest.fn()

// const mockToast = jest.fn()
// const mockAlert: Alert = {
//     id: 1,
//     title: "High CPU Usage",
//     severity: "critical",
//     status: "active",
//     timestamp: "2024-01-15T10:30:00Z",
//     kpi: "CPU Performance",
//     description: "",
//     isRead: false
// }

// const defaultProps = {
//     alert: mockAlert,
//     open: true,
//     onOpenChange: jest.fn(),
//     onSuccess: jest.fn(),
// }

// describe("AlertStatusUpdateDialog", () => {
//     beforeEach(() => {
//         jest.clearAllMocks()
//         ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
//         ;(fetch as jest.Mock).mockClear()
//     })

//     it("renders dialog with alert information", () => {
//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         expect(screen.getByText("Update Alert Status")).toBeInTheDocument()
//         expect(screen.getByText("High CPU Usage")).toBeInTheDocument()
//         expect(screen.getByText("critical")).toBeInTheDocument()
//         expect(screen.getByText("Current: active")).toBeInTheDocument()
//     })


//     it("handles status selection", async () => {
//         const mockStatusOptions = [{ value: "acknowledged", label: "Acknowledged", description: "Alert has been seen" }]
//         ;(fetch as jest.Mock).mockResolvedValueOnce({
//             ok: true,
//             json: async () => ({ statusOptions: mockStatusOptions }),
//         })

//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         await waitFor(() => {
//             expect(screen.getByText("Select a status")).toBeInTheDocument()
//         })

//         const selectTrigger = screen.getByRole("combobox")
//         fireEvent.click(selectTrigger)

//         await waitFor(() => {
//             const acknowledgedOption = screen.getByText("Acknowledged")
//             fireEvent.click(acknowledgedOption)
//         })
//     })

//     it("handles comment input", () => {
//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         const commentTextarea = screen.getByPlaceholderText("Add a comment about this status change...")
//         fireEvent.change(commentTextarea, { target: { value: "Investigating the issue" } })

//         expect(commentTextarea).toHaveValue("Investigating the issue")
//     })

//     it("submits status update successfully", async () => {
//         const mockStatusOptions = [{ value: "acknowledged", label: "Acknowledged", description: "Alert has been seen" }]
//         ;(fetch as jest.Mock)
//             .mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => ({ statusOptions: mockStatusOptions }),
//             })
//             .mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => ({ success: true }),
//             })

//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         // Wait for status options to load
//         await waitFor(() => {
//             expect(screen.getByText("Select a status")).toBeInTheDocument()
//         })

//         // Select status
//         const selectTrigger = screen.getByRole("combobox")
//         fireEvent.click(selectTrigger)

//         await waitFor(() => {
//             const acknowledgedOption = screen.getByText("Acknowledged")
//             fireEvent.click(acknowledgedOption)
//         })

//         // Add comment
//         const commentTextarea = screen.getByPlaceholderText("Add a comment about this status change...")
//         fireEvent.change(commentTextarea, { target: { value: "Test comment" } })

//         // Submit
//         const updateButton = screen.getByText("Update Status")
//         fireEvent.click(updateButton)

//         await waitFor(() => {
//             expect(fetch).toHaveBeenCalledWith("/api/alerts/1/status", {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     status: "acknowledged",
//                     comment: "Test comment",
//                     currentStatus: "active",
//                 }),
//             })
//         })

//         expect(mockToast).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 title: "Status Updated Successfully",
//             }),
//         )
//     })

//     it("handles update error", async () => {
//         const mockStatusOptions = [{ value: "acknowledged", label: "Acknowledged", description: "Alert has been seen" }]
//         ;(fetch as jest.Mock)
//             .mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => ({ statusOptions: mockStatusOptions }),
//             })
//             .mockResolvedValueOnce({
//                 ok: false,
//                 json: async () => ({ error: "Update failed" }),
//             })

//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         // Wait for status options to load and select one
//         await waitFor(() => {
//             expect(screen.getByText("Select a status")).toBeInTheDocument()
//         })

//         const selectTrigger = screen.getByRole("combobox")
//         fireEvent.click(selectTrigger)

//         await waitFor(() => {
//             const acknowledgedOption = screen.getByText("Acknowledged")
//             fireEvent.click(acknowledgedOption)
//         })

//         // Submit
//         const updateButton = screen.getByText("Update Status")
//         fireEvent.click(updateButton)

//         await waitFor(() => {
//             expect(mockToast).toHaveBeenCalledWith(
//                 expect.objectContaining({
//                     title: "Update Failed",
//                     variant: "destructive",
//                 }),
//             )
//         })
//     })



//     it("closes dialog on cancel", () => {
//         render(<AlertStatusUpdateDialog {...defaultProps} />)

//         const cancelButton = screen.getByText("Cancel")
//         fireEvent.click(cancelButton)

//         expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
//     })
// })
