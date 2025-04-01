import { NextResponse } from "next/server"
import { getAllowedDomains } from "@/lib/config"

export async function GET() {
  try {
    const domainsConfig = await getAllowedDomains()
    const domains = domainsConfig.map((config) => config.domain)

    return NextResponse.json({
      domains,
    })
  } catch (error) {
    console.error("Error fetching domains:", error)
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 })
  }
}

