"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ExternalLink, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type IntegrationType = {
  id: string
  name: string
  description: string
  connected: boolean
  lastSync?: string
}

export function IntegrationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [integrations, setIntegrations] = useState<IntegrationType[]>([
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect to your Salesforce account to sync customer and sales data",
      connected: true,
      lastSync: "2 hours ago",
    },
    {
      id: "sap",
      name: "SAP ERP",
      description: "Connect to your SAP ERP system for inventory and procurement data",
      connected: true,
      lastSync: "1 day ago",
    },
    {
      id: "ms-teams",
      name: "Microsoft Teams",
      description: "Receive notifications and share insights directly in Microsoft Teams",
      connected: false,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Receive notifications and share insights directly in Slack",
      connected: false,
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync events and deadlines with your Google Calendar",
      connected: true,
      lastSync: "3 hours ago",
    },
  ])

  const toggleIntegration = (id: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIntegrations(
        integrations.map((integration) =>
          integration.id === id
            ? {
                ...integration,
                connected: !integration.connected,
                lastSync: !integration.connected ? "Just now" : undefined,
              }
            : integration,
        ),
      )
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Applications</CardTitle>
          <CardDescription>Manage your connected applications and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration, index) => (
            <div key={integration.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <span className="font-medium">{integration.name}</span>
                    {integration.connected && (
                      <Badge variant="outline" className="ml-2">
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  {integration.connected && integration.lastSync && (
                    <p className="text-xs text-muted-foreground">Last synced: {integration.lastSync}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {integration.connected && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  )}
                  <Switch
                    checked={integration.connected}
                    onCheckedChange={() => toggleIntegration(integration.id)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {index < integrations.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add New Integration</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Manage your API keys and access tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Personal API Key</p>
                <p className="text-sm text-muted-foreground">Use this key to access the MUUTAA.ML API</p>
              </div>
              <Button variant="outline" size="sm">
                Generate Key
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Webhook URL</p>
                <p className="text-sm text-muted-foreground">Receive real-time updates via webhook</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
