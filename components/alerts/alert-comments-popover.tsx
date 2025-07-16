"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    MessageCircle,
    User,
    Clock,
    AlertCircle,
    Shield,
    CheckCircle,
    XCircle,
    Pause,
    AlertTriangle,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "./alerts-columns"

interface Comment {
    id: number
    comment: string
    createdAt: string
    createdBy: number
    updatedStatus?: string | null
    userName?: string
    userEmail?: string
}

interface AlertCommentsPopoverProps {
    alert: Alert
}

export function AlertCommentsPopover({ alert }: Readonly<AlertCommentsPopoverProps>) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchComments = async () => {
        if (!isOpen) return

        setIsLoading(true)
        setError(null)

        try {
            console.log("Fetching comments for alert:", alert.id)

            const response = await fetch(`/api/alerts/${alert.id}/comments`)
            const data = await response.json()

            console.log("Response:", response.status, data)

            if (response.ok) {
                setComments(Array.isArray(data.comments) ? data.comments : [])
            } else {
                setError(data.error || "Failed to fetch comments")
                console.error("API Error:", data)
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
            setError("Network error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchComments()
        }
    }, [isOpen, alert.id])

    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

            if (diffInHours < 1) return "Just now"
            if (diffInHours < 24) return `${diffInHours}h ago`
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays}d ago`
        } catch {
            return "Unknown time"
        }
    }

    const getStatusIcon = (status: string | null | undefined) => {
        if (!status) return null

        switch (status) {
            case "active":
                return <AlertTriangle className="h-3 w-3 text-red-500" />
            case "acknowledged":
                return <Shield className="h-3 w-3 text-blue-500" />
            case "resolved":
                return <CheckCircle className="h-3 w-3 text-green-500" />
            case "dismissed":
                return <XCircle className="h-3 w-3 text-gray-500" />
            case "snoozed":
                return <Pause className="h-3 w-3 text-yellow-500" />
            default:
                return <AlertCircle className="h-3 w-3 text-gray-400" />
        }
    }

    const getStatusColor = (status: string | null | undefined) => {
        if (!status) return "secondary"

        switch (status) {
            case "active":
                return "destructive"
            case "acknowledged":
                return "default"
            case "resolved":
                return "secondary"
            case "dismissed":
                return "outline"
            case "snoozed":
                return "secondary"
            default:
                return "secondary"
        }
    }

    // ✅ Remplace les ternaires imbriqués par des conditions claires
    let content
    if (isLoading) {
        content = (
            <div className="flex items-center justify-center py-4">
                <div className="text-sm text-muted-foreground">Loading comments...</div>
            </div>
        )
    } else if (error) {
        content = (
            <div className="flex items-center justify-center py-4 space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div className="text-sm text-red-500">{error}</div>
            </div>
        )
    } else if (comments.length === 0) {
        content = (
            <div className="flex items-center justify-center py-4">
                <div className="text-sm text-muted-foreground">No activity yet</div>
            </div>
        )
    } else {
        content = (
            <ScrollArea className="h-80">
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="space-y-3 p-3 rounded-lg bg-muted/50 border">
                            {/* Header with user info and timestamp */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <User className="h-3 w-3" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">{comment.userName ?? "Unknown User"}</span>
                                        {comment.userEmail && (
                                            <span className="text-xs text-muted-foreground">{comment.userEmail}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(comment.createdAt)}
                                </div>
                            </div>

                            {/* Status badge if present */}
                            {comment.updatedStatus && (
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(comment.updatedStatus)}
                                    <Badge variant={getStatusColor(comment.updatedStatus)} className="text-xs">
                                        Status: {comment.updatedStatus}
                                    </Badge>
                                </div>
                            )}

                            {/* Comment text */}
                            <p className="text-sm leading-relaxed">{comment.comment}</p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        )
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
                <div className="space-y-3">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Comments & Activity</h4>
                        <p className="text-sm text-muted-foreground">
                            Activity log for: {alert.title || `Alert ${alert.id}`}
                        </p>
                    </div>

                    <Separator />

                    {content}
                </div>
            </PopoverContent>
        </Popover>
    )
}
