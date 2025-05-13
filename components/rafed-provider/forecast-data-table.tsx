"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { ForecastDataPoint } from "@/types/rafed-types"

interface ForecastDataTableProps {
  forecastId: string
}

export function ForecastDataTable({ forecastId }: ForecastDataTableProps) {
  const [data, setData] = useState<(ForecastDataPoint & { adjustedQuantity?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Simulate API call to fetch forecast data
    setLoading(true)
    setTimeout(() => {
      // Mock data for the table
      const mockData: (ForecastDataPoint & { adjustedQuantity: number })[] = Array.from({ length: 50 }, (_, i) => {
        const categories = [
          "Surgical Supplies",
          "Pharmaceuticals",
          "Diagnostic Equipment",
          "Personal Protective Equipment",
          "Laboratory Supplies",
        ]
        const category = categories[Math.floor(Math.random() * categories.length)]

        let productName = ""
        let sku = ""

        switch (category) {
          case "Surgical Supplies":
            productName = ["Surgical Gloves", "Syringes", "Bandages", "Catheters", "Surgical Masks"][
              Math.floor(Math.random() * 5)
            ]
            sku = `SRG-${1000 + i}`
            break
          case "Pharmaceuticals":
            productName = [
              "Paracetamol",
              "Amoxicillin",
              "Ibuprofen",
              "Omeprazole",
              "Metformin",
              "Atorvastatin",
              "Salbutamol",
              "Fluoxetine",
            ][Math.floor(Math.random() * 8)]
            sku = `PHARM-${2000 + i}`
            break
          case "Diagnostic Equipment":
            productName = ["Test Kits", "Blood Pressure Monitors", "Thermometers", "Stethoscopes", "Glucose Meters"][
              Math.floor(Math.random() * 5)
            ]
            sku = `DIAG-${3000 + i}`
            break
          case "Personal Protective Equipment":
            productName = ["Face Masks", "Face Shields", "Isolation Gowns", "Shoe Covers", "Protective Eyewear"][
              Math.floor(Math.random() * 5)
            ]
            sku = `PPE-${4000 + i}`
            break
          case "Laboratory Supplies":
            productName = ["Test Tubes", "Petri Dishes", "Microscope Slides", "Pipettes", "Disinfectants"][
              Math.floor(Math.random() * 5)
            ]
            sku = `LAB-${5000 + i}`
            break
        }

        const forecastQuantity = Math.floor(Math.random() * 1000) + 100
        // Adjusted quantity is slightly different from the provider's forecast
        const adjustedQuantity = forecastQuantity + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 200)

        return {
          productId: `prod-${i + 1}`,
          productName,
          sku,
          category,
          forecastQuantity,
          adjustedQuantity,
          unit: ["Each", "Box", "Case", "Pack"][Math.floor(Math.random() * 4)],
          month: "May",
          year: 2025,
        }
      })

      setData(mockData)
      setTotalPages(Math.ceil(mockData.length / itemsPerPage))
      setLoading(false)
    }, 1000)
  }, [forecastId])

  // Get unique categories for the filter
  const categories = ["all", ...new Set(data.map((item) => item.category))]

  // Filter and paginate data
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const calculatedTotalPages = Math.ceil(filteredData.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // Reset to first page on search
              }}
              className="pl-8"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value)
                setPage(1) // Reset to first page on filter change
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{`${item.month} ${item.year}`}</TableCell>
                  <TableCell className="text-right">{item.forecastQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.adjustedQuantity?.toLocaleString()}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {calculatedTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <div className="text-sm">
              Page {page} of {calculatedTotalPages}
            </div>
            <button
              className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === calculatedTotalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
