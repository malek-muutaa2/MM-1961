"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { getStatusOptions } from "@/lib/alert-utils"
import type { Alert } from "./alerts-columns"

interface AlertStatusUpdateDialogProps {
    alert: Alert
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

interface StatusOption {
    value: string
    label: string
    description: string
}

export function AlertStatusUpdateDialog({ alert, open, onOpenChange, onSuccess }: AlertStatusUpdateDialogProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [comment, setComment] = useState("")
    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOptions, setIsLoadingOptions] = useState(true)
    const { toast } = useToast()

    // Récupérer les options de statut à partir de l'enum de la base de données
    useEffect(() => {
        const fetchStatusOptions = async () => {
            try {
                // Option 1: Utiliser l'API
                const response = await fetch("/api/alerts/status-options")
                if (response.ok) {
                    const data = await response.json()
                    setStatusOptions(data.statusOptions)
                } else {
                    // Option 2: Fallback vers l'enum local si l'API échoue
                    const localOptions = getStatusOptions()
                    setStatusOptions(localOptions)
                }
            } catch (error) {
                console.error("Error fetching status options:", error)
                // Option 3: Utiliser l'enum local en cas d'erreur
                const localOptions = getStatusOptions()
                setStatusOptions(localOptions)
            } finally {
                setIsLoadingOptions(false)
            }
        }

        if (open) {
            fetchStatusOptions()
        }
    }, [open])

    const handleStatusUpdate = async () => {
        if (!selectedStatus) {
            toast({
                title: "Error",
                description: "Please select a status",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            console.log("Updating status...", { alertId: alert.id, status: selectedStatus })

            const response = await fetch(`/api/alerts/${alert.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: selectedStatus,
                    comment: comment.trim() || undefined,
                    currentStatus: alert.status,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update alert status")
            }

            const selectedOption = statusOptions.find((opt) => opt.value === selectedStatus)

            console.log("Status updated successfully, showing toast...")

            // Success toast with checkmark icon
            toast({
                title: "Status Updated Successfully",
                description: `Alert status changed from "${alert.status}" to "${selectedOption?.label || selectedStatus}"`,
                variant: "default",
                duration: 5000,
            })

            // Alternative toast method if the above doesn't work
            setTimeout(() => {
                toast({
                    title: "✅ Status Updated",
                    description: `Changed to ${selectedOption?.label || selectedStatus}`,
                })
            }, 100)

            onOpenChange(false)
            setSelectedStatus("")
            setComment("")
            onSuccess()
        } catch (error) {
            console.error("Error updating status:", error)
            toast({
                title: "Update Failed",
                description: "Failed to update alert status. Please try again.",
                variant: "destructive",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Alert Status</DialogTitle>
                    <DialogDescription>Change the status of this alert and optionally add a comment.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Alert Info */}
                    <div className="rounded-lg border p-3 bg-muted/50">
                        <div className="flex items-start space-x-2">
                            <div className="w-full">
                                <div className="font-medium text-sm">{alert.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">{alert.description}</div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant={
                                                alert.severity === "critical"
                                                    ? "destructive"
                                                    : alert.severity === "warning"
                                                        ? "default"
                                                        : "outline"
                                            }
                                            className="text-xs"
                                        >
                                            {alert.severity === "critical" ? (
                                                <AlertCircle className="mr-1 h-2 w-2" />
                                            ) : alert.severity === "warning" ? (
                                                <AlertTriangle className="mr-1 h-2 w-2" />
                                            ) : (
                                                <Info className="mr-1 h-2 w-2" />
                                            )}
                                            {alert.severity}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{alert.kpi}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                        Current: {alert.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Status</label>
                        {isLoadingOptions ? (
                            <div className="h-10 bg-muted animate-pulse rounded-md" />
                        ) : (
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions
                                        .filter((option) => option.value !== alert.status) // Ne pas afficher le statut actuel
                                        .map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div>
                                                    <div className="font-medium capitalize">{option.label}</div>
                                                    <div className="text-xs text-muted-foreground">{option.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Comment (Optional)</label>
                        <Textarea
                            placeholder="Add a comment about this status change..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate} disabled={isLoading || !selectedStatus || isLoadingOptions}>
                        {isLoading ? "Updating..." : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
