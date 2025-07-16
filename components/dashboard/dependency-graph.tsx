"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

// Sample data for KPI dependencies
const nodes = [
  { id: "inventory", name: "Inventory Levels", group: 1 },
  { id: "stockout", name: "Stockout Risk", group: 1 },
  { id: "capital", name: "Capital Tied Up", group: 1 },
  { id: "order", name: "Order Frequency", group: 2 },
  { id: "shipping", name: "Shipping Costs", group: 2 },
  { id: "supplier", name: "Supplier Diversity", group: 2 },
  { id: "substitution", name: "Product Substitution", group: 3 },
  { id: "expiry", name: "Expiry Management", group: 3 },
]

const links = [
  { source: "inventory", target: "stockout", value: 1, type: "negative" },
  { source: "inventory", target: "capital", value: 1, type: "positive" },
  { source: "order", target: "inventory", value: 1, type: "negative" },
  { source: "order", target: "shipping", value: 1, type: "positive" },
  { source: "supplier", target: "stockout", value: 1, type: "negative" },
  { source: "substitution", target: "inventory", value: 1, type: "complex" },
  { source: "expiry", target: "inventory", value: 1, type: "positive" },
]

export function DependencyGraph() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 400

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("style", "max-height: 400px; font: 12px sans-serif;")

    // Create a simulation with forces
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Define arrow markers for different relationship types
    const defs = svg.append("defs")

    defs
      .append("marker")
      .attr("id", "arrow-positive")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
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
      .attr("refX", 20)
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
      .attr("refX", 20)
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
      .attr("stroke", (d: any) => (d.type === "positive" ? "#10B981" : d.type === "negative" ? "#EF4444" : "#6B7280"))
      .attr("stroke-width", 2)
      .attr("marker-end", (d: any) => `url(#arrow-${d.type})`)
      .attr("fill", "none")

    // Create the nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => (d.group === 1 ? "#3B82F6" : d.group === 2 ? "#F59E0B" : "#8B5CF6"))

    // Add text labels
    node
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text((d: any) => d.name)
      .attr("font-size", "10px")
      .attr("fill", "currentColor")

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy)
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event:  any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [])

  return (
    <div className="w-full overflow-auto">
      <svg ref={svgRef} width="100%" height="400" />
    </div>
  )
}
