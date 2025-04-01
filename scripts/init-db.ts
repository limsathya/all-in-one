import { initializeDatabase } from "../lib/db"

async function main() {
  try {
    console.log("Initializing database...")
    await initializeDatabase()
    console.log("Database initialization complete!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

main()

