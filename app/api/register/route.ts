import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-utils"
import { z } from "zod"

// Define validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  workDomain: z.string().optional(),
  organization: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ message: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { name, email, password, jobTitle, department, workDomain, organization } = validationResult.data

    // Create the user
    await createUser({
      name,
      email,
      password,
      jobTitle,
      department,
      workDomain,
      organization,
    })

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message === "User with this email already exists") {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
