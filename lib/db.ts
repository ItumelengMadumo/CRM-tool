import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to initialize the database
export async function initializeDatabase() {
  try {
    // Create clients table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        company TEXT,
        phone TEXT,
        location TEXT,
        services TEXT[],
        budget NUMERIC,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create documents table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT,
        file_url TEXT,
        size TEXT,
        uploaded_by TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create invoices table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        invoice_number TEXT,
        file_url TEXT,
        issued_date DATE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create receipts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        description TEXT,
        receipt_number TEXT,
        file_url TEXT,
        receipt_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create quotes table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        description TEXT,
        quote_number TEXT,
        file_url TEXT,
        valid_until DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create purchase_orders table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        description TEXT,
        po_number TEXT,
        file_url TEXT,
        issue_date DATE,
        delivery_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create contracts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS contracts (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create expenses table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        amount NUMERIC NOT NULL,
        description TEXT,
        category TEXT,
        file_url TEXT,
        expense_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}
