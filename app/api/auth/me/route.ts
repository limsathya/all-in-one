import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
        },
      })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false, error: "Server error" }, { status: 500 })
  }
}

