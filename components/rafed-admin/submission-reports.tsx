"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, FileText, Calendar, Check, ChevronsUpDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

// Sample data for the reports
const monthlyReports = [
  {
    id: "may-2025",
    month: "May",
    year: 2025,
    totalProviders: 45,
    submittedProviders: 42,
    missingProviders: 3,
    onTimeSubmissions: 38,
    lateSubmissions: 4,
    submissionRate: 93.3,
    onTimeRate: 90.5,
    aggregatedForecast: {
      totalProducts: 1245,
      totalQuantity: 3567890,
      categories: [
        { name: "Medications", quantity: 1245000, percentage: 34.9 },
        { name: "Medical Supplies", quantity: 987000, percentage: 27.7 },
        { name: "Equipment", quantity: 456000, percentage: 12.8 },
        { name: "Laboratory", quantity: 567890, percentage: 15.9 },
        { name: "Surgical", quantity: 312000, percentage: 8.7 },
      ],
      topProducts: [
        { name: "Surgical Masks", quantity: 450000, unit: "Boxes" },
        { name: "Examination Gloves", quantity: 380000, unit: "Boxes" },
        { name: "Paracetamol 500mg", quantity: 250000, unit: "Boxes" },
        { name: "Insulin", quantity: 180000, unit: "Vials" },
        { name: "PCR Test Kits", quantity: 120000, unit: "Kits" },
      ],
      timeSeriesData: {
        byCategory: [
          {
            name: "Medications",
            data: [
              { month: "Week 1", quantity: 310000 },
              { month: "Week 2", quantity: 325000 },
              { month: "Week 3", quantity: 302000 },
              { month: "Week 4", quantity: 308000 },
            ],
          },
          {
            name: "Medical Supplies",
            data: [
              { month: "Week 1", quantity: 245000 },
              { month: "Week 2", quantity: 252000 },
              { month: "Week 3", quantity: 240000 },
              { month: "Week 4", quantity: 250000 },
            ],
          },
          {
            name: "Equipment",
            data: [
              { month: "Week 1", quantity: 112000 },
              { month: "Week 2", quantity: 118000 },
              { month: "Week 3", quantity: 110000 },
              { month: "Week 4", quantity: 116000 },
            ],
          },
          {
            name: "Laboratory",
            data: [
              { month: "Week 1", quantity: 140000 },
              { month: "Week 2", quantity: 145000 },
              { month: "Week 3", quantity: 138000 },
              { month: "Week 4", quantity: 144890 },
            ],
          },
          {
            name: "Surgical",
            data: [
              { month: "Week 1", quantity: 76000 },
              { month: "Week 2", quantity: 80000 },
              { month: "Week 3", quantity: 75000 },
              { month: "Week 4", quantity: 81000 },
            ],
          },
        ],
        byProduct: [
          {
            name: "Surgical Masks",
            data: [
              { month: "Week 1", quantity: 110000 },
              { month: "Week 2", quantity: 115000 },
              { month: "Week 3", quantity: 112000 },
              { month: "Week 4", quantity: 113000 },
            ],
          },
          {
            name: "Examination Gloves",
            data: [
              { month: "Week 1", quantity: 94000 },
              { month: "Week 2", quantity: 97000 },
              { month: "Week 3", quantity: 93000 },
              { month: "Week 4", quantity: 96000 },
            ],
          },
          {
            name: "Paracetamol 500mg",
            data: [
              { month: "Week 1", quantity: 61000 },
              { month: "Week 2", quantity: 64000 },
              { month: "Week 3", quantity: 62000 },
              { month: "Week 4", quantity: 63000 },
            ],
          },
          {
            name: "Insulin",
            data: [
              { month: "Week 1", quantity: 44000 },
              { month: "Week 2", quantity: 46000 },
              { month: "Week 3", quantity: 45000 },
              { month: "Week 4", quantity: 45000 },
            ],
          },
          {
            name: "PCR Test Kits",
            data: [
              { month: "Week 1", quantity: 29000 },
              { month: "Week 2", quantity: 31000 },
              { month: "Week 3", quantity: 30000 },
              { month: "Week 4", quantity: 30000 },
            ],
          },
        ],
      },
    },
  },
  {
    id: "apr-2025",
    month: "April",
    year: 2025,
    totalProviders: 45,
    submittedProviders: 40,
    missingProviders: 5,
    onTimeSubmissions: 35,
    lateSubmissions: 5,
    submissionRate: 88.9,
    onTimeRate: 87.5,
    aggregatedForecast: {
      totalProducts: 1198,
      totalQuantity: 3245670,
      categories: [
        { name: "Medications", quantity: 1125000, percentage: 34.7 },
        { name: "Medical Supplies", quantity: 897000, percentage: 27.6 },
        { name: "Equipment", quantity: 423000, percentage: 13.0 },
        { name: "Laboratory", quantity: 523670, percentage: 16.1 },
        { name: "Surgical", quantity: 277000, percentage: 8.5 },
      ],
      topProducts: [
        { name: "Surgical Masks", quantity: 420000, unit: "Boxes" },
        { name: "Examination Gloves", quantity: 350000, unit: "Boxes" },
        { name: "Paracetamol 500mg", quantity: 230000, unit: "Boxes" },
        { name: "Insulin", quantity: 165000, unit: "Vials" },
        { name: "PCR Test Kits", quantity: 110000, unit: "Kits" },
      ],
      timeSeriesData: {
        byCategory: [
          {
            name: "Medications",
            data: [
              { month: "Week 1", quantity: 310000 },
              { month: "Week 2", quantity: 325000 },
              { month: "Week 3", quantity: 302000 },
              { month: "Week 4", quantity: 308000 },
            ],
          },
          {
            name: "Medical Supplies",
            data: [
              { month: "Week 1", quantity: 245000 },
              { month: "Week 2", quantity: 252000 },
              { month: "Week 3", quantity: 240000 },
              { month: "Week 4", quantity: 250000 },
            ],
          },
          {
            name: "Equipment",
            data: [
              { month: "Week 1", quantity: 112000 },
              { month: "Week 2", quantity: 118000 },
              { month: "Week 3", quantity: 110000 },
              { month: "Week 4", quantity: 116000 },
            ],
          },
          {
            name: "Laboratory",
            data: [
              { month: "Week 1", quantity: 140000 },
              { month: "Week 2", quantity: 145000 },
              { month: "Week 3", quantity: 138000 },
              { month: "Week 4", quantity: 144890 },
            ],
          },
          {
            name: "Surgical",
            data: [
              { month: "Week 1", quantity: 76000 },
              { month: "Week 2", quantity: 80000 },
              { month: "Week 3", quantity: 75000 },
              { month: "Week 4", quantity: 81000 },
            ],
          },
        ],
        byProduct: [
          {
            name: "Surgical Masks",
            data: [
              { month: "Week 1", quantity: 110000 },
              { month: "Week 2", quantity: 115000 },
              { month: "Week 3", quantity: 112000 },
              { month: "Week 4", quantity: 113000 },
            ],
          },
          {
            name: "Examination Gloves",
            data: [
              { month: "Week 1", quantity: 94000 },
              { month: "Week 2", quantity: 97000 },
              { month: "Week 3", quantity: 93000 },
              { month: "Week 4", quantity: 96000 },
            ],
          },
          {
            name: "Paracetamol 500mg",
            data: [
              { month: "Week 1", quantity: 61000 },
              { month: "Week 2", quantity: 64000 },
              { month: "Week 3", quantity: 62000 },
              { month: "Week 4", quantity: 63000 },
            ],
          },
          {
            name: "Insulin",
            data: [
              { month: "Week 1", quantity: 44000 },
              { month: "Week 2", quantity: 46000 },
              { month: "Week 3", quantity: 45000 },
              { month: "Week 4", quantity: 45000 },
            ],
          },
          {
            name: "PCR Test Kits",
            data: [
              { month: "Week 1", quantity: 29000 },
              { month: "Week 2", quantity: 31000 },
              { month: "Week 3", quantity: 30000 },
              { month: "Week 4", quantity: 30000 },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mar-2025",
    month: "March",
    year: 2025,
    totalProviders: 45,
    submittedProviders: 43,
    missingProviders: 2,
    onTimeSubmissions: 40,
    lateSubmissions: 3,
    submissionRate: 95.6,
    onTimeRate: 93.0,
    aggregatedForecast: {
      totalProducts: 1267,
      totalQuantity: 3678900,
      categories: [
        { name: "Medications", quantity: 1298000, percentage: 35.3 },
        { name: "Medical Supplies", quantity: 1012000, percentage: 27.5 },
        { name: "Equipment", quantity: 467000, percentage: 12.7 },
        { name: "Laboratory", quantity: 589900, percentage: 16.0 },
        { name: "Surgical", quantity: 312000, percentage: 8.5 },
      ],
      topProducts: [
        { name: "Surgical Masks", quantity: 470000, unit: "Boxes" },
        { name: "Examination Gloves", quantity: 390000, unit: "Boxes" },
        { name: "Paracetamol 500mg", quantity: 260000, unit: "Boxes" },
        { name: "Insulin", quantity: 190000, unit: "Vials" },
        { name: "PCR Test Kits", quantity: 130000, unit: "Kits" },
      ],
      timeSeriesData: {
        byCategory: [
          {
            name: "Medications",
            data: [
              { month: "Week 1", quantity: 310000 },
              { month: "Week 2", quantity: 325000 },
              { month: "Week 3", quantity: 302000 },
              { month: "Week 4", quantity: 308000 },
            ],
          },
          {
            name: "Medical Supplies",
            data: [
              { month: "Week 1", quantity: 245000 },
              { month: "Week 2", quantity: 252000 },
              { month: "Week 3", quantity: 240000 },
              { month: "Week 4", quantity: 250000 },
            ],
          },
          {
            name: "Equipment",
            data: [
              { month: "Week 1", quantity: 112000 },
              { month: "Week 2", quantity: 118000 },
              { month: "Week 3", quantity: 110000 },
              { month: "Week 4", quantity: 116000 },
            ],
          },
          {
            name: "Laboratory",
            data: [
              { month: "Week 1", quantity: 140000 },
              { month: "Week 2", quantity: 145000 },
              { month: "Week 3", quantity: 138000 },
              { month: "Week 4", quantity: 144890 },
            ],
          },
          {
            name: "Surgical",
            data: [
              { month: "Week 1", quantity: 76000 },
              { month: "Week 2", quantity: 80000 },
              { month: "Week 3", quantity: 75000 },
              { month: "Week 4", quantity: 81000 },
            ],
          },
        ],
        byProduct: [
          {
            name: "Surgical Masks",
            data: [
              { month: "Week 1", quantity: 110000 },
              { month: "Week 2", quantity: 115000 },
              { month: "Week 3", quantity: 112000 },
              { month: "Week 4", quantity: 113000 },
            ],
          },
          {
            name: "Examination Gloves",
            data: [
              { month: "Week 1", quantity: 94000 },
              { month: "Week 2", quantity: 97000 },
              { month: "Week 3", quantity: 93000 },
              { month: "Week 4", quantity: 96000 },
            ],
          },
          {
            name: "Paracetamol 500mg",
            data: [
              { month: "Week 1", quantity: 61000 },
              { month: "Week 2", quantity: 64000 },
              { month: "Week 3", quantity: 62000 },
              { month: "Week 4", quantity: 63000 },
            ],
          },
          {
            name: "Insulin",
            data: [
              { month: "Week 1", quantity: 44000 },
              { month: "Week 2", quantity: 46000 },
              { month: "Week 3", quantity: 45000 },
              { month: "Week 4", quantity: 45000 },
            ],
          },
          {
            name: "PCR Test Kits",
            data: [
              { month: "Week 1", quantity: 29000 },
              { month: "Week 2", quantity: 31000 },
              { month: "Week 3", quantity: 30000 },
              { month: "Week 4", quantity: 30000 },
            ],
          },
        ],
      },
    },
  },
]

const missingProviders = [
  {
    id: "1",
    name: "King Fahad Medical City",
    region: "Riyadh",
    lastSubmission: "April 23, 2023",
    contactPerson: "Ahmed Al-Farsi",
    contactEmail: "ahmed.alfarsi@kfmc.med.sa",
    contactPhone: "+966 11 288 9999",
  },
  {
    id: "2",
    name: "Asir Central Hospital",
    region: "Asir",
    lastSubmission: "March 24, 2023",
    contactPerson: "Fatima Al-Qahtani",
    contactEmail: "f.alqahtani@ach.med.sa",
    contactPhone: "+966 17 224 5555",
  },
  {
    id: "3",
    name: "King Khalid University Hospital",
    region: "Riyadh",
    lastSubmission: "April 20, 2023",
    contactPerson: "Mohammed Al-Otaibi",
    contactEmail: "m.alotaibi@kkuh.edu.sa",
    contactPhone: "+966 11 467 0000",
  },
]

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export function SubmissionReports() {
  const [selectedReport, setSelectedReport] = useState(monthlyReports[0].id)
  const [activeTab, setActiveTab] = useState("overview")
  const [aggregationType, setAggregationType] = useState<"category" | "product">("product")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [openCategorySelect, setOpenCategorySelect] = useState(false)
  const [openProductSelect, setOpenProductSelect] = useState(false)

  // Find the currently selected report
  const currentReport = monthlyReports.find((report) => report.id === selectedReport) || monthlyReports[0]

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Get all available categories and products
  const allCategories = currentReport.aggregatedForecast.categories.map((cat) => cat.name)
  const allProducts = currentReport.aggregatedForecast.topProducts.map((prod) => prod.name)

  // Filter time series data based on selected categories or products
  const filteredTimeSeriesData =
    aggregationType === "category"
      ? currentReport.aggregatedForecast.timeSeriesData.byCategory.filter(
          (item) => selectedCategories.length === 0 || selectedCategories.includes(item.name),
        )
      : currentReport.aggregatedForecast.timeSeriesData.byProduct.filter(
          (item) => selectedProducts.length === 0 || selectedProducts.includes(item.name),
        )

  // Add this function to generate 12 months of data
  const generate12MonthsData = () => {
    const months = [
      "May 2025",
      "Jun 2025",
      "Jul 2025",
      "Aug 2025",
      "Sep 2025",
      "Oct 2025",
      "Nov 2025",
      "Dec 2025",
      "Jan 2026",
      "Feb 2026",
      "Mar 2026",
      "Apr 2026",
    ]

    return months.map((month) => ({
      month: month,
      quantity: Math.floor(Math.random() * 300000) + 200000,
    }))
  }

  // Generate 12 months of data for the time series
  const aggregatedTimeSeriesData = generate12MonthsData()

  // Generate Rafed adjusted forecast data (slightly different from the aggregated data)
  const generateRafedAdjustedData = () => {
    return aggregatedTimeSeriesData.map((point) => {
      // Apply a random adjustment factor between 0.92 and 1.08
      const adjustmentFactor = 0.92 + Math.random() * 0.16
      return {
        month: point.month,
        quantity: Math.round(point.quantity * adjustmentFactor),
      }
    })
  }

  // Calculate the Rafed adjusted data
  const rafedAdjustedData = generateRafedAdjustedData()

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category],
    )
  }

  // Handle product selection
  const toggleProduct = (product: string) => {
    setSelectedProducts((current) =>
      current.includes(product) ? current.filter((p) => p !== product) : [...current, product],
    )
  }

  // Clear all selections
  const clearSelections = () => {
    if (aggregationType === "category") {
      setSelectedCategories([])
    } else {
      setSelectedProducts([])
    }
  }

  // Select all options
  const selectAll = () => {
    if (aggregationType === "category") {
      setSelectedCategories(allCategories)
    } else {
      setSelectedProducts(allProducts)
    }
  }

  // Handle aggregation type change
  const handleAggregationTypeChange = (type: "category" | "product") => {
    setAggregationType(type)
    // Reset selections when changing aggregation type
    setSelectedCategories([])
    setSelectedProducts([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select reporting period" />
          </SelectTrigger>
          <SelectContent>
            {monthlyReports.map((report) => (
              <SelectItem key={report.id} value={report.id}>
                {report.month} {report.year} Report
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Submission Rate</div>
                <div className="text-2xl font-bold mt-1">{currentReport.submissionRate}%</div>
                <Progress value={currentReport.submissionRate} className="h-2 mt-2" indicatorClassName="bg-green-500" />
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                <div className="text-2xl font-bold mt-1">{currentReport.onTimeRate}%</div>
                <Progress value={currentReport.onTimeRate} className="h-2 mt-2" indicatorClassName="bg-blue-500" />
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Missing Submissions</div>
                <div className="text-2xl font-bold mt-1">{currentReport.missingProviders}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  out of {currentReport.totalProviders} providers
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="aggregated-forecast">Aggregated Forecast</TabsTrigger>
          <TabsTrigger value="missing-providers">Missing Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8">
            <h3 className="text-xl font-medium">Submission Overview</h3>
            <p className="text-muted-foreground mt-2">
              Please select the Aggregated Forecast tab to view detailed forecast data.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="aggregated-forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aggregated Forecast Time Series</CardTitle>
              <CardDescription>
                Combined forecast data from all providers for {currentReport.month} {currentReport.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Products</div>
                    <div className="text-2xl font-bold mt-1">{currentReport.aggregatedForecast.totalProducts}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Providers Included</div>
                    <div className="text-2xl font-bold mt-1">{currentReport.submittedProviders}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={aggregationType === "product" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAggregationTypeChange("product")}
                    >
                      By Product
                    </Button>
                    <Button
                      variant={aggregationType === "category" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAggregationTypeChange("category")}
                    >
                      By Category
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    {aggregationType === "category" ? (
                      <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCategorySelect}
                            className="justify-between min-w-[200px]"
                          >
                            {selectedCategories.length === 0
                              ? "Select categories"
                              : `${selectedCategories.length} selected`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search categories..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                <div className="p-2 flex justify-between">
                                  <Button variant="ghost" size="sm" onClick={clearSelections}>
                                    Clear
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={selectAll}>
                                    Select All
                                  </Button>
                                </div>
                                {allCategories.map((category) => (
                                  <CommandItem
                                    key={category}
                                    value={category}
                                    onSelect={() => toggleCategory(category)}
                                    className="flex items-center gap-2 px-2 py-1.5"
                                  >
                                    <div className="border border-primary rounded-sm w-4 h-4 flex items-center justify-center bg-background">
                                      {selectedCategories.includes(category) && (
                                        <Check className="h-3 w-3 text-primary" />
                                      )}
                                    </div>
                                    <span>{category}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Popover open={openProductSelect} onOpenChange={setOpenProductSelect}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProductSelect}
                            className="justify-between min-w-[200px]"
                          >
                            {selectedProducts.length === 0 ? "Select products" : `${selectedProducts.length} selected`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search products..." />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                <div className="p-2 flex justify-between">
                                  <Button variant="ghost" size="sm" onClick={clearSelections}>
                                    Clear
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={selectAll}>
                                    Select All
                                  </Button>
                                </div>
                                {allProducts.map((product) => (
                                  <CommandItem
                                    key={product}
                                    value={product}
                                    onSelect={() => toggleProduct(product)}
                                    className="flex items-center gap-2 px-2 py-1.5"
                                  >
                                    <div className="border border-primary rounded-sm w-4 h-4 flex items-center justify-center bg-background">
                                      {selectedProducts.includes(product) && <Check className="h-3 w-3 text-primary" />}
                                    </div>
                                    <span>{product}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {aggregationType === "category" ? (
                    selectedCategories.length > 0 ? (
                      selectedCategories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-sm">
                          {category}
                          <button className="ml-1 hover:text-destructive" onClick={() => toggleCategory(category)}>
                            ×
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">All categories selected</div>
                    )
                  ) : selectedProducts.length > 0 ? (
                    selectedProducts.map((product) => (
                      <Badge key={product} variant="secondary" className="text-sm">
                        {product}
                        <button className="ml-1 hover:text-destructive" onClick={() => toggleProduct(product)}>
                          ×
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">All products selected</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {aggregationType === "category" ? "Forecast by Category (Weekly)" : "Products Forecast (Weekly)"}
                  </h3>
                  <ResponsiveContainer width="100%" height={500}>
                    <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        type="category"
                        allowDuplicatedCategory={false}
                        padding={{ left: 30, right: 30 }}
                      />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [formatNumber(value), "Quantity"]} />
                      <Legend />

                      {/* Provider Forecast line */}
                      <Line
                        dataKey="quantity"
                        data={aggregatedTimeSeriesData}
                        name="Provider Forecast"
                        stroke="#0088FE"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />

                      {/* Rafed Forecast line */}
                      <Line
                        dataKey="quantity"
                        data={rafedAdjustedData}
                        name="Rafed Forecast"
                        stroke="#FF8042"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="text-sm text-muted-foreground mt-4">
                    <p>
                      The chart shows both the aggregated provider forecast and Rafed's adjusted forecast based on
                      historical data analysis and market trends.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing-providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Missing Submissions</CardTitle>
              <CardDescription>
                Providers who have not submitted their forecasts for {currentReport.month} {currentReport.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {missingProviders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Last Submission</TableHead>
                      <TableHead>Contact Person</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">{provider.name}</TableCell>
                        <TableCell>{provider.region}</TableCell>
                        <TableCell>{provider.lastSubmission}</TableCell>
                        <TableCell>
                          <div>{provider.contactPerson}</div>
                          <div className="text-sm text-muted-foreground">{provider.contactEmail}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium">All providers have submitted!</h3>
                  <p className="text-muted-foreground mt-2">
                    There are no missing submissions for this reporting period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
