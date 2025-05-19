"use server"

import { db } from "@/lib/db/dbpostgres"
import { users } from "@/lib/db/schema"
import { hashPassword } from "@/lib/auth-utils"
import { redirect } from "next/navigation"

export type RegisterFormData = {
  name: string
  email: string
  password: string
  jobTitle?: string
  department?: string
  workDomain?: string
  organization?: string
}

export type RegisterResult = {
  success: boolean
  message: string
  userId?: number
}

/**
 * Server action to register a new user
 *
 * @param formData - User registration data
 * @returns Result object with success status and message
 */
export async function registerUser(formData: RegisterFormData): Promise<RegisterResult> {
  try {
    const { name, email, password, jobTitle, department, workDomain, organization } = formData

    // Validate required fields
    if (!name || !email || !password) {
      return {
        success: false,
        message: "Name, email, and password are required",
      }
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        jobTitle,
        department,
        workDomain,
        organization,
      })
      .returning({ id: users.id })

    return {
      success: true,
      message: "User registered successfully",
      userId: newUser[0].id,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

/**
 * Server action to handle form submission directly
 * This can be used with the form's action attribute
 */
export async function registerUserFromForm(formData: FormData) {
  const name = formData.get("fullName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const jobTitle = formData.get("jobTitle") as string
  const department = formData.get("department") as string
  const workDomain = formData.get("workDomain") as string
  const organization = formData.get("organization") as string

  const result = await registerUser({
    name,
    email,
    password,
    jobTitle,
    department,
    workDomain,
    organization,
  })

  if (!result.success) {
    // In a real application, you would want to return the error
    // and handle it in the form component
    throw new Error(result.message)
  }

  // Redirect to login page after successful registration
  redirect("/login")
}
