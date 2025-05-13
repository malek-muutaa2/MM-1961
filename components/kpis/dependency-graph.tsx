"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { type KPI, kpiData } from "@/types/kpi-types"
import { generateDependencyMatrix } from "@/types/kpi-dependency-model"

interface DependencyGraphProps {
  simulatedKPIs?: KPI[]
  originalKPIs?: KPI[]
}

export function DependencyGraph({ simulatedKPIs = kpiData, originalKPIs = kpiData }: DependencyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Generate nodes and links based on our KPIs
  const { relationships } = generateDependencyMatrix()

  // Create nodes from KPIs
  const nodes = simulatedKPIs.map((kpi) => {
    const originalKPI = originalKPIs.find((k) => k.id === kpi.id)
    const hasChanged = originalKPI && Math.abs(kpi.currentValue - originalKPI.currentValue) > 0.1

    return {
      id: kpi.id,
      name: kpi.name,
      group: kpi.category === "continuous_operations" ? 1 : 2,
      value: kpi.currentValue,
      status: kpi.status,
      hasChanged,
      changePercent: originalKPI ? ((kpi.currentValue - originalKPI.currentValue) / originalKPI.currentValue) * 100 : 0,
    }
  })

  // Create links from relationships
  const links = relationships.map((rel) => ({
    source: rel.source,
    target: rel.target,
    value: 1,
    type: rel.type,
    strength: Math.abs(rel.value),
  }))

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 500

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("style", "max-height: 500px; font: 12px sans-serif;")

    // Create a simulation with forces
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    // Define arrow markers for different relationship types
    const defs = svg.append("defs")

    defs
      .append("marker")
      .attr("id", "arrow-positive")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#10B981")
      .attr("d", "M0,-5L10,0L0,5")

    defs
      .append("marker")
      .attr("id", "arrow-negative")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#EF4444")
      .attr("d", "M0,-5L10,0L0,5")

    defs
      .append("marker")
      .attr("id", "arrow-complex")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#6B7280")
      .attr("d", "M0,-5L10,0L0,5")

    // Create the links
    const link = svg
      .append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", (d) => (d.type === "positive" ? "#10B981" : d.type === "negative" ? "#EF4444" : "#6B7280"))
      .attr("stroke-width", (d) => 1 + d.strength * 2)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`)
      .attr("fill", "none")

    // Create a group for each node
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))
      .on("mouseover", function (event, d) {
        // Highlight this node and its connections
        d3.select(this).select("circle").attr("stroke-width", 3)

        // Highlight connected links
        link
          .attr("stroke-opacity", (l) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.1))
          .attr("stroke-width", (l) => (l.source.id === d.id || l.target.id === d.id ? 2 + l.strength * 2 : 1))

        // Highlight connected nodes
        node
          .select("circle")
          .attr("stroke-opacity", (n) =>
            n.id === d.id ||
            links.some(
              (l) => (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id),
            )
              ? 1
              : 0.3,
          )

        // Show tooltip
        const tooltip = d3.select("#graph-tooltip")
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(`
            <div class="font-medium">${d.name}</div>
            <div class="text-sm">Value: ${d.value}</div>
            ${
              d.hasChanged
                ? `<div class="text-sm ${d.changePercent > 0 ? "text-green-500" : "text-red-500"}">
              Change: ${d.changePercent > 0 ? "+" : ""}${d.changePercent.toFixed(1)}%
            </div>`
                : ""
            }
          `)
      })
      .on("mouseout", function () {
        // Reset highlights
        d3.select(this).select("circle").attr("stroke-width", 2)
        link.attr("stroke-opacity", 0.6).attr("stroke-width", (d) => 1 + d.strength * 2)
        node.select("circle").attr("stroke-opacity", 1)

        // Hide tooltip
        d3.select("#graph-tooltip").style("display", "none")
      })

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => (d.hasChanged ? 14 : 10))
      .attr("fill", (d) => {
        if (d.hasChanged) {
          return d.changePercent > 0 ? "#10B981" : "#EF4444"
        }
        return d.group === 1 ? "#3B82F6" : "#F59E0B"
      })
      .attr("stroke", (d) => {
        if (d.status === "warning") return "#F59E0B"
        if (d.status === "critical") return "#EF4444"
        return "#10B981"
      })
      .attr("stroke-width", 2)

    // Add text labels
    node
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text((d) => (d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name))
      .attr("font-size", "10px")
      .attr("fill", "currentColor")

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })

      node.attr("transform", (d) => {
        // Keep nodes within bounds
        d.x = Math.max(50, Math.min(width - 50, d.x))
        d.y = Math.max(50, Math.min(height - 50, d.y))
        return `translate(${d.x},${d.y})`
      })
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [nodes, links])

  return (
    <div className="w-full overflow-auto relative">
      <div
        id="graph-tooltip"
        className="absolute hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border text-sm z-10"
      ></div>
      <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Continuous Operations</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Financial Optimization</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Positive Change</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Negative Change</span>
        </div>
      </div>
      <svg ref={svgRef} width="100%" height="500" />
    </div>
  )
}
