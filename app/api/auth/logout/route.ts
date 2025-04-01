import { NextResponse } from "next/server"
import { logout } from "@/lib/auth"

export async function POST() {
  try {
    const success = await logout()

    if (success) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: "Failed to logout" }, { status: 500 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

