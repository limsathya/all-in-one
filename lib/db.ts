import type { Pool } from "pg"
import { sql } from "@vercel/postgres"

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "workspace_db",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
}

// Create a pool for database connections
const pool: Pool | null = null

// Initialize the database pool
export const initializePool = () => {
  console.log("Using @vercel/postgres - no pool initialization needed")
  return null
}

// Get a client from the pool
export const getClient = async () => {
  console.log("Using @vercel/postgres - client is managed internally")
  return null
}

// Execute a query with parameters
export const query = async (text: string, params: any[] = []) => {
  try {
    // Convert the query and params to use the sql template literal from @vercel/postgres
    // This is a simple implementation - complex queries might need more handling
    const result = await sql.query(text, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Initialize the database schema and seed data
export const initializeDatabase = async () => {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create emails table
    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sender VARCHAR(255) NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT,
        read BOOLEAN DEFAULT FALSE,
        starred BOOLEAN DEFAULT FALSE,
        folder VARCHAR(50) DEFAULT 'inbox',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        content TEXT,
        type VARCHAR(50) NOT NULL,
        folder VARCHAR(50) DEFAULT 'personal',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create files table
    await sql`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        size INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        due_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create system_config table
    await sql`
      CREATE TABLE IF NOT EXISTS system_config (
        id SERIAL PRIMARY KEY,
        config_type VARCHAR(50) NOT NULL,
        config_value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Add index for faster lookups
    await sql`CREATE INDEX IF NOT EXISTS idx_system_config_type ON system_config (config_type)`

    // Create allowed_domains table
    await sql`
      CREATE TABLE IF NOT EXISTS allowed_domains (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we need to seed initial configuration
    const configResult = await sql`SELECT COUNT(*) FROM system_config`
    if (Number.parseInt(configResult.rows[0].count) === 0) {
      // Initial SMTP configuration
      await sql`
        INSERT INTO system_config (config_type, config_value)
        VALUES (
          'smtp', 
          ${'{"host":"smtp.gmail.com","port":587,"user":"","password":"","from":"noreply@limsathya.com","secure":false,"provider":"gmail"}'}
        )
      `
    }

    // Check if we need to seed domains
    const domainsResult = await sql`SELECT COUNT(*) FROM allowed_domains`
    if (Number.parseInt(domainsResult.rows[0].count) === 0) {
      // Initial domain configuration
      await sql`
        INSERT INTO allowed_domains (domain, is_active, is_primary)
        VALUES ('limsathya.com', TRUE, TRUE)
      `
    }

    // Check if we need to seed user data
    const usersResult = await sql`SELECT COUNT(*) FROM users`
    if (Number.parseInt(usersResult.rows[0].count) === 0) {
      // Seed users (password is 'password123' - in a real app, you would hash this)
      await sql`
        INSERT INTO users (email, password_hash, full_name) VALUES
        ('admin@limsathya.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Admin User'),
        ('user@limsathya.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Regular User'),
        ('test@dev.limsathya.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Test User')
      `

      // Seed emails
      await sql`
        INSERT INTO emails (user_id, sender, recipient, subject, body, folder) VALUES
        (1, 'system@limsathya.com', 'admin@limsathya.com', 'Welcome to Workspace', 'Thank you for joining Workspace!', 'inbox'),
        (1, 'notifications@limsathya.com', 'admin@limsathya.com', 'Your account has been created', 'Your Workspace account is ready to use.', 'inbox'),
        (2, 'system@limsathya.com', 'user@limsathya.com', 'Welcome to Workspace', 'Thank you for joining Workspace!', 'inbox'),
        (2, 'admin@limsathya.com', 'user@limsathya.com', 'Getting Started Guide', 'Here are some tips to get started with Workspace...', 'inbox')
      `

      // Seed documents
      await sql`
        INSERT INTO documents (user_id, name, content, type, folder) VALUES
        (1, 'Project Plan', 'This is a project plan document...', 'document', 'work'),
        (1, 'Budget 2025', '2025 Budget Spreadsheet', 'spreadsheet', 'finance'),
        (2, 'Meeting Notes', 'Notes from the team meeting...', 'document', 'personal')
      `

      // Seed files
      await sql`
        INSERT INTO files (user_id, name, path, size, type) VALUES
        (1, 'profile.jpg', '/storage/users/1/profile.jpg', 1024, 'image'),
        (1, 'presentation.pptx', '/storage/users/1/presentation.pptx', 2048, 'presentation'),
        (2, 'document.pdf', '/storage/users/2/document.pdf', 512, 'document')
      `

      // Seed invoices
      await sql`
        INSERT INTO invoices (user_id, amount, status, due_date) VALUES
        (1, 29.99, 'paid', CURRENT_TIMESTAMP + INTERVAL '30 days'),
        (1, 29.99, 'paid', CURRENT_TIMESTAMP - INTERVAL '30 days'),
        (2, 29.99, 'pending', CURRENT_TIMESTAMP + INTERVAL '15 days')
      `
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Close the pool (useful for tests and graceful shutdown)
export const closePool = async () => {
  console.log("Using @vercel/postgres - no pool to close")
}

