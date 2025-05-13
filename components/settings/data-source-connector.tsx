"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Server, ShoppingCart, DollarSign, Cloud } from "lucide-react"

// Update the sourceTypes array to include Salesforce
const sourceTypes = [
  {
    id: "erp",
    name: "ERP System",
    icon: Database,
    description: "Connect to your Enterprise Resource Planning system",
  },
  {
    id: "inventory",
    name: "Inventory Management",
    icon: Server,
    description: "Connect to your inventory management system",
  },
  {
    id: "procurement",
    name: "Procurement System",
    icon: ShoppingCart,
    description: "Connect to your procurement or purchasing system",
  },
  {
    id: "financial",
    name: "Financial System",
    icon: DollarSign,
    description: "Connect to your financial or accounting system",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: Cloud,
    description: "Connect to Salesforce CRM for customer and sales data",
  },
  {
    id: "ecri",
    name: "ECRI Database",
    icon: Database,
    description: "Connect to ECRI for medical device and healthcare technology data",
  },
  {
    id: "gs1",
    name: "GS1 Standards",
    icon: Database,
    description: "Connect to GS1 for global standards for business communication",
  },
  {
    id: "supplier",
    name: "Supplier Data",
    icon: ShoppingCart,
    description: "For hospitals: Connect to supplier inventory and product data",
  },
  {
    id: "hospital",
    name: "Hospital Data",
    icon: Server,
    description: "For suppliers: Connect to hospital inventory and demand data",
  },
]

// Update the component to include organization type selection
export function DataSourceConnector() {
  const [sourceType, setSourceType] = useState<string>("")
  const [connectionMethod, setConnectionMethod] = useState<string>("api")
  const [isConnecting, setIsConnecting] = useState(false)
  const [orgType, setOrgType] = useState<string>("hospital")

  const handleConnect = () => {
    setIsConnecting(true)
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      // Handle successful connection
    }, 2000)
  }

  // Filter source types based on organization type
  const filteredSourceTypes = sourceTypes.filter((type) => {
    if (orgType === "hospital" && type.id === "supplier") return true
    if (orgType === "supplier" && type.id === "hospital") return true
    if (type.id !== "supplier" && type.id !== "hospital") return true
    return false
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-type">Organization Type</Label>
        <Select value={orgType} onValueChange={setOrgType}>
          <SelectTrigger id="org-type">
            <SelectValue placeholder="Select your organization type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital">Hospital / Healthcare Provider</SelectItem>
            <SelectItem value="supplier">Supplier / Manufacturer</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source-type">Source Type</Label>
        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger id="source-type">
            <SelectValue placeholder="Select a data source type" />
          </SelectTrigger>
          <SelectContent>
            {filteredSourceTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center">
                  <type.icon className="mr-2 h-4 w-4" />
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sourceType && (
        <>
          <div className="space-y-2">
            <Label>Connection Method</Label>
            <Tabs defaultValue="api" value={connectionMethod} onValueChange={setConnectionMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="api">API Connection</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="api" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API URL</Label>
                  <Input id="api-url" placeholder="https://api.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" />
                </div>
                {(sourceType === "ecri" ||
                  sourceType === "gs1" ||
                  sourceType === "supplier" ||
                  sourceType === "hospital") && (
                  <div className="space-y-2">
                    <Label htmlFor="credentials">Authentication Credentials</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input id="username" placeholder="Username" />
                      <Input id="password" type="password" placeholder="Password" />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="file" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Data File</Label>
                  <Input id="file-upload" type="file" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refresh-frequency">Refresh Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="refresh-frequency">
                <SelectValue placeholder="Select refresh frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Data Source"}
          </Button>
        </>
      )}
    </div>
  )
}
