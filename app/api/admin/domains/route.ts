import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllowedDomains, addAllowedDomain, removeAllowedDomain } from "@/lib/config"

// Helper to check if user is admin
async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  // For simplicity, we're considering anyone with admin@limsathya.com as admin
  // In a real app, you'd have proper roles in the database
  return user.email === "admin@limsathya.com"
}

// Get all allowed domains
export async function GET() {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const domains = await getAllowedDomains()

    return NextResponse.json({ domains })
  } catch (error) {
    console.error("Error fetching domains:", error)
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 })
  }
}

// Add a new allowed domain
export async function POST(request: Request) {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { domain, isPrimary } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    // Domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    const success = await addAllowedDomain(domain, isPrimary)

    if (success) {
      return NextResponse.json({ success: true, message: "Domain added successfully" })
    } else {
      return NextResponse.json({ error: "Failed to add domain" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding domain:", error)
    return NextResponse.json({ error: "Failed to add domain" }, { status: 500 })
  }
}

// Delete a domain
export async function DELETE(request: Request) {
  try {
    // Only allow admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const domain = searchParams.get("domain")

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const success = await removeAllowedDomain(domain)

    if (success) {
      return NextResponse.json({ success: true, message: "Domain removed successfully" })
    } else {
      return NextResponse.json({ error: "Failed to remove domain" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error removing domain:", error)
    return NextResponse.json({ error: "Failed to remove domain" }, { status: 500 })
  }
}

