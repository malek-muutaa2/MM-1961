"use server"
import { asc, desc, eq, type InferModel, sql } from "drizzle-orm"
import { db } from "./db/dbpostgres"
import { twoFactorAuth, users } from "./db/schema"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export const getusers = async (
    offsetItems?: number,
    search?: string | null,
    size?: number,
    column?: string,
    order?: string,
) => {
    try {
        const searchWord = `%${search}%`
        return await db.query.users.findMany({
            // orderBy: (configurations:any, { asc }: any) => [asc(configurations.updated_at)],
            ...(size && { limit: size }),
            ...(offsetItems && { offset: offsetItems }),
            ...(column &&
                column in users && {
                    orderBy:
                        order === "asc" ? [asc(users[column])] : order === "desc" ? [desc(users[column])] : [desc(users.createdAt)],
                }),

            ...(search
                ? {
                    where: sql`
                        lower
                        (${users.email} ::
                            text)
                        LIKE lower(
                        ${searchWord}
                        )
                        or
                        lower
                        (
                        ${users.name}
                        ::
                        text
                        )
                        LIKE
                        lower
                        (
                        ${searchWord}
                        )

                        or
                        lower
                        (
                        ${users.organization}
                        )
                        LIKE
                        lower
                        (
                        ${searchWord}
                        )

                    `,
                }
                : { where: null }),
        })
    } catch (e: any) {
        console.log("getDictGtin error", e?.message)
        return []
    }
}

export const UpdateUser2F = async (secretbase32: string, id: number) => {
    try {
        return await db
            .update(twoFactorAuth)
            .set({
                isTwoFactorEnabled: true,
                totpSecret: secretbase32,
            })
            .where(eq(twoFactorAuth.userId, id))
    } catch (e: any) {
        console.log("UpdateUserToken error", e?.message)
        return []
    }
}

export const UpdateUserToken = async (resetpasswordtoken: string, email: string) => {
    try {
        const today = new Date()

        const expiryDate = new Date(today.setDate(today.getDate() + 1)) // 24 hours from now

        // console.log("result", result);

        return await db
            .update(users)
            .set({
                resetpasswordtoken: resetpasswordtoken,
                passwordresettokenexpiry: expiryDate,
            })
            .where(eq(users.email, email))
            .returning({
                id: users.id,
                resetpasswordtoken: users.resetpasswordtoken,
                passwordresettokenexpiry: users.passwordresettokenexpiry,
            })
    } catch (e: any) {
        console.log("UpdateUserToken error", e?.message)
        return []
    }
}

export type UserRow = InferModel<typeof users, "select">

export const findUserById = async (userId: number): Promise<InferModel<typeof users>[]> => {
    try {
        return await db.select().from(users).where(eq(users.id, userId))
    } catch (e: any) {
        console.log("findUserById error", e?.message)
        return []
    }
}

export const isTwoFactorEnabled = async (userId: number) => {
    try {
        return await db
            .select({
                userId: twoFactorAuth.userId,
                isTwoFactorEnabled: twoFactorAuth.isTwoFactorEnabled,
            })
            .from(twoFactorAuth)
            .where(eq(twoFactorAuth.userId, userId))
    } catch (e: any) {
        console.log("findUserById error", e?.message)
        return []
    }
}

export const Enable2fa = async (isActivate: boolean, userId: number) => {
    try {
        await db.update(twoFactorAuth).set({ isTwoFactorEnabled: isActivate }).where(eq(twoFactorAuth.userId, userId))
        return { success: "2FA enabled successfully." }
    } catch (e: any) {
        console.log("Enable2fa error", e?.message)
        return []
    }
}

export const findUniqueUser = async (email: string | null) => {
    try {
        if (email) {
            return await db
                .selectDistinct({
                    id: users.id,
                    email: users.email,
                    password: users.password,
                    role: users.role,
                    name: users.name,
                    isTwoFactorEnabled: twoFactorAuth.isTwoFactorEnabled,
                    totpSecret: twoFactorAuth.totpSecret,
                    isDisabled: users.isDisabled,
                    passwordupdatedat: users.passwordupdatedat,
                    resetpasswordtoken: users.resetpasswordtoken,
                    passwordresettokenexpiry: users.passwordresettokenexpiry,

                    deleted_at: users.deleted_at,
                })
                .from(users)
                .leftJoin(twoFactorAuth, eq(users.id, twoFactorAuth.userId))
                .where(eq(users.email, email))
        } else {
            return []
        }
    } catch (e: any) {
        console.log("findUniqueUser error", e?.message)
        return []
    }
}

