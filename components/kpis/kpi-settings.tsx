"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample KPI settings data
const kpiSettingsData = {
  "inventory-levels": {
    name: "Inventory Levels",
    description: "Track inventory levels across all locations and categories",
    unit: "percentage",
    targetValue: 90,
    warningThreshold: 85,
    criticalThreshold: 80,
    dataSourceIds: ["erp-system", "inventory-management"],
    refreshFrequency: "daily",
    notifications: {
      email: true,
      inApp: true,
      alertThreshold: 5,
    },
  },
}

export function KPISettings({ kpiId }: { kpiId: string }) {
  // In a real app, you would fetch the KPI settings based on the ID
  const initialSettings = kpiSettingsData[kpiId as keyof typeof kpiSettingsData] || {
    name: "Unknown KPI",
    description: "KPI settings not found",
    unit: "percentage",
    targetValue: 0,
    warningThreshold: 0,
    criticalThreshold: 0,
    dataSourceIds: [],
    refreshFrequency: "daily",
    notifications: {
      email: false,
      inApp: false,
      alertThreshold: 5,
    },
  }

  const [settings, setSettings] = useState(initialSettings)

  const handleSave = () => {
    // In a real app, you would save the settings to the backend
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about this KPI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">KPI Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={settings.unit} onValueChange={(value) => setSettings({ ...settings, unit: value })}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="currency">Currency ($)</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refresh-frequency">Refresh Frequency</Label>
                <Select
                  value={settings.refreshFrequency}
                  onValueChange={(value) => setSettings({ ...settings, refreshFrequency: value })}
                >
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threshold Settings</CardTitle>
              <CardDescription>Configure target value and alert thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="target-value">Target Value</Label>
                  <span className="text-sm font-medium">{settings.targetValue}%</span>
                </div>
                <Slider
                  id="target-value"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.targetValue]}
                  onValueChange={(value) => setSettings({ ...settings, targetValue: value[0] })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="warning-threshold">Warning Threshold</Label>
                  <span className="text-sm font-medium">{settings.warningThreshold}%</span>
                </div>
                <Slider
                  id="warning-threshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.warningThreshold]}
                  onValueChange={(value) => setSettings({ ...settings, warningThreshold: value[0] })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="critical-threshold">Critical Threshold</Label>
                  <span className="text-sm font-medium">{settings.criticalThreshold}%</span>
                </div>
                <Slider
                  id="critical-threshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.criticalThreshold]}
                  onValueChange={(value) => setSettings({ ...settings, criticalThreshold: value[0] })}
                />
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="text-sm font-medium mb-2">Threshold Visualization</div>
                <div className="relative h-8 w-full rounded-md bg-background">
                  <div
                    className="absolute inset-y-0 left-0 bg-red-500 rounded-l-md"
                    style={{ width: `${settings.criticalThreshold}%` }}
                  ></div>
                  <div
                    className="absolute inset-y-0 bg-amber-500"
                    style={{
                      left: `${settings.criticalThreshold}%`,
                      width: `${settings.warningThreshold - settings.criticalThreshold}%`,
                    }}
                  ></div>
                  <div
                    className="absolute inset-y-0 bg-green-500"
                    style={{
                      left: `${settings.warningThreshold}%`,
                      width: `${100 - settings.warningThreshold}%`,
                      borderTopRightRadius: "0.375rem",
                      borderBottomRightRadius: "0.375rem",
                    }}
                  ></div>
                  <div
                    className="absolute inset-y-0 w-1 bg-blue-500 border-2 border-white"
                    style={{
                      left: `${settings.targetValue}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Settings</CardTitle>
              <CardDescription>Configure which data sources are used for this KPI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="erp-system"
                    checked={settings.dataSourceIds.includes("erp-system")}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataSourceIds: checked
                          ? [...settings.dataSourceIds, "erp-system"]
                          : settings.dataSourceIds.filter((id) => id !== "erp-system"),
                      })
                    }}
                  />
                  <Label htmlFor="erp-system">ERP System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inventory-management"
                    checked={settings.dataSourceIds.includes("inventory-management")}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataSourceIds: checked
                          ? [...settings.dataSourceIds, "inventory-management"]
                          : settings.dataSourceIds.filter((id) => id !== "inventory-management"),
                      })
                    }}
                  />
                  <Label htmlFor="inventory-management">Inventory Management System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="procurement-system"
                    checked={settings.dataSourceIds.includes("procurement-system")}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataSourceIds: checked
                          ? [...settings.dataSourceIds, "procurement-system"]
                          : settings.dataSourceIds.filter((id) => id !== "procurement-system"),
                      })
                    }}
                  />
                  <Label htmlFor="procurement-system">Procurement System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="financial-system"
                    checked={settings.dataSourceIds.includes("financial-system")}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataSourceIds: checked
                          ? [...settings.dataSourceIds, "financial-system"]
                          : settings.dataSourceIds.filter((id) => id !== "financial-system"),
                      })
                    }}
                  />
                  <Label htmlFor="financial-system">Financial System</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified about this KPI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: checked,
                      },
                    })
                  }}
                />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="in-app-notifications"
                  checked={settings.notifications.inApp}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        inApp: checked,
                      },
                    })
                  }}
                />
                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                  <span className="text-sm font-medium">{settings.notifications.alertThreshold}%</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Notify me when the KPI changes by this percentage or more
                </div>
                <Slider
                  id="alert-threshold"
                  min={1}
                  max={20}
                  step={1}
                  value={[settings.notifications.alertThreshold]}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        alertThreshold: value[0],
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
