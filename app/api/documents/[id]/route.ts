import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET handler to fetch a specific document
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    // Fetch document details
    const result = await sql`
      SELECT d.*, c.name as client_name
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE d.id = ${documentId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ document: result[0] }, { status: 200 })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}

// PUT handler to update a document
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id
    const body = await request.json()
    const { name, description, type } = body

    // Update document
    const result = await sql`
      UPDATE documents
      SET 
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        type = COALESCE(${type}, type)
      WHERE id = ${documentId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Document updated successfully", document: result[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

// DELETE handler to delete a document
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentId = params.id

    // Delete document
    const result = await sql`
      DELETE FROM documents
      WHERE id = ${documentId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
