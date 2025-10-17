"use client"

import {useState, useEffect} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent} from "@/components/ui/card"
import {AlertTriangle, CheckCircle, Info} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/components/ui/use-toast"
import {Can} from "@/lib/casl/permissions-provider";

interface ForecastAnomaliesProps {
    forecastId: string
}

type Anomaly = {
    id: string
    productName: string
    sku: string
    category: string
    anomalyType: string
    severity: string
    description: string
    date: string
    forecastValue: number
    expectedRange: string
    acknowledged?: boolean
    acknowledgedAt?: string
    acknowledgedNote?: string
}

export function ForecastAnomalies({forecastId}: ForecastAnomaliesProps) {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([])
    const [loading, setLoading] = useState(true)
    const [acknowledgeDialogOpen, setAcknowledgeDialogOpen] = useState(false)
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
    const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
    const [acknowledgeNote, setAcknowledgeNote] = useState("")
    const {toast} = useToast()

    useEffect(() => {
        // Simulate API call to fetch anomalies
        setLoading(true)
        setTimeout(() => {
            // Mock data for anomalies
            const mockAnomalies = [
                {
                    id: "anom-1",
                    productName: "Paracetamol",
                    sku: "PHARM-2001",
                    category: "Pharmaceuticals",
                    anomalyType: "spike",
                    severity: "high",
                    description: "Unusual 150% increase compared to historical trend",
                    date: "Mar 2025",
                    forecastValue: 1250,
                    expectedRange: "400-600",
                    acknowledged: false,
                },
                {
                    id: "anom-2",
                    productName: "Amoxicillin",
                    sku: "PHARM-2002",
                    category: "Pharmaceuticals",
                    anomalyType: "drop",
                    severity: "medium",
                    description: "Unexpected 40% decrease from previous month",
                    date: "Feb 2025",
                    forecastValue: 320,
                    expectedRange: "500-700",
                    acknowledged: false,
                },
                {
                    id: "anom-3",
                    productName: "Ibuprofen",
                    sku: "PHARM-2003",
                    category: "Pharmaceuticals",
                    anomalyType: "inconsistent",
                    severity: "low",
                    description: "Inconsistent with seasonal pattern from previous years",
                    date: "Apr 2025",
                    forecastValue: 850,
                    expectedRange: "700-900",
                    acknowledged: true,
                    acknowledgedAt: "2025-04-16T14:30:00Z",
                    acknowledgedNote: "This is expected due to seasonal flu patterns changing this year.",
                },
                {
                    id: "anom-4",
                    productName: "Metformin",
                    sku: "PHARM-2005",
                    category: "Pharmaceuticals",
                    anomalyType: "spike",
                    severity: "medium",
                    description: "Unusual increase compared to similar products",
                    date: "Jan 2025",
                    forecastValue: 980,
                    expectedRange: "600-800",
                    acknowledged: false,
                },
                {
                    id: "anom-5",
                    productName: "Salbutamol",
                    sku: "PHARM-2007",
                    category: "Pharmaceuticals",
                    anomalyType: "drop",
                    severity: "high",
                    description: "Significant drop despite increasing trend in previous months",
                    date: "Feb 2025",
                    forecastValue: 210,
                    expectedRange: "450-650",
                    acknowledged: true,
                    acknowledgedAt: "2025-04-17T09:15:00Z",
                    acknowledgedNote: "We are phasing out this product and replacing it with a newer alternative.",
                },
            ]

            setAnomalies(mockAnomalies)
            setLoading(false)
        }, 1000)
    }, [forecastId])

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "medium":
                return "bg-amber-100 text-amber-800 hover:bg-amber-200"
            case "low":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const getAnomalyTypeIcon = (type: string) => {
        switch (type) {
            case "spike":
                return <AlertTriangle className="h-4 w-4 text-red-600"/>
            case "drop":
                return <AlertTriangle className="h-4 w-4 text-amber-600"/>
            case "inconsistent":
                return <Info className="h-4 w-4 text-blue-600"/>
            default:
                return <Info className="h-4 w-4"/>
        }
    }

    const handleAcknowledge = (anomaly: Anomaly) => {
        setSelectedAnomaly(anomaly)
        setAcknowledgeNote("")
        setAcknowledgeDialogOpen(true)
    }

    const handleViewDetails = (anomaly: Anomaly) => {
        setSelectedAnomaly(anomaly)
        setDetailsDialogOpen(true)
    }

    const confirmAcknowledge = () => {
        if (!selectedAnomaly) return

        const updatedAnomalies = anomalies.map((anomaly) => {
            if (anomaly.id === selectedAnomaly.id) {
                return {
                    ...anomaly,
                    acknowledged: true,
                    acknowledgedAt: new Date().toISOString(),
                    acknowledgedNote: acknowledgeNote.trim() || undefined,
                }
            }
            return anomaly
        })

        setAnomalies(updatedAnomalies)
        setAcknowledgeDialogOpen(false)

        toast({
            title: "Anomaly acknowledged",
            description: `You have acknowledged the anomaly for ${selectedAnomaly.productName}.`,
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                        Anomalies are detected by comparing your forecast with historical patterns, seasonal trends, and
                        similar
                        products. Review these potential issues to improve forecast accuracy.
                    </p>
                </CardContent>
            </Card>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Forecast Value</TableHead>
                            <TableHead className="text-right">Expected Range</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {anomalies.length > 0 ? (
                            anomalies.map((anomaly) => (
                                <TableRow key={anomaly.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getAnomalyTypeIcon(anomaly.anomalyType)}
                                            <span className="capitalize">{anomaly.anomalyType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{anomaly.productName}</div>
                                            <div className="text-xs text-muted-foreground">{anomaly.sku}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{anomaly.date}</TableCell>
                                    <TableCell>{anomaly.description}</TableCell>
                                    <TableCell
                                        className="text-right">{anomaly.forecastValue.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{anomaly.expectedRange}</TableCell>
                                    <TableCell>
                                        <Badge className={getSeverityColor(anomaly.severity)} variant="outline">
                                            {anomaly.severity.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {anomaly.acknowledged ? (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="h-4 w-4"/>
                                                <span className="text-xs">Acknowledged</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Can I="read" a="Forecast">
                                            {anomaly.acknowledged ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs"
                                                    onClick={() => handleViewDetails(anomaly)}
                                                >
                                                    View Details
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs"
                                                    onClick={() => handleAcknowledge(anomaly)}
                                                >
                                                    Acknowledge
                                                </Button>
                                            )}
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No anomalies detected.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Acknowledge Dialog */}
            <Dialog open={acknowledgeDialogOpen} onOpenChange={setAcknowledgeDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Acknowledge Anomaly</DialogTitle>
                        <DialogDescription>
                            You are acknowledging an anomaly for {selectedAnomaly?.productName} ({selectedAnomaly?.sku}).
                            This will be
                            recorded and visible to Rafed administrators.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Anomaly Details</h4>
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p>
                                    <span className="font-medium">Type:</span> {selectedAnomaly?.anomalyType}
                                </p>
                                <p>
                                    <span className="font-medium">Description:</span> {selectedAnomaly?.description}
                                </p>
                                <p>
                                    <span
                                        className="font-medium">Forecast Value:</span> {selectedAnomaly?.forecastValue.toLocaleString()}
                                </p>
                                <p>
                                    <span
                                        className="font-medium">Expected Range:</span> {selectedAnomaly?.expectedRange}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="note" className="text-sm font-medium">
                                Add a note (optional)
                            </label>
                            <Textarea
                                id="note"
                                placeholder="Explain why this anomaly is expected or how you plan to address it..."
                                value={acknowledgeNote}
                                onChange={(e) => setAcknowledgeNote(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAcknowledgeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmAcknowledge}>Acknowledge Anomaly</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Acknowledgement Details</DialogTitle>
                        <DialogDescription>
                            Details of the acknowledgement for {selectedAnomaly?.productName} ({selectedAnomaly?.sku}).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Anomaly Information</h4>
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    <span className="capitalize">{selectedAnomaly?.anomalyType}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Severity:</span>{" "}
                                    <span className="uppercase">{selectedAnomaly?.severity}</span>
                                </p>
                                <p>
                                    <span className="font-medium">Description:</span> {selectedAnomaly?.description}
                                </p>
                                <p>
                                    <span
                                        className="font-medium">Forecast Value:</span> {selectedAnomaly?.forecastValue.toLocaleString()}
                                </p>
                                <p>
                                    <span
                                        className="font-medium">Expected Range:</span> {selectedAnomaly?.expectedRange}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Acknowledgement Information</h4>
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p>
                                    <span className="font-medium">Acknowledged On:</span>{" "}
                                    {selectedAnomaly?.acknowledgedAt ? new Date(selectedAnomaly.acknowledgedAt).toLocaleString() : "N/A"}
                                </p>
                                <div className="mt-2">
                                    <span className="font-medium">Note:</span>
                                    <p className="mt-1">
                                        {selectedAnomaly?.acknowledgedNote ? selectedAnomaly.acknowledgedNote : "No note provided."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
