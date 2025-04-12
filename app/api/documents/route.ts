import { type NextRequest, NextResponse } from "next/server"
import { sql, initializeDatabase } from "@/lib/db"

// Initialize database on first request
let isInitialized = false

// POST handler to create a new document
export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isInitialized) {
      await initializeDatabase()
      isInitialized = true
    }

    // Parse request body
    const body = await request.json()
    const { client_id, name, description, type, file_url, size, uploaded_by } = body

    // Validate required fields
    if (!client_id || !name || !file_url) {
      return NextResponse.json({ error: "Client ID, document name, and file URL are required" }, { status: 400 })
    }

    // Insert new document
    const result = await sql`
      INSERT INTO documents (client_id, name, description, type, file_url, size, uploaded_by)
      VALUES (${client_id}, ${name}, ${description}, ${type}, ${file_url}, ${size}, ${uploaded_by})
      RETURNING *
    `

    return NextResponse.json({ message: "Document created successfully", document: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}

// GET handler to fetch all documents
export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isInitialized) {
      await initializeDatabase()
      isInitialized = true
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("client_id")

    let documents
    if (clientId) {
      // Fetch documents for a specific client
      documents = await sql`
        SELECT d.*, c.name as client_name
        FROM documents d
        JOIN clients c ON d.client_id = c.id
        WHERE d.client_id = ${clientId}
        ORDER BY d.created_at DESC
      `
    } else {
      // Fetch all documents
      documents = await sql`
        SELECT d.*, c.name as client_name
        FROM documents d
        LEFT JOIN clients c ON d.client_id = c.id
        ORDER BY d.created_at DESC
      `
    }

    return NextResponse.json({ documents }, { status: 200 })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
