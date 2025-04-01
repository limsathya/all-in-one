import { type NextRequest, NextResponse } from "next/server"
import { login, isValidEmailDomain } from "@/lib/auth"
import { getAllowedDomains } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Check if email domain is valid
    if (!(await isValidEmailDomain(email))) {
      const domains = await getAllowedDomains()
      const domainsText = domains.map((d) => d.domain).join(", ")
      return NextResponse.json(
        { success: false, message: `Only ${domainsText} email addresses are allowed` },
        { status: 401 },
      )
    }

    // Attempt login
    const result = await login(email, password)

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: { id: result.userId, email },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

