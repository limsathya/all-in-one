import { sql } from "@vercel/postgres"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { getAllowedDomains } from "./config"

// Function to validate if email is from allowed domain
export async function isValidEmailDomain(email: string): Promise<boolean> {
  const domain = email.split("@")[1]
  if (!domain) return false

  const allowedDomains = await getAllowedDomains()
  return allowedDomains.some(
    ({ domain: allowedDomain }) => domain === allowedDomain || domain.endsWith(`.${allowedDomain}`),
  )
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verify a password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Login function
export async function login(email: string, password: string): Promise<{ success: boolean; userId?: number }> {
  try {
    // Check domain first
    if (!(await isValidEmailDomain(email))) {
      return { success: false }
    }

    // Get user from database
    const result = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`

    if (result.rows.length === 0) {
      return { success: false }
    }

    const user = result.rows[0]

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash)

    if (!passwordValid) {
      return { success: false }
    }

    // Create session
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${user.id}, ${token}, ${expiresAt})`

    // Set cookie
    cookies().set({
      name: "session_token",
      value: token,
      httpOnly: true,
      path: "/",
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const token = cookies().get("session_token")?.value

    if (!token) {
      return null
    }

    // Get session
    const sessionResult = await sql`SELECT user_id, expires_at FROM sessions WHERE token = ${token}`

    if (sessionResult.rows.length === 0) {
      return null
    }

    const session = sessionResult.rows[0]

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await logout()
      return null
    }

    // Get user
    const userResult = await sql`SELECT id, email, full_name FROM users WHERE id = ${session.user_id}`

    if (userResult.rows.length === 0) {
      return null
    }

    return userResult.rows[0]
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Logout function
export async function logout() {
  try {
    const token = cookies().get("session_token")?.value

    if (token) {
      // Delete session
      await sql`DELETE FROM sessions WHERE token = ${token}`
    }

    // Clear cookie
    cookies().delete("session_token")

    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

// For client-side use only (mock implementation)
export const clientAuth = {
  login: async (email: string, password: string): Promise<boolean> => {
    // Call the API
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    return data.success
  },

  logout: async (): Promise<boolean> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    const data = await response.json()
    return data.success
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      return data.authenticated
    } catch (error) {
      return false
    }
  },
}

