"use client"

import React, {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ArrowLeft, FileText, Lock} from "lucide-react"
import Link from "next/link"
import {ForecastProductTimeline} from "@/components/rafed-provider/forecast-product-timeline"
import {ForecastDataTable} from "@/components/rafed-provider/forecast-data-table"
import {ForecastAnomalies} from "@/components/rafed-provider/forecast-anomalies"
import {AppAbility} from "@/lib/casl/ability";
import {useAbility} from "@/lib/casl/permissions-provider";

export default function ForecastDetailsPage({params}: any) {
    // Unwrap params using React.use() to follow the new Next.js pattern
    const unwrappedParams: any = React.use(params)
    console.log("unwrappedParams", unwrappedParams)
    const forecastId = unwrappedParams.id;
    const ability: AppAbility = useAbility()
    const [productCount, setProductCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Mock data for the example
    const forecastData = {
        id: forecastId,
        fileName: "forecast-may-2025.xlsx",
        uploadDate: "2025-04-15T10:30:00Z",
        forecastPeriod: "May 2025",
        status: "submitted" as const,
        totalQuantity: 28750,
        fileSize: "2.4 MB",
    }

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/products")

                if (!response.ok) {
                    throw new Error("Failed to fetch products")
                }

                const products = await response.json()
                setProductCount(products.length)
            } catch (error) {
                console.error("Error fetching product count:", error)
                // Fallback to a default value if the API call fails
                setProductCount(0)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProductCount()
    }, [])

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Button asChild variant="ghost" className="mb-2 -ml-2 flex items-center gap-1 text-muted-foreground">
                    <Link href="/rafed-provider/history">
                        <ArrowLeft className="h-4 w-4"/>
                        Back to History
                    </Link>
                </Button>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{forecastData.fileName}</h1>
                        <p className="text-muted-foreground">
                            Forecast for {forecastData.forecastPeriod} • Uploaded on{" "}
                            {new Date(forecastData.uploadDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Forecast Period</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{forecastData.forecastPeriod}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                <span className="text-muted-foreground">Loading...</span>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold">{productCount}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="chart" className="mt-6">
                <TabsList>
                    <TabsTrigger value="chart">Chart View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                    <TabsTrigger value="file">File Information</TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Forecast Timeline</CardTitle>
                            <CardDescription>
                                Historical, provider forecast, and Rafed adjusted forecast quantities for selected
                                product
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ability.can('read', 'ForecastData') ?
                                <ForecastProductTimeline forecastExecutionId={Number(forecastId)}/>
                                : (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                                                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">Access Restricted</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    You do not have permission to view forecast data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="table" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Données de prévision</CardTitle>
                            <CardDescription>Vue détaillée de toutes les prévisions pour cette
                                exécution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ability.can('read', 'ForecastData') ?
                                <ForecastDataTable forecastExecutionId={Number(forecastId)}/>
                                : (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                                                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">Access Restricted</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    You do not have permission to view forecast data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="anomalies" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Forecast Anomalies</CardTitle>
                            <CardDescription>Potential issues detected in your forecast data that may require
                                review</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ability.can('read', 'ForecastData') ?
                                <ForecastAnomalies forecastId={forecastId}/>
                                : (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                                                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">Access Restricted</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    You do not have permission to view forecast data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="file" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>File Information</CardTitle>
                            <CardDescription>Details about the uploaded forecast file</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ability.can('read', 'ForecastData') ?

                                <div className="rounded-lg border p-4">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-md bg-primary/10 p-2">
                                            <FileText className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{forecastData.fileName}</h3>
                                            <p className="text-sm text-muted-foreground">Excel Spreadsheet
                                                • {forecastData.fileSize}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Upload Date</div>
                                            <div>{new Date(forecastData.uploadDate).toLocaleString()}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Status</div>
                                            <div className="text-green-600">Submitted</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Validation Date</div>
                                            <div>{new Date(forecastData.uploadDate).toLocaleString()}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">File Size</div>
                                            <div>{forecastData.fileSize}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Rows</div>
                                            <div>{isLoading ? "Loading..." : `${productCount + 1} (including header)`}</div>
                                        </div>
                                    </div>
                                </div>
                                : (
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                                                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">Access Restricted</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    You do not have permission to view forecast data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
