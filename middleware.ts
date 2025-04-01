import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip for API routes and static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/init-db") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // For the first request to the app, initialize the database
  // This is a simple way to ensure the database is initialized
  // In production, you would want a more robust solution
  try {
    // Only do this in production, as in development we'll use the init-db script
    if (process.env.NODE_ENV === "production") {
      const response = await fetch(`${request.nextUrl.origin}/api/init-db`)
      if (!response.ok) {
        console.error("Failed to initialize database")
      }
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }

  // Continue with the request
  return NextResponse.next()
}

// Only run the middleware on the homepage to avoid multiple initializations
export const config = {
  matcher: "/",
}