export const generateTwoFactorToken = async (id: number, email: string) => {
    const token = crypto.randomInt(100_000, 1000_000).toString()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const expiredate = new Date()
    const hashedtoken = await bcrypt.hash(token, 10)

    // Display the current date and time
    console.log("expiredate", expiredate)

    // Add one hour to the current date
    expiredate.setHours(expiredate.getHours() + 1)

    const existingToken = await db.select().from(twoFactorAuth).where(eq(twoFactorAuth.userId, id))

    if (existingToken) {
        await db
            .update(twoFactorAuth)
            .set({ twoFactorToken: "", twoFactorTokenExpiry: null })
            .where(eq(twoFactorAuth.userId, id))
    }
    const twoFactorToken = await db
        .update(twoFactorAuth)
        .set({
            twoFactorToken: hashedtoken,
            twoFactorTokenExpiry: expiredate,
        })
        .where(eq(twoFactorAuth.userId, id))
        .returning()
    const isMatch = await bcrypt.compare(token, twoFactorToken[0]?.twoFactorToken)
    if (isMatch) {
        // If the passwords do not match, return null to indicate unsuccessful authentication
        return {
            twoFactorToken,
            token, // the original unhashed token
        }
    }
}

export const findUerbyToken = async (token: string) => {
    try {
        if (token) {
            return await db.selectDistinct().from(users).where(eq(users.resetpasswordtoken, token))
        } else {
            return []
        }
    } catch (e: any) {
        console.log("findUerbyToken error", e?.message)
        return []
    }
}

export const UpdateUserPassword = async (hashedpassword: string, id: number) => {
    try {
        console.log("Mise à jour du mot de passe pour l'utilisateur:", id)

        const currentDate = new Date()
        console.log("Date de mise à jour:", currentDate)

        const result = await db
            .update(users)
            .set({
                password: hashedpassword,
                passwordupdatedat: currentDate,
                updatedAt: currentDate, // Mise à jour du champ updated_at
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                updatedAt: users.updatedAt,
                passwordupdatedat: users.passwordupdatedat,
            })

        console.log("Résultat de la mise à jour:", result)
        return result
    } catch (e: any) {
        console.log("UpdateUserPassword error", e?.message)
        return []
    }
}

export const updateLock = async (newStatus: boolean, userId: number) => {
    try {
        return await db.update(users).set({ isDisabled: newStatus }).where(eq(users.id, userId))
    } catch (e: any) {
        console.log("updateLock error", e?.message)
        return []
    }
}

export const updateUserProfile = async (
    userId: number,
    profileData: {
        name?: string
        phone?: string
        jobTitle?: string
        department?: string
        workDomain?: string
        organization?: string
        bio?: string
        image?: string
    },
) => {
    try {
        const updateData: any = {}

        // Ne mettre à jour que les champs fournis
        if (profileData.name !== undefined) updateData.name = profileData.name
        if (profileData.jobTitle !== undefined) updateData.jobTitle = profileData.jobTitle
        if (profileData.department !== undefined) updateData.department = profileData.department
        if (profileData.workDomain !== undefined) updateData.workDomain = profileData.workDomain
        if (profileData.organization !== undefined) updateData.organization = profileData.organization
        if (profileData.bio !== undefined) updateData.bio = profileData.bio
        if (profileData.image !== undefined) updateData.image = profileData.image

        // Ajouter la date de mise à jour
        updateData.updatedAt = new Date()

        console.log("Données à mettre à jour:", updateData)

        const result = await db.update(users).set(updateData).where(eq(users.id, userId)).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            jobTitle: users.jobTitle,
            department: users.department,
            workDomain: users.workDomain,
            organization: users.organization,
            bio: users.bio,
            image: users.image,
            updatedAt: users.updatedAt,
        })

        console.log("Résultat de la mise à jour du profil:", result)
        return result[0] || null
    } catch (e: any) {
        console.log("updateUserProfile error", e?.message)
        return null
    }
}
