import nodemailer from "nodemailer"
import { getSMTPConfig, type SMTPConfig } from "./config"

// Create a reusable transporter
let transporter: nodemailer.Transporter | null = null
let lastConfigTime = 0

// Create/get a transporter with the current SMTP configuration
async function getTransporter(): Promise<nodemailer.Transporter> {
  const now = Date.now()

  // If it's been more than 5 minutes since we last checked the config, refresh it
  if (!transporter || now - lastConfigTime > 5 * 60 * 1000) {
    const config = await getSMTPConfig()

    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    })

    lastConfigTime = now
  }

  return transporter
}

// Interface for email data
export interface EmailData {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

// Send an email
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const config = await getSMTPConfig()
    const transport = await getTransporter()

    await transport.sendMail({
      from: data.from || config.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments,
    })

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Test SMTP configuration
export async function testSMTPConfig(
  config: SMTPConfig,
  testEmail: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const testTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    })

    // Verify connection configuration
    await testTransporter.verify()

    // Send a test email
    const info = await testTransporter.sendMail({
      from: config.from,
      to: testEmail,
      subject: "SMTP Configuration Test",
      text: "This is a test email to verify your SMTP configuration.",
      html: "<p>This is a test email to verify your SMTP configuration.</p>",
    })

    return {
      success: true,
      message: `Test email sent successfully. Message ID: ${info.messageId}`,
    }
  } catch (error) {
    console.error("SMTP configuration test failed:", error)
    return {
      success: false,
      message: `SMTP test failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

