import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Initialize order number counter in database
async function initializeOrderNumber() {
  try {
    // Create order_counter table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_counter (
        id INTEGER PRIMARY KEY,
        current_number INTEGER NOT NULL DEFAULT 26
      )
    `)

    // Insert initial value if not exists
    const check = await pool.query("SELECT current_number FROM order_counter WHERE id = 1")

    if (check.rows.length === 0) {
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 26)")
    }
  } catch (error) {
    console.error("Error initializing order counter:", error)
  }
}

// Initialize on first import
let initialized = false
if (!initialized) {
  initialized = true
  initializeOrderNumber().catch(console.error)
}

export async function getNextOrderNumber(): Promise<number> {
  try {
    // Initialize if needed
    await initializeOrderNumber()

    // Get current number and increment
    const result = await pool.query(
      `UPDATE order_counter
       SET current_number = current_number + 1
       WHERE id = 1
       RETURNING current_number`
    )

    if (result.rows.length === 0) {
      // If no row exists, create it and return 27
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 27)")
      return 27
    }

    return result.rows[0].current_number as number
  } catch (error) {
    console.error("Error getting next order number:", error)
    // Fallback: return a timestamp-based number
    return Math.floor(Date.now() / 1000) % 1000000 + 27
  }
}
