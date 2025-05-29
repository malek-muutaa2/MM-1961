import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { comparePassword, hashPassword } from "@/lib/auth-utils"
import { UpdateUserPassword, findUserById } from "@/lib/user"
import { z } from "zod"

export const dynamic = "force-dynamic"

// Schema de validation pour le changement de mot de passe
const updatePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
        newPassword: z
            .string()
            .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
            .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
            .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
            .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
            .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
        confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
        }

        const body = await request.json()

        // Validation des données
        const validationResult = updatePasswordSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: validationResult.error.errors,
                },
                { status: 400 },
            )
        }

        const { currentPassword, newPassword } = validationResult.data

        // Récupérer l'utilisateur avec son mot de passe actuel
        const userWithPassword = await findUserById(user.id)

        if (!userWithPassword || userWithPassword.length === 0) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        // Vérifier que le mot de passe actuel est correct
        const isPasswordValid = await comparePassword(currentPassword, userWithPassword[0].password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 403 })
        }

        // Vérifier que le nouveau mot de passe est différent de l'ancien
        if (currentPassword === newPassword) {
            return NextResponse.json({ error: "Le nouveau mot de passe doit être différent de l'ancien" }, { status: 400 })
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await hashPassword(newPassword)

        // Mettre à jour le mot de passe
        const updateResult = await UpdateUserPassword(hashedPassword, user.id)

        console.log("Résultat de la mise à jour du mot de passe:", updateResult)

        return NextResponse.json(
            {
                message: "Mot de passe mis à jour avec succès",
                updatedAt: new Date().toISOString(),
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error)
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
    }
}
