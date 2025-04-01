"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { clientAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [allowedDomains, setAllowedDomains] = useState<string[]>([])

  useEffect(() => {
    // Fetch allowed domains from API
    fetch("/api/config/domains")
      .then((res) => res.json())
      .then((data) => {
        setAllowedDomains(data.domains)
      })
      .catch((err) => {
        console.error("Error fetching allowed domains:", err)
        setAllowedDomains(["limsathya.com"]) // Fallback
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await clientAuth.login(email, password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getDomainsText = () => {
    if (allowedDomains.length === 0) return ""
    if (allowedDomains.length === 1) return `Only ${allowedDomains[0]} and its subdomains are allowed`

    const lastDomain = allowedDomains[allowedDomains.length - 1]
    const otherDomains = allowedDomains.slice(0, -1).join(", ")
    return `Only ${otherDomains} and ${lastDomain} domains are allowed`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6">Sign in to your Workspace account</p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={allowedDomains.length > 0 ? `name@${allowedDomains[0]}` : "name@example.com"}
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getDomainsText()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          © 2025 Workspace. All rights reserved.
        </p>
      </div>
    </div>
  )
}

