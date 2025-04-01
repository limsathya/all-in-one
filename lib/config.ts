import { sql } from "@vercel/postgres"

// Types for system configuration
export interface SMTPConfig {
  host: string
  port: number
  user: string
  password: string
  from: string
  secure: boolean
  provider: string // e.g., 'gmail', 'outlook', 'custom'
}

export interface DomainConfig {
  domain: string
  isActive: boolean
  isPrimary: boolean
}

// Cache configurations to reduce database queries
let cachedSMTPConfig: SMTPConfig | null = null
let cachedDomains: DomainConfig[] | null = null
const lastCacheTime = {
  smtp: 0,
  domains: 0,
}

// Cache expiration in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Get SMTP configuration from database
export async function getSMTPConfig(): Promise<SMTPConfig> {
  // Return from cache if available and not expired
  const now = Date.now()
  if (cachedSMTPConfig && now - lastCacheTime.smtp < CACHE_EXPIRATION) {
    return cachedSMTPConfig
  }

  try {
    const result = await sql`
      SELECT * FROM system_config WHERE config_type = 'smtp' ORDER BY updated_at DESC LIMIT 1
    `

    if (result.rows.length === 0) {
      // Return default configuration if none found in database
      const defaultConfig: SMTPConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || "587"),
        user: process.env.SMTP_USER || "",
        password: process.env.SMTP_PASSWORD || "",
        from: process.env.SMTP_FROM || "noreply@limsathya.com",
        secure: process.env.SMTP_SECURE === "true",
        provider: "gmail",
      }

      // Update cache
      cachedSMTPConfig = defaultConfig
      lastCacheTime.smtp = now

      return defaultConfig
    }

    // Parse configuration from database
    const config = JSON.parse(result.rows[0].config_value)

    // Update cache
    cachedSMTPConfig = config
    lastCacheTime.smtp = now

    return config
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error)
    // Fallback to environment variables if database query fails
    return {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER || "",
      password: process.env.SMTP_PASSWORD || "",
      from: process.env.SMTP_FROM || "noreply@limsathya.com",
      secure: process.env.SMTP_SECURE === "true",
      provider: "gmail",
    }
  }
}

// Update SMTP configuration in database
export async function updateSMTPConfig(config: SMTPConfig): Promise<boolean> {
  try {
    await sql`
      INSERT INTO system_config (config_type, config_value, updated_at)
      VALUES ('smtp', ${JSON.stringify(config)}, CURRENT_TIMESTAMP)
    `

    // Clear cache
    cachedSMTPConfig = null

    return true
  } catch (error) {
    console.error("Error updating SMTP configuration:", error)
    return false
  }
}

// Get allowed domains from database
export async function getAllowedDomains(): Promise<DomainConfig[]> {
  // Return from cache if available and not expired
  const now = Date.now()
  if (cachedDomains && now - lastCacheTime.domains < CACHE_EXPIRATION) {
    return cachedDomains
  }

  try {
    const result = await sql`
      SELECT * FROM allowed_domains WHERE is_active = true ORDER BY is_primary DESC
    `

    if (result.rows.length === 0) {
      // Return default domains if none found in database
      const defaultDomain: DomainConfig = {
        domain: "limsathya.com",
        isActive: true,
        isPrimary: true,
      }

      // Insert default domain into database
      await sql`
        INSERT INTO allowed_domains (domain, is_active, is_primary)
        VALUES (${defaultDomain.domain}, ${defaultDomain.isActive}, ${defaultDomain.isPrimary})
        ON CONFLICT (domain) DO NOTHING
      `

      // Update cache
      cachedDomains = [defaultDomain]
      lastCacheTime.domains = now

      return [defaultDomain]
    }

    // Map database results to domain config objects
    const domains = result.rows.map((row) => ({
      domain: row.domain,
      isActive: row.is_active,
      isPrimary: row.is_primary,
    }))

    // Update cache
    cachedDomains = domains
    lastCacheTime.domains = now

    return domains
  } catch (error) {
    console.error("Error fetching allowed domains:", error)
    // Fallback to environment variables if database query fails
    const domainsFromEnv = (process.env.ALLOWED_EMAIL_DOMAINS || "limsathya.com")
      .split(",")
      .map((domain) => domain.trim())

    return domainsFromEnv.map((domain, index) => ({
      domain,
      isActive: true,
      isPrimary: index === 0,
    }))
  }
}

// Add a new allowed domain
export async function addAllowedDomain(domain: string, isPrimary = false): Promise<boolean> {
  try {
    // If this is a primary domain, update existing primary domains
    if (isPrimary) {
      await sql`
        UPDATE allowed_domains SET is_primary = false WHERE is_primary = true
      `
    }

    // Insert new domain
    await sql`
      INSERT INTO allowed_domains (domain, is_active, is_primary)
      VALUES (${domain}, true, ${isPrimary})
      ON CONFLICT (domain) 
      DO UPDATE SET is_active = true, is_primary = ${isPrimary}
    `

    // Clear cache
    cachedDomains = null

    return true
  } catch (error) {
    console.error("Error adding allowed domain:", error)
    return false
  }
}

// Remove an allowed domain
export async function removeAllowedDomain(domain: string): Promise<boolean> {
  try {
    // Don't physically delete, just mark as inactive
    await sql`
      UPDATE allowed_domains SET is_active = false WHERE domain = ${domain}
    `

    // Clear cache
    cachedDomains = null

    return true
  } catch (error) {
    console.error("Error removing allowed domain:", error)
    return false
  }
}

// Get primary domain
export async function getPrimaryDomain(): Promise<string> {
  try {
    const domains = await getAllowedDomains()
    const primaryDomain = domains.find((d) => d.isPrimary)
    return primaryDomain?.domain || "limsathya.com"
  } catch (error) {
    console.error("Error getting primary domain:", error)
    return "limsathya.com"
  }
}

// Clear configuration cache
export function clearConfigCache() {
  cachedSMTPConfig = null
  cachedDomains = null
  lastCacheTime.smtp = 0
  lastCacheTime.domains = 0
}

