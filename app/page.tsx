import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page if not authenticated
  // This will be replaced with actual auth check when database is connected
  const isAuthenticated = false

  if (!isAuthenticated) {
    redirect("/login")
  }

  // If authenticated, redirect to dashboard
  redirect("/dashboard")
}

