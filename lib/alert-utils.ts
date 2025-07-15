import { alertStatusEnum } from "@/lib/db/schema"

export const getAlertStatuses = () => {
    return alertStatusEnum.enumValues
}

export const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, { label: string; description: string }> = {
        active: { label: "Active", description: "Alert is currently active" },
        acknowledged: { label: "Acknowledged", description: "Alert has been acknowledged" },
        resolved: { label: "Resolved", description: "Alert has been resolved" },
        snoozed: { label: "Snoozed", description: "Alert is temporarily hidden" },
        dismissed: { label: "Dismissed", description: "Alert has been dismissed" },
    }

    return statusLabels[status] || { label: status, description: "" }
}

export const getStatusOptions = () => {
    return getAlertStatuses().map((status) => ({
        value: status,
        ...getStatusLabel(status),
    }))
}
