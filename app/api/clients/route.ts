import { NextResponse } from "next/server"
import { sql, initializeDatabase } from "@/lib/db"

// Initialize database on first request
let isInitialized = false

// GET handler to fetch all clients
export async function GET() {
  try {
    // Initialize database if not already done
    if (!isInitialized) {
      await initializeDatabase()
      isInitialized = true
    }

    // Fetch all clients ordered by most recent first
    const clients = await sql`
      SELECT * FROM clients ORDER BY created_at DESC
    `

    return NextResponse.json({ clients }, { status: 200 })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

// POST handler to create a new client
export async function POST(request: Request) {
  try {
    // Initialize database if not already done
    if (!isInitialized) {
      await initializeDatabase()
      isInitialized = true
    }

    // Parse request body
    const body = await request.json()
    const { name, email, company, phone, service, notes } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Insert new client
    const result = await sql`
      INSERT INTO clients (name, email, company, phone, service, notes)
      VALUES (${name}, ${email}, ${company}, ${phone}, ${service}, ${notes})
      RETURNING *
    `

    const newClient = result[0]

    return NextResponse.json({ message: "Client created successfully", client: newClient }, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
