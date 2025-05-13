"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateDependencyMatrix } from "@/types/kpi-dependency-model"

export function DependencyMatrix() {
  const [showValues, setShowValues] = useState(true)
  const [highlightedKPI, setHighlightedKPI] = useState<string | null>(null)

  const { kpis, relationships } = generateDependencyMatrix()

  const getDependencyValue = (source: string, target: string) => {
    if (source === target) {
      return { value: 1, type: "self", description: "Self-correlation" }
    }

    // Check for direct relationship
    const directRel = relationships.find(
      (rel) => (rel.source === source && rel.target === target) || (rel.source === target && rel.target === source),
    )

    if (directRel) {
      return {
        value: directRel.source === source ? directRel.value : -directRel.value,
        type: directRel.type,
        description: directRel.description,
      }
    }

    return {
      value: 0,
      type: "none",
      description: "No significant correlation",
    }
  }

  const getCellColor = (value: number, type: string) => {
    if (type === "self") return "bg-gray-100 dark:bg-gray-800"
    if (type === "none") return "bg-gray-50 dark:bg-gray-900"

    if (value > 0.8) return "bg-green-100 dark:bg-green-900"
    if (value > 0.5) return "bg-green-50 dark:bg-green-800"
    if (value > 0.2) return "bg-green-50/50 dark:bg-green-900/50"

    if (value < -0.8) return "bg-red-100 dark:bg-red-900"
    if (value < -0.5) return "bg-red-50 dark:bg-red-800"
    if (value < -0.2) return "bg-red-50/50 dark:bg-red-900/50"

    return "bg-amber-50 dark:bg-amber-900/30"
  }

  const isHighlighted = (sourceId: string, targetId: string) => {
    if (!highlightedKPI) return false

    if (sourceId === highlightedKPI || targetId === highlightedKPI) return true

    // Check if there's a relationship between the highlighted KPI and this cell
    return relationships.some(
      (rel) =>
        (rel.source === highlightedKPI && (rel.target === sourceId || rel.target === targetId)) ||
        (rel.target === highlightedKPI && (rel.source === sourceId || rel.source === targetId)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Click on a KPI name to highlight its relationships</div>
        <Button variant="outline" size="sm" onClick={() => setShowValues(!showValues)}>
          {showValues ? "Show Colors Only" : "Show Values"}
        </Button>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-muted/50 sticky left-0 z-10">KPI</TableHead>
              {kpis.map((kpi) => (
                <TableHead
                  key={kpi.id}
                  className={`bg-muted/50 text-center ${highlightedKPI === kpi.id ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                  onClick={() => setHighlightedKPI(highlightedKPI === kpi.id ? null : kpi.id)}
                  style={{ cursor: "pointer" }}
                >
                  {kpi.name.length > 15 ? `${kpi.name.substring(0, 15)}...` : kpi.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpis.map((sourceKpi) => (
              <TableRow key={sourceKpi.id}>
                <TableCell
                  className={`font-medium bg-muted/50 sticky left-0 z-10 ${highlightedKPI === sourceKpi.id ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                  onClick={() => setHighlightedKPI(highlightedKPI === sourceKpi.id ? null : sourceKpi.id)}
                  style={{ cursor: "pointer" }}
                >
                  {sourceKpi.name.length > 15 ? `${sourceKpi.name.substring(0, 15)}...` : sourceKpi.name}
                </TableCell>
                {kpis.map((targetKpi) => {
                  const dependency = getDependencyValue(sourceKpi.id, targetKpi.id)
                  const highlighted = isHighlighted(sourceKpi.id, targetKpi.id)

                  return (
                    <TableCell
                      key={targetKpi.id}
                      className={`text-center ${getCellColor(dependency.value, dependency.type)} ${
                        highlighted ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              {showValues ? (
                                <span
                                  className={`font-medium ${
                                    dependency.value > 0
                                      ? "text-green-600 dark:text-green-400"
                                      : dependency.value < 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-500"
                                  }`}
                                >
                                  {dependency.value !== 0 ? dependency.value.toFixed(2) : "-"}
                                </span>
                              ) : (
                                <div
                                  className={`w-4 h-4 rounded-full ${
                                    dependency.value > 0.5
                                      ? "bg-green-500"
                                      : dependency.value > 0
                                        ? "bg-green-300"
                                        : dependency.value < -0.5
                                          ? "bg-red-500"
                                          : dependency.value < 0
                                            ? "bg-red-300"
                                            : "bg-gray-300"
                                  }`}
                                />
                              )}
                              {dependency.value !== 0 && dependency.type !== "self" && (
                                <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{dependency.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Correlation: {dependency.value.toFixed(2)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Positive correlation</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Negative correlation</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span>No significant correlation</span>
        </div>
      </div>
    </div>
  )
}
