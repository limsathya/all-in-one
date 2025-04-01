import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

// This endpoint will be called during the build process to initialize the database
export async function GET() {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, message: "Failed to initialize database" }, { status: 500 })
  }
}

