"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Mail, Server, Trash2, Globe, Plus, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { clientAuth } from "@/lib/auth"

type SMTPConfig = {
  host: string
  port: number
  user: string
  password: string
  from: string
  secure: boolean
  provider: string
}

type DomainConfig = {
  domain: string
  isActive: boolean
  isPrimary: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // SMTP State
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: "",
    port: 587,
    user: "",
    password: "",
    from: "",
    secure: false,
    provider: "gmail",
  })
  const [testEmail, setTestEmail] = useState("")
  const [testingSmtp, setTestingSmtp] = useState(false)

  // Domains State
  const [domains, setDomains] = useState<DomainConfig[]>([])
  const [newDomain, setNewDomain] = useState("")
  const [newDomainPrimary, setNewDomainPrimary] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and is admin
    checkAuthStatus()

    // Load settings
    fetchSmtpConfig()
    fetchDomains()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await clientAuth.isAuthenticated()
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Fetch current user to check if admin
      const response = await fetch("/api/auth/me")
      const data = await response.json()

      if (!data.authenticated || data.user.email !== "admin@limsathya.com") {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      router.push("/login")
    }
  }

  const fetchSmtpConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/smtp")
      const data = await response.json()

      if (data.config) {
        setSmtpConfig(data.config)
      }
    } catch (error) {
      console.error("Error fetching SMTP config:", error)
      setError("Failed to load SMTP configuration")
    } finally {
      setLoading(false)
    }
  }

  const fetchDomains = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/domains")
      const data = await response.json()

      if (data.domains) {
        setDomains(data.domains)
      }
    } catch (error) {
      console.error("Error fetching domains:", error)
      setError("Failed to load domain configuration")
    } finally {
      setLoading(false)
    }
  }

  const saveSmtpConfig = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config: smtpConfig }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("SMTP configuration saved successfully")
      } else {
        setError(data.error || "Failed to save SMTP configuration")
      }
    } catch (error) {
      console.error("Error saving SMTP config:", error)
      setError("Failed to save SMTP configuration")
    } finally {
      setLoading(false)
    }
  }

  const testSmtpConfig = async () => {
    try {
      setTestingSmtp(true)
      setError("")
      setSuccess("")

      if (!testEmail) {
        setError("Please enter a test email address")
        return
      }

      const response = await fetch("/api/admin/smtp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config: smtpConfig, testEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Test email sent successfully to ${testEmail}`)
      } else {
        setError(data.message || "Failed to send test email")
      }
    } catch (error) {
      console.error("Error testing SMTP config:", error)
      setError("Failed to test SMTP configuration")
    } finally {
      setTestingSmtp(false)
    }
  }

  const addDomain = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      if (!newDomain) {
        setError("Please enter a domain")
        return
      }

      const response = await fetch("/api/admin/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: newDomain, isPrimary: newDomainPrimary }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Domain added successfully")
        setNewDomain("")
        setNewDomainPrimary(false)
        fetchDomains()
      } else {
        setError(data.error || "Failed to add domain")
      }
    } catch (error) {
      console.error("Error adding domain:", error)
      setError("Failed to add domain")
    } finally {
      setLoading(false)
    }
  }

  const removeDomain = async (domain: string) => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/admin/domains?domain=${encodeURIComponent(domain)}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Domain removed successfully")
        fetchDomains()
      } else {
        setError(data.error || "Failed to remove domain")
      }
    } catch (error) {
      console.error("Error removing domain:", error)
      setError("Failed to remove domain")
    } finally {
      setLoading(false)
    }
  }

  // Gmail SMTP presets
  const applyGmailPreset = () => {
    setSmtpConfig({
      ...smtpConfig,
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      provider: "gmail",
    })
  }

  // Outlook SMTP presets
  const applyOutlookPreset = () => {
    setSmtpConfig({
      ...smtpConfig,
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      provider: "outlook",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 dark:border-green-700 text-green-700 dark:text-green-300">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="smtp">
          <TabsList className="mb-6">
            <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
            <TabsTrigger value="domains">Domain Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email delivery settings for the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider Presets</Label>
                    <Select
                      value={smtpConfig.provider}
                      onValueChange={(value) => {
                        setSmtpConfig({ ...smtpConfig, provider: value })
                        if (value === "gmail") applyGmailPreset()
                        if (value === "outlook") applyOutlookPreset()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">SMTP Host</Label>
                    <div className="relative">
                      <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="host"
                        className="pl-10"
                        value={smtpConfig.host}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                        placeholder="smtp.example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={smtpConfig.port}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number.parseInt(e.target.value) || 587 })}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="secure"
                        checked={smtpConfig.secure}
                        onCheckedChange={(checked) => setSmtpConfig({ ...smtpConfig, secure: checked })}
                      />
                      <Label htmlFor="secure">Use Secure Connection (SSL/TLS)</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">Username</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="user"
                        className="pl-10"
                        value={smtpConfig.user}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                        placeholder="your-email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={smtpConfig.password}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                      placeholder={smtpConfig.password ? "********" : "Enter password"}
                    />
                    <p className="text-xs text-slate-500">
                      For Gmail, use an App Password instead of your regular password
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from">From Email Address</Label>
                  <Input
                    id="from"
                    value={smtpConfig.from}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, from: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                  />
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Test Configuration</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter test email address"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={testSmtpConfig} disabled={testingSmtp}>
                      <Send className="h-4 w-4 mr-2" />
                      {testingSmtp ? "Sending..." : "Send Test Email"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSmtpConfig} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save SMTP Configuration"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Domain Configuration</CardTitle>
                <CardDescription>Manage allowed email domains for user registration and login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Add New Domain</Label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            className="pl-10"
                            placeholder="example.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <Switch id="primary-domain" checked={newDomainPrimary} onCheckedChange={setNewDomainPrimary} />
                        <Label htmlFor="primary-domain">Set as primary domain</Label>
                      </div>
                      <Button onClick={addDomain} disabled={loading || !newDomain}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Domain
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Allowed Domains</h3>

                  {domains.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400">No domains configured yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {domains.map((domain, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            <div>
                              <p className="font-medium">{domain.domain}</p>
                              {domain.isPrimary && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                                  Primary Domain
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDomain(domain.domain)}
                            disabled={loading || domain.isPrimary} // Prevent removing primary domain
                            className={domain.isPrimary ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

