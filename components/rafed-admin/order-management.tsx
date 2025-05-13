"use client"

import { useState } from "react"
import { CheckCircle, Search, ShoppingCart, Send, Eye, Package, TrendingUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { format } from "date-fns"

// Sample data for pending orders
const sampleOrders = [
  {
    id: "1",
    productId: "MED-001",
    name: "Paracetamol 500mg",
    category: "Medications",
    subcategory: "Pain Relief",
    totalQuantity: 12500,
    unit: "Boxes",
    status: "pending",
    priority: "high",
    supplier: "Supplier A",
    estimatedCost: 125000,
    productCode: "140277",
  },
  {
    id: "2",
    productId: "MED-002",
    name: "Amoxicillin 250mg",
    category: "Medications",
    subcategory: "Antibiotics",
    totalQuantity: 9800,
    unit: "Boxes",
    status: "pending",
    priority: "high",
    supplier: "Supplier A",
    estimatedCost: 147000,
    productCode: "140278",
  },
  {
    id: "3",
    productId: "MED-003",
    name: "Ibuprofen 400mg",
    category: "Medications",
    subcategory: "Pain Relief",
    totalQuantity: 8500,
    unit: "Boxes",
    status: "pending",
    priority: "medium",
    supplier: "Supplier B",
    estimatedCost: 85000,
    productCode: "140279",
  },
  {
    id: "4",
    productId: "SUP-001",
    name: "Surgical Gloves (M)",
    category: "Medical Supplies",
    subcategory: "Protective Equipment",
    totalQuantity: 7000,
    unit: "Boxes",
    status: "pending",
    priority: "high",
    supplier: "Supplier E",
    estimatedCost: 105000,
    productCode: "140280",
  },
  {
    id: "5",
    productId: "SUP-002",
    name: "Surgical Masks",
    category: "Medical Supplies",
    subcategory: "Protective Equipment",
    totalQuantity: 15000,
    unit: "Boxes",
    status: "pending",
    priority: "high",
    supplier: "Supplier E",
    estimatedCost: 75000,
    productCode: "140281",
  },
  {
    id: "6",
    productId: "SUP-003",
    name: "IV Cannula",
    category: "Medical Supplies",
    subcategory: "Infusion",
    totalQuantity: 5000,
    unit: "Pieces",
    status: "pending",
    priority: "medium",
    supplier: "Supplier H",
    estimatedCost: 50000,
    productCode: "140282",
  },
  {
    id: "7",
    productId: "EQP-001",
    name: "Blood Pressure Monitor",
    category: "Equipment",
    subcategory: "Diagnostic",
    totalQuantity: 450,
    unit: "Units",
    status: "pending",
    priority: "low",
    supplier: "Supplier I",
    estimatedCost: 67500,
    productCode: "140283",
  },
  {
    id: "8",
    productId: "EQP-002",
    name: "Stethoscope",
    category: "Equipment",
    subcategory: "Diagnostic",
    totalQuantity: 400,
    unit: "Units",
    status: "pending",
    priority: "low",
    supplier: "Supplier I",
    estimatedCost: 40000,
    productCode: "140284",
  },
]

// Sample data for order history
const orderHistoryData = [
  {
    id: "ORD-2023-001",
    date: "2023-04-15",
    products: [
      {
        productId: "MED-001",
        name: "Paracetamol 500mg",
        category: "Medications",
        supplier: "Supplier A",
        quantity: 10000,
        unit: "Boxes",
        cost: 100000,
      },
      {
        productId: "SUP-001",
        name: "Surgical Gloves (M)",
        category: "Medical Supplies",
        supplier: "Supplier E",
        quantity: 5000,
        unit: "Boxes",
        cost: 75000,
      },
    ],
    totalCost: 175000,
    status: "delivered",
    deliveryDate: "2023-04-25",
    oracleReference: "ORC-45678",
  },
  {
    id: "ORD-2023-002",
    date: "2023-05-02",
    products: [
      {
        productId: "MED-002",
        name: "Amoxicillin 250mg",
        category: "Medications",
        supplier: "Supplier A",
        quantity: 8000,
        unit: "Boxes",
        cost: 120000,
      },
    ],
    totalCost: 120000,
    status: "delivered",
    deliveryDate: "2023-05-12",
    oracleReference: "ORC-45679",
  },
  {
    id: "ORD-2023-003",
    date: "2023-05-20",
    products: [
      {
        productId: "SUP-002",
        name: "Surgical Masks",
        category: "Medical Supplies",
        supplier: "Supplier E",
        quantity: 12000,
        unit: "Boxes",
        cost: 60000,
      },
      {
        productId: "SUP-003",
        name: "IV Cannula",
        category: "Medical Supplies",
        supplier: "Supplier H",
        quantity: 4000,
        unit: "Pieces",
        cost: 40000,
      },
    ],
    totalCost: 100000,
    status: "delivered",
    deliveryDate: "2023-05-30",
    oracleReference: "ORC-45680",
  },
  {
    id: "ORD-2023-004",
    date: "2023-06-10",
    products: [
      {
        productId: "EQP-001",
        name: "Blood Pressure Monitor",
        category: "Equipment",
        supplier: "Supplier I",
        quantity: 400,
        unit: "Units",
        cost: 60000,
      },
      {
        productId: "EQP-002",
        name: "Stethoscope",
        category: "Equipment",
        supplier: "Supplier I",
        quantity: 350,
        unit: "Units",
        cost: 35000,
      },
    ],
    totalCost: 95000,
    status: "delivered",
    deliveryDate: "2023-06-25",
    oracleReference: "ORC-45681",
  },
  {
    id: "ORD-2023-005",
    date: "2023-07-05",
    products: [
      {
        productId: "MED-003",
        name: "Ibuprofen 400mg",
        category: "Medications",
        supplier: "Supplier B",
        quantity: 7500,
        unit: "Boxes",
        cost: 75000,
      },
    ],
    totalCost: 75000,
    status: "delivered",
    deliveryDate: "2023-07-15",
    oracleReference: "ORC-45682",
  },
  {
    id: "ORD-2023-006",
    date: "2023-08-01",
    products: [
      {
        productId: "MED-001",
        name: "Paracetamol 500mg",
        category: "Medications",
        supplier: "Supplier A",
        quantity: 11000,
        unit: "Boxes",
        cost: 110000,
      },
      {
        productId: "MED-002",
        name: "Amoxicillin 250mg",
        category: "Medications",
        supplier: "Supplier A",
        quantity: 9000,
        unit: "Boxes",
        cost: 135000,
      },
    ],
    totalCost: 245000,
    status: "delivered",
    deliveryDate: "2023-08-12",
    oracleReference: "ORC-45683",
  },
  {
    id: "ORD-2023-007",
    date: "2023-09-10",
    products: [
      {
        productId: "SUP-001",
        name: "Surgical Gloves (M)",
        category: "Medical Supplies",
        supplier: "Supplier E",
        quantity: 6500,
        unit: "Boxes",
        cost: 97500,
      },
      {
        productId: "SUP-002",
        name: "Surgical Masks",
        category: "Medical Supplies",
        supplier: "Supplier E",
        quantity: 14000,
        unit: "Boxes",
        cost: 70000,
      },
    ],
    totalCost: 167500,
    status: "delivered",
    deliveryDate: "2023-09-20",
    oracleReference: "ORC-45684",
  },
  {
    id: "ORD-2023-008",
    date: "2023-10-05",
    products: [
      {
        productId: "EQP-001",
        name: "Blood Pressure Monitor",
        category: "Equipment",
        supplier: "Supplier I",
        quantity: 420,
        unit: "Units",
        cost: 63000,
      },
    ],
    totalCost: 63000,
    status: "in-transit",
    deliveryDate: "2023-10-20",
    oracleReference: "ORC-45685",
  },
  {
    id: "ORD-2023-009",
    date: "2023-10-15",
    products: [
      {
        productId: "MED-003",
        name: "Ibuprofen 400mg",
        category: "Medications",
        supplier: "Supplier B",
        quantity: 8000,
        unit: "Boxes",
        cost: 80000,
      },
      {
        productId: "SUP-003",
        name: "IV Cannula",
        category: "Medical Supplies",
        supplier: "Supplier H",
        quantity: 4500,
        unit: "Pieces",
        cost: 45000,
      },
    ],
    totalCost: 125000,
    status: "processing",
    deliveryDate: null,
    oracleReference: "ORC-45686",
  },
]

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({ key: "priority", direction: "ascending" })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  // Filter pending orders based on search term and filters
  const filteredPendingOrders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || order.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesCategory && matchesPriority
  })

  // Filter order history based on search term, status, and date range
  const filteredOrderHistory = orderHistoryData.filter((order) => {
    // Check if any product matches the search term
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productId.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    // Check if order status matches the filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // Check if order date is within the selected date range
    const orderDate = new Date(order.date)
    const matchesDateRange =
      !dateRange.from || !dateRange.to || (orderDate >= dateRange.from && orderDate <= dateRange.to)

    // Check if any product matches the category filter
    const matchesCategory =
      categoryFilter === "all" || order.products.some((product) => product.category === categoryFilter)

    return matchesSearch && matchesStatus && matchesDateRange && matchesCategory
  })

  // Sort orders based on sort config
  const sortedPendingOrders = [...filteredPendingOrders].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Sort order history based on date
  const sortedOrderHistory = [...filteredOrderHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA // Sort by most recent first
  })

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredPendingOrders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, id])
    } else {
      setSelectedOrders((prev) => prev.filter((orderId) => orderId !== id))
    }
  }

  const handleConfirmOrders = () => {
    // In a real app, this would send the orders to Oracle
    console.log("Sending orders to Oracle:", selectedOrders)
    setConfirmDialogOpen(false)
    // Reset selection after confirmation
    setSelectedOrders([])
  }

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrderDetails(order)
    setOrderDetailsOpen(true)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Delivered
          </Badge>
        )
      case "in-transit":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Transit
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Processing
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const getAnomalyBadge = (score: number) => {
    if (score >= 0.7) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          High Anomaly
        </Badge>
      )
    } else if (score >= 0.3) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Medium Anomaly
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Normal
        </Badge>
      )
    }
  }

  const totalSelectedCost = selectedOrders.reduce((total, id) => {
    const order = sampleOrders.find((o) => o.id === id)
    return total + (order?.estimatedCost || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Suggested Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                    <div className="text-2xl font-bold mt-1">{sampleOrders.length}</div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Selected Orders</div>
                    <div className="text-2xl font-bold mt-1">{selectedOrders.length}</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div className="text-2xl font-bold mt-1">{totalSelectedCost.toLocaleString()} AED</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 max-w-md"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Medications">Medications</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={selectedOrders.length === 0} className="gap-2">
                    <Send className="h-4 w-4" />
                    Send to Oracle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Order Submission</DialogTitle>
                    <DialogDescription>
                      You are about to send {selectedOrders.length} orders to Oracle. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrders.map((id) => {
                            const order = sampleOrders.find((o) => o.id === id)
                            if (!order) return null
                            return (
                              <TableRow key={id}>
                                <TableCell className="font-medium">{order.name}</TableCell>
                                <TableCell className="text-right">
                                  {order.totalQuantity.toLocaleString()} {order.unit}
                                </TableCell>
                                <TableCell className="text-right">{order.estimatedCost.toLocaleString()} AED</TableCell>
                              </TableRow>
                            )
                          })}
                          <TableRow>
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right font-bold">
                              {totalSelectedCost.toLocaleString()} AED
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmOrders}>Confirm and Send</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        filteredPendingOrders.length > 0 && selectedOrders.length === filteredPendingOrders.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort("name")}>
                      Product
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort("category")}>
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => requestSort("totalQuantity")}>
                      Quantity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort("priority")}>
                      Priority
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => requestSort("estimatedCost")}>
                      Est. Cost
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPendingOrders.length > 0 ? (
                  sortedPendingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                          aria-label={`Select ${order.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-muted-foreground mr-2" />
                          <div>
                            <div>{order.name}</div>
                            <div className="text-xs text-muted-foreground">{order.productId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order.category}</TableCell>
                      <TableCell className="text-right">
                        {order.totalQuantity.toLocaleString()} {order.unit}
                      </TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell className="text-right">{order.estimatedCost.toLocaleString()} AED</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No orders found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                    <div className="text-2xl font-bold mt-1">{orderHistoryData.length}</div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Delivered Orders</div>
                    <div className="text-2xl font-bold mt-1">
                      {orderHistoryData.filter((order) => order.status === "delivered").length}
                    </div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div className="text-2xl font-bold mt-1">
                      {orderHistoryData.reduce((total, order) => total + order.totalCost, 0).toLocaleString()} AED
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 max-w-md"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Medications">Medications</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Oracle Reference</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrderHistory.length > 0 ? (
                  sortedOrderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.products.length} products</span>
                          <span className="text-xs text-muted-foreground">
                            {order.products
                              .map((p) => p.name)
                              .slice(0, 2)
                              .join(", ")}
                            {order.products.length > 2 ? "..." : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.oracleReference}</TableCell>
                      <TableCell className="text-right">{order.totalCost.toLocaleString()} AED</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No orders found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrderDetails && (
                <div className="flex items-center gap-2 mt-1">
                  <span>Order ID: {selectedOrderDetails.id}</span>
                  <span>•</span>
                  <span>Product Code: {selectedOrderDetails.productCode || "140277"}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedOrderDetails && (
            <div className="py-4">
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="replenishment">Replenishment</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                      <div className="flex items-center">{getStatusBadge(selectedOrderDetails.status)}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                      <div>{getPriorityBadge(selectedOrderDetails.priority)}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Product</h3>
                      <p>{selectedOrderDetails.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedOrderDetails.productId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                      <p>
                        {selectedOrderDetails.category} / {selectedOrderDetails.subcategory}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h3>
                      <p>
                        {selectedOrderDetails.totalQuantity.toLocaleString()} {selectedOrderDetails.unit}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Supplier</h3>
                      <p>{selectedOrderDetails.supplier}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Cost</h3>
                      <p>{selectedOrderDetails.estimatedCost.toLocaleString()} AED</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="mt-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-semibold mb-2">Inventory information</h3>
                    <p className="text-sm text-muted-foreground mb-4">Present the Inventory information details.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Product Code :</h4>
                        <p>140277</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Actual demand :</h4>
                        <p>2.6</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Average Lead Time :</h4>
                        <p>5</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Average Consumption :</h4>
                        <p>2.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Current Total Inventory :</h4>
                        <p>19</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Distribution Center Inventory :</h4>
                        <p>0.0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Store Inventory :</h4>
                        <p>19</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Quantity to Order in Next 30 Days:
                        </h4>
                        <p>1113.6</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Quantity to Receive in Next 30 Days :
                        </h4>
                        <p>0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Days Inventory On Hand :</h4>
                        <p>10.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">User Defined Safety Stock :</h4>
                        <p>0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">User Sent Safety Stock :</h4>
                        <p>0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">PAR Level:</h4>
                        <p>20</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Suggested PAR Level :</h4>
                        <p>23.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Safety Stock :</h4>
                        <p>13</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Quantity On Hand :</h4>
                        <p>19</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Min Order Qty :</h4>
                        <p>5.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Classification ABC :</h4>
                        <p>C</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">d cost min :</h4>
                        <p>145.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">d cost max :</h4>
                        <p>145.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">item cost min :</h4>
                        <p>145.0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">item cost max :</h4>
                        <p>145.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par cost min :</h4>
                        <p>-87.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par :</h4>
                        <p>-3.0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par cost max :</h4>
                        <p>-87.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par vchr cost min :</h4>
                        <p>-435.0</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par vchr cost max :</h4>
                        <p>-435.0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">DELTA par cost current :</h4>
                        <p>-435.0</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Item Description :</h4>
                        <p>GUIDEWIRE VASC 0.035INx150.0CM 3.0CM ANG STD HDPLIC</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Site :</h4>
                        <p>aggregated</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="replenishment" className="mt-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-semibold mb-2">Replenishment information</h3>
                    <p className="text-sm text-muted-foreground mb-4">Present the Replenishment information details.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Product Code :</h4>
                        <p>140277</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Code Projected On-Hand Inventory :
                        </h4>
                        <p>-60.2</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Net Requirements :</h4>
                        <p>63.8</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Ending Inventory :</h4>
                        <p>-63.8</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Missing Quantity to Reach Safety Stock :
                        </h4>
                        <p>76.8</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Planned Receipts :</h4>
                        <p>0</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Required Quantity :</h4>
                        <p>63.8</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Suggested Order Quantity:</h4>
                        <p>76.8</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Safety Stock:</h4>
                        <p>13</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Computed Lead Time:</h4>
                        <p>5</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Min Order Qty:</h4>
                        <p>5</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Suggested Order Qty Min Order Qty :
                        </h4>
                        <p>76.8</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Site :</h4>
                        <p>aggregated</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date :</h4>
                        <p>11/27/2024</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
