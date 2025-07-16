"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MessageSquare, RefreshCw } from "lucide-react"
import { AlertCommentsPopover } from "@/components/alerts/alert-comments-popover"
import { AlertCommentDialog } from "@/components/alerts/alert-comment-dialog"
import { AlertStatusUpdateDialog } from "@/components/alerts/alert-status-update-dialog"
import type { Alert } from "@/components/alerts/alerts-columns"

interface AlertActionsCellProps {
    alert: Alert
    onDataChange?: () => void
}

export function AlertActionsCell({ alert, onDataChange }: Readonly<AlertActionsCellProps>) {
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [commentDialogOpen, setCommentDialogOpen] = useState(false)

    const handleSuccess = () => {
        if (onDataChange) onDataChange()
    }

    return (
        <>
            <div className="flex justify-end items-center space-x-1">
                <AlertCommentsPopover alert={alert} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setCommentDialogOpen(true)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Alert Status
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertStatusUpdateDialog
                alert={alert}
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                onSuccess={handleSuccess}
            />

            <AlertCommentDialog
                alert={alert}
                open={commentDialogOpen}
                onOpenChange={setCommentDialogOpen}
                onSuccess={handleSuccess}
            />
        </>
    )
}
