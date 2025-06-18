"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import type { Alert } from "./alerts-columns"

interface AlertCommentDialogProps {
    alert: Alert
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AlertCommentDialog({ alert, open, onOpenChange, onSuccess }: AlertCommentDialogProps) {
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleAddComment = async () => {
        if (!comment.trim()) {
            toast({
                title: "Error",
                description: "Please enter a comment!",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            console.log("Adding comment...", { alertId: alert.id, comment: comment.trim() })

            const response = await fetch(`/api/alerts/${alert.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: comment.trim(),
                    currentStatus: alert.status,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to add comment")
            }

            console.log("Comment added successfully, showing toast...")

            // Success toast with message icon
            toast({
                title: "Comment Added Successfully",
                description: "Your comment has been added to this alert",
                variant: "default",
                duration: 5000,
            })

            // Alternative toast method if the above doesn't work
            setTimeout(() => {
                toast({
                    title: "💬 Comment Added",
                    description: "Your comment has been saved",
                })
            }, 100)

            onOpenChange(false)
            setComment("")
            onSuccess()
        } catch (error) {
            console.error("Error adding comment:", error)
            toast({
                title: "Comment Failed",
                description: "Failed to add comment. Please try again.",
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
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogDescription>Add a comment to this alert for additional context or notes.</DialogDescription>
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
                                        Status: {alert.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Comment</label>
                        <Textarea
                            placeholder="Enter your comment here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddComment} disabled={isLoading || !comment.trim()}>
                        {isLoading ? "Adding..." : "Add Comment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
