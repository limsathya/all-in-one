import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST() {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, message: "This endpoint is only available in development mode" },
        { status: 403 },
      )
    }

    await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, message: "Failed to initialize database" }, { status: 500 })
  }
}

