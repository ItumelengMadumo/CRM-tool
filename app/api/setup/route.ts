import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

// GET handler to initialize the database
export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database initialized successfully" }, { status: 200 })
    } else {
      return NextResponse.json({ error: "Failed to initialize database", details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in setup route:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
