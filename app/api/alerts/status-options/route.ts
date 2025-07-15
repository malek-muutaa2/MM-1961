import { NextResponse } from "next/server"
import { getStatusOptions } from "@/lib/alert-utils"

export async function GET() {
    try {
        // Récupérer les options de statut à partir de l'enum de la base de données
        const statusOptions = getStatusOptions()

        return NextResponse.json({ statusOptions })
    } catch (error) {
        console.error("Error fetching status options:", error)
        return NextResponse.json({ error: "Failed to fetch status options" }, { status: 500 })
    }
}
