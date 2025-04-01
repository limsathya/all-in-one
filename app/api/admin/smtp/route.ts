import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getSMTPConfig, updateSMTPConfig } from "@/lib/config"
import { testSMTPConfig } from "@/lib/email"

// Helper to check if user is admin
async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  // For simplicity, we're considering anyone with admin@limsathya.com as admin
  // In a real app, you'd have proper roles in the database
  return user.email === "admin@limsathya.com"
}

// Get SMTP configuration
export async function GET() {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const config = await getSMTPConfig()

    // Don't send the password back to the client
    const safeConfig = {
      ...config,
      password: config.password ? "********" : "", // Mask the password
    }

    return NextResponse.json({ config: safeConfig })
  } catch (error) {
    console.error("Error fetching SMTP config:", error)
    return NextResponse.json({ error: "Failed to fetch SMTP configuration" }, { status: 500 })
  }
}

// Update SMTP configuration
export async function POST(request: Request) {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { config } = data

    if (!config) {
      return NextResponse.json({ error: "Configuration is required" }, { status: 400 })
    }

    // Validate required fields
    if (!config.host || !config.port || !config.from) {
      return NextResponse.json({ error: "Host, port, and from email are required" }, { status: 400 })
    }

    // If the password is masked, get the existing password
    if (config.password === "********") {
      const existingConfig = await getSMTPConfig()
      config.password = existingConfig.password
    }

    const success = await updateSMTPConfig(config)

    if (success) {
      return NextResponse.json({ success: true, message: "SMTP configuration updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update SMTP configuration" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating SMTP config:", error)
    return NextResponse.json({ error: "Failed to update SMTP configuration" }, { status: 500 })
  }
}

// Test SMTP configuration
export async function PUT(request: Request) {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { config, testEmail } = data

    if (!config || !testEmail) {
      return NextResponse.json({ error: "Configuration and test email are required" }, { status: 400 })
    }

    // Validate test email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json({ error: "Invalid test email format" }, { status: 400 })
    }

    // Test the configuration
    const result = await testSMTPConfig(config, testEmail)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing SMTP config:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

