import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { updateUserProfile } from "@/lib/user"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Schema de validation pour les données du profil
const updateProfileSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(255, "Le nom est trop long"),
    phone: z.string().optional().nullable(),
    jobTitle: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    workDomain: z.string().optional().nullable(),
    organization: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    image: z.string().optional().nullable(), // Accepter null explicitement
})

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
        }

        const body = await request.json()
        const updatedAt = new Date().toISOString()
        console.log(updatedAt, "Date de mise à jour du profil")
        // Nettoyer les données - convertir null en undefined pour les champs optionnels
        const cleanedBody = {
            ...body,
            jobTitle: body.jobTitle || undefined,
            department: body.department || undefined,
            workDomain: body.workDomain || undefined,
            organization: body.organization || undefined,
            bio: body.bio || undefined,
            image: body.image === null ? null : body.image || undefined, // Préserver null explicite
            updatedAt: new Date().toISOString(), // Ajouter la date de mise à jour
        }

        // Validation des données
        const validationResult = updateProfileSchema.safeParse(cleanedBody)

        if (!validationResult.success) {
            console.error("Erreur de validation:", validationResult.error.errors)
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: validationResult.error.errors,
                },
                { status: 400 },
            )
        }

        const profileData = validationResult.data

        // Mise à jour du profil
        const updatedUser = await updateUserProfile(user.id, profileData)

        if (!updatedUser) {
            return NextResponse.json({ error: "Erreur lors de la mise à jour du profil" }, { status: 500 })
        }

        return NextResponse.json(
            {
                message: "Profil mis à jour avec succès",
                user: updatedUser,
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error)
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
    }
}
