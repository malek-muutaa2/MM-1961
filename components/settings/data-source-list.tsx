"use client"

import { useState } from "react"
import { RefreshCw, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Sample data sources
const dataSources = [
  {
    id: "erp-system",
    name: "ERP System",
    type: "erp",
    status: "connected",
    lastSynced: "2 hours ago",
    metrics: 24,
  },
  {
    id: "inventory-management",
    name: "Inventory Management System",
    type: "inventory",
    status: "connected",
    lastSynced: "1 day ago",
    metrics: 18,
  },
  {
    id: "procurement-system",
    name: "Procurement System",
    type: "procurement",
    status: "error",
    lastSynced: "3 days ago",
    metrics: 12,
  },
  {
    id: "financial-system",
    name: "Financial System",
    type: "financial",
    status: "pending",
    lastSynced: "Never",
    metrics: 0,
  },
  {
    id: "salesforce",
    name: "Salesforce CRM",
    type: "crm",
    status: "connected",
    lastSynced: "30 minutes ago",
    metrics: 32,
  },
  {
    id: "ecri-database",
    name: "ECRI Database",
    type: "external",
    status: "connected",
    lastSynced: "6 hours ago",
    metrics: 15,
  },
  {
    id: "gs1-standards",
    name: "GS1 Standards",
    type: "external",
    status: "connected",
    lastSynced: "12 hours ago",
    metrics: 8,
  },
  {
    id: "supplier-data",
    name: "Supplier Inventory Data",
    type: "external",
    status: "connected",
    lastSynced: "4 hours ago",
    metrics: 22,
  },
]

export function DataSourceList() {
  const [sources, setSources] = useState(dataSources)
  const [refreshing, setRefreshing] = useState<string | null>(null)

  const handleRefresh = (id: string) => {
    setRefreshing(id)
    // Simulate refresh
    setTimeout(() => {
      setSources((prev) => prev.map((source) => (source.id === id ? { ...source, lastSynced: "Just now" } : source)))
      setRefreshing(null)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    setSources((prev) => prev.filter((source) => source.id !== id))
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Synced</TableHead>
            <TableHead>Metrics</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>{source.type}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    source.status === "connected" ? "default" : source.status === "error" ? "destructive" : "secondary"
                  }
                >
                  {source.status === "connected" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : source.status === "error" ? (
                    <XCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {source.status}
                </Badge>
              </TableCell>
              <TableCell>{source.lastSynced}</TableCell>
              <TableCell>{source.metrics}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRefresh(source.id)}
                    disabled={refreshing === source.id || source.status === "pending"}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing === source.id ? "animate-spin" : ""}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will disconnect the data source and remove all associated data. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(source.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
