import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET handler to fetch a specific client and their documents
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    // Fetch client details
    const clientResult = await sql`
      SELECT * FROM clients WHERE id = ${clientId}
    `

    if (clientResult.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const client = clientResult[0]

    // Fetch client documents
    const documentsResult = await sql`
      SELECT * FROM documents 
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ client, documents: documentsResult }, { status: 200 })
  } catch (error) {
    console.error("Error fetching client details:", error)
    return NextResponse.json({ error: "Failed to fetch client details" }, { status: 500 })
  }
}

// PUT handler to update a client
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id
    const body = await request.json()
    const { name, email, company, phone, location, services, budget, notes } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Update client
    const result = await sql`
      UPDATE clients
      SET 
        name = ${name},
        email = ${email},
        company = ${company},
        phone = ${phone},
        location = ${location},
        services = ${services},
        budget = ${budget},
        notes = ${notes}
      WHERE id = ${clientId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Client updated successfully", client: result[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

// DELETE handler to delete a client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id

    // Delete client (cascade will delete related documents)
    const result = await sql`
      DELETE FROM clients
      WHERE id = ${clientId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
