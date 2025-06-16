"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadInterface from "@/components/upload-system/upload-interface"
import ConfigurationManager from "@/components/upload-system/configuration-manager"
import EnhancedFileManager from "@/components/upload-system/enhanced-file-manager"
import type { UploadConfiguration, UploadStorageConfiguration, OrganizationType } from "@/types/upload"
import EnhancedUploadInterface from "@/components/upload-system/enhanced-upload-interface"
import {useToast} from "@/hooks/use-toast";

export default function HomePage() {
  const [configurations, setConfigurations] = useState<UploadConfiguration[]>([])
  const [storageConfigs, setStorageConfigs] = useState<UploadStorageConfiguration[]>([])
  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [configsRes, storageRes, orgTypesRes] = await Promise.all([
          fetch("/api/configurations"),
          fetch("/api/storage-configurations"),
          fetch("/api/organization-types"),
        ])

        const [configsData, storageData, orgTypesData] = await Promise.all([
          configsRes.json(),
          storageRes.json(),
          orgTypesRes.json(),
        ])

        setConfigurations(configsData)
        setStorageConfigs(storageData)
        setOrganizationTypes(orgTypesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveConfiguration = async (config: Partial<UploadConfiguration>) => {
    try {
      if (config.id) {
        // Update existing
        const response = await fetch(`/api/configurations/${config.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        })

        if (response.ok) {
          const updatedConfig = await response.json()
          setConfigurations((prev) => prev.map((c) => (c.id === config.id ? updatedConfig : c)))
            toast({
                title: "Configuration updated",
                description: "Your configuration has been updated successfully.",
                variant: "default",
            })
        }
      } else {
        // Create new
        const response = await fetch("/api/configurations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        })

        if (response.ok) {
          const newConfig = await response.json()
          setConfigurations((prev) => [...prev, newConfig])
            toast({
                title: "Configuration saved",
                description: "Your configuration has been saved successfully.",
                variant: "default",
            })
        }
      }
    } catch (error) {
      console.error("Failed to save configuration:", error)
        toast({
            title: "Error",
            description: "Failed to save configuration. Please try again.",
            variant: "destructive",
        })
    }
  }

  const handleDeleteConfiguration = async (id: number) => {
    try {
      const response = await fetch(`/api/configurations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setConfigurations((prev) => prev.filter((c) => c.id !== id))
        toast({
            title: "Configuration deleted",
            description: "Your configuration has been deleted successfully.",
            variant: "default",
        })
      }
    } catch (error) {
      console.error("Failed to delete configuration:", error)
        toast({
            title: "Error",
            description: "Failed to delete configuration. Please try again.",
            variant: "destructive",
        })
    }
  }

  const handleSaveStorageConfig = async (config: Partial<UploadStorageConfiguration>) => {
    try {
      if (config.id) {
        // Update existing
        const response = await fetch(`/api/storage-configurations/${config.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        })

        if (response.ok) {
          const updatedConfig = await response.json()
          setStorageConfigs((prev) => prev.map((c) => (c.id === config.id ? updatedConfig : c)))
          toast({
                title: "Storage configuration saved",
                description: "Your storage configuration has been saved successfully.",
                variant: "default",
          })
        }
      } else {
        // Create new
        const response = await fetch("/api/storage-configurations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        })

        if (response.ok) {
          const newConfig = await response.json()
          setStorageConfigs((prev) => [...prev, newConfig])
            toast({
                    title: "Storage configuration created",
                    description: "Your storage configuration has been created successfully.",
                    variant: "default",
            })
        }
      }
    } catch (error) {
      console.error("Failed to save storage configuration:", error)
        toast({
            title: "Error",
            description: "Failed to save storage configuration. Please try again.",
            variant: "destructive",
        })
    }
  }

  const handleDeleteStorageConfig = async (id: number) => {
    try {
      const response = await fetch(`/api/storage-configurations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStorageConfigs((prev) => prev.filter((c) => c.id !== id))
        toast({
            title: "Storage configuration deleted",
            description: "Your storage configuration has been deleted successfully.",
            variant: "default",
        })
      }
    } catch (error) {
      console.error("Failed to delete storage configuration:", error)
        toast({
            title: "Error",
            description: "Failed to delete storage configuration. Please try again.",
            variant: "destructive",
        })
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">File Upload System</h1>
            <p className="text-muted-foreground">Generic file upload with configurable business rules and validation</p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              {/*<TabsTrigger value="files">Manage Files</TabsTrigger>*/}
              <TabsTrigger value="configure">Configurations</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <EnhancedUploadInterface configurations={configurations.filter((c) => c.active)} />
            </TabsContent>
            {/*<TabsContent value="upload">*/}
            {/*  <UploadInterface configurations={configurations.filter((c) => c.active)} />*/}
            {/*</TabsContent>*/}

            {/*<TabsContent value="files">*/}
            {/*  <EnhancedFileManager />*/}
            {/*</TabsContent>*/}

            <TabsContent value="configure">
              <ConfigurationManager
                  configurations={configurations}
                  storageConfigs={storageConfigs}
                  organizationTypes={organizationTypes}
                  onSaveConfig={handleSaveConfiguration}
                  onDeleteConfig={handleDeleteConfiguration}
                  onSaveStorage={handleSaveStorageConfig}
                  onDeleteStorage={handleDeleteStorageConfig}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
