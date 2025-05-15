import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export type CreateUserParams = {
  name: string
  email: string
  password: string
  jobTitle?: string
  department?: string
  workDomain?: string
  organization?: string
}

export async function createUser(params: CreateUserParams) {
  const { name, email, password, jobTitle, department, workDomain, organization } = params

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create the user
  const [newUser] = await db
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
    .returning()

  return newUser
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user || null
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user || null
}
