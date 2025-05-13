"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface ForecastProductTimelineProps {
  forecastId: string
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  unit: string
}

interface TimelineDataPoint {
  month: string
  actual: number | null
  forecast: number | null
  adjustedForecast: number | null
  date: string
}

export function ForecastProductTimeline({ forecastId }: ForecastProductTimelineProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("product1")
  const [products, setProducts] = useState<Product[]>([])
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineDataPoint | null>(null)
  const [newQuantity, setNewQuantity] = useState<number | "">("")

  useEffect(() => {
    // Simulate API call to fetch product list
    setTimeout(() => {
      const mockProducts = [
        { id: "product1", name: "Paracetamol", sku: "PHARM-1001", category: "Pharmaceuticals", unit: "Box" },
        { id: "product2", name: "Amoxicillin", sku: "PHARM-1002", category: "Pharmaceuticals", unit: "Box" },
        { id: "product3", name: "Ibuprofen", sku: "PHARM-1003", category: "Pharmaceuticals", unit: "Box" },
        { id: "product4", name: "Omeprazole", sku: "PHARM-1004", category: "Pharmaceuticals", unit: "Box" },
        { id: "product5", name: "Metformin", sku: "PHARM-1005", category: "Pharmaceuticals", unit: "Box" },
        { id: "product6", name: "Atorvastatin", sku: "PHARM-1006", category: "Pharmaceuticals", unit: "Box" },
        { id: "product7", name: "Salbutamol", sku: "PHARM-1007", category: "Pharmaceuticals", unit: "Box" },
        { id: "product8", name: "Fluoxetine", sku: "PHARM-1008", category: "Pharmaceuticals", unit: "Box" },
      ]
      setProducts(mockProducts)
    }, 500)
  }, [forecastId])

  useEffect(() => {
    // Simulate API call to fetch timeline data for selected product
    if (selectedProduct) {
      setLoading(true)
      setTimeout(() => {
        // Generate timeline data from Nov 2024 to April 2026
        const mockTimelineData: TimelineDataPoint[] = []

        // Start date: November 2024
        const startMonth = 10 // 0-based, so 10 = November
        const startYear = 2024

        // End date: April 2026
        const endMonth = 3 // 0-based, so 3 = April
        const endYear = 2026

        // Calculate total months
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1

        for (let i = 0; i < totalMonths; i++) {
          let month = startMonth + i
          let year = startYear

          while (month > 11) {
            month -= 12
            year += 1
          }

          const monthName = new Date(year, month, 1).toLocaleString("default", { month: "short" })
          const date = `${monthName} ${year}`

          // First 6 months are historical data
          if (i < 6) {
            mockTimelineData.push({
              month: date,
              actual: Math.floor(Math.random() * 1000) + 500,
              forecast: null,
              adjustedForecast: null,
              date: `${monthName} ${year}`,
            })
          }
          // Current month has both actual and forecast
          else if (i === 6) {
            mockTimelineData.push({
              month: date,
              actual: Math.floor(Math.random() * 1000) + 500,
              forecast: Math.floor(Math.random() * 1000) + 500,
              adjustedForecast: Math.floor(Math.random() * 1000) + 500,
              date: `${monthName} ${year}`,
            })
          }
          // Future months only have forecast data
          else {
            const forecastValue = Math.floor(Math.random() * 1000) + 500
            const adjustedValue = forecastValue + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 200)

            mockTimelineData.push({
              month: date,
              actual: null,
              forecast: forecastValue,
              adjustedForecast: adjustedValue,
              date: `${monthName} ${year}`,
            })
          }
        }

        setTimelineData(mockTimelineData)
        setLoading(false)
      }, 1000)
    }
  }, [selectedProduct, forecastId])

  const handleProductChange = (value: string) => {
    setSelectedProduct(value)
  }

  const handleEditClick = (item: TimelineDataPoint) => {
    setEditingItem(item)
    setNewQuantity(item.forecast || 0)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingItem && newQuantity !== "") {
      // Update the data
      const updatedData = timelineData.map((item) => {
        if (item.month === editingItem.month) {
          return {
            ...item,
            forecast: Number(newQuantity),
          }
        }
        return item
      })

      setTimelineData(updatedData)

      // Show success toast
      toast({
        title: "Forecast updated",
        description: `Updated forecast quantity for ${editingItem.month} to ${newQuantity}`,
      })

      // Close the modal
      setEditModalOpen(false)
      setEditingItem(null)
      setNewQuantity("")
    }
  }

  // Get the selected product details
  const selectedProductDetails = products.find((p) => p.id === selectedProduct) || {
    name: "",
    sku: "",
    category: "",
    unit: "",
  }

  if (loading && !products.length) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Filter timeline data to only include future forecasts (where forecast is not null)
  const forecastTableData = timelineData.filter((item) => item.forecast !== null)

  return (
    <div className="space-y-6">
      <div className="w-full max-w-xs">
        <Select value={selectedProduct} onValueChange={handleProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Historical Data"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Provider Forecast"
              stroke="#82ca9d"
              strokeDasharray="5 5"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="adjustedForecast"
              name="Rafed Forecast"
              stroke="#ff7300"
              strokeDasharray="3 3"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <p>
          <span className="font-medium">Note:</span> This chart shows historical data (solid purple line), provider
          forecast data (green dashed line), and Rafed forecast (orange dashed line) for the selected product over time.
        </p>
      </div>

      {/* Separator between chart and table */}
      <Separator className="my-6" />

      {/* Forecast Data Table */}
      <div>
        <h3 className="text-lg font-medium mb-3">Forecast Data for {selectedProductDetails.name}</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Forecast Quantity</TableHead>
                <TableHead className="text-right">Rafed Forecast</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecastTableData.length > 0 ? (
                forecastTableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{selectedProductDetails.sku}</TableCell>
                    <TableCell>{selectedProductDetails.name}</TableCell>
                    <TableCell>{selectedProductDetails.category}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="inline-flex items-center text-primary hover:underline focus:outline-none"
                      >
                        {item.forecast?.toLocaleString() || 0}
                        <Edit2 className="ml-1 h-3 w-3 text-muted-foreground" />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">{item.adjustedForecast?.toLocaleString() || 0}</TableCell>
                    <TableCell>{selectedProductDetails.unit}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No forecast data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Forecast Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Forecast Quantity</DialogTitle>
            <DialogDescription>
              Update the forecast quantity for {selectedProductDetails.name} ({editingItem?.month})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rafed-forecast" className="text-right text-sm font-medium col-span-2">
                Rafed Forecast:
              </label>
              <div className="col-span-2 font-medium">
                {editingItem?.adjustedForecast?.toLocaleString() || 0} {selectedProductDetails.unit}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="current-forecast" className="text-right text-sm font-medium col-span-2">
                Current Forecast:
              </label>
              <div className="col-span-2 font-medium">
                {editingItem?.forecast?.toLocaleString() || 0} {selectedProductDetails.unit}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="new-forecast" className="text-right text-sm font-medium col-span-2">
                New Forecast:
              </label>
              <div className="col-span-2">
                <Input
                  id="new-forecast"
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={newQuantity === ""}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
