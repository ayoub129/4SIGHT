import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Initialize order number counter in database
async function initializeOrderNumber() {
  try {
    console.log("[ORDER-NUMBER] Initializing order counter...")
    
    // Create order_counter table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_counter (
        id INTEGER PRIMARY KEY,
        current_number INTEGER NOT NULL DEFAULT 26
      )
    `)
    console.log("[ORDER-NUMBER] Order counter table created/verified")

    // Insert initial value if not exists
    const check = await pool.query("SELECT current_number FROM order_counter WHERE id = 1")
    console.log("[ORDER-NUMBER] Current counter check:", { 
      exists: check.rows.length > 0, 
      currentValue: check.rows[0]?.current_number 
    })

    if (check.rows.length === 0) {
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 26)")
      console.log("[ORDER-NUMBER] Initialized counter with value 26")
    } else {
      console.log("[ORDER-NUMBER] Counter already exists with value:", check.rows[0].current_number)
    }
  } catch (error) {
    console.error("[ORDER-NUMBER] Error initializing order counter:", error)
    throw error
  }
}

// Initialize on first import
let initialized = false
if (!initialized) {
  initialized = true
  initializeOrderNumber().catch(console.error)
}

export async function getNextOrderNumber(): Promise<number> {
  const startTime = Date.now()
  console.log("[ORDER-NUMBER] getNextOrderNumber() called at", new Date().toISOString())
  
  try {
    // Initialize if needed
    await initializeOrderNumber()

    // Check current value before update
    const beforeCheck = await pool.query("SELECT current_number FROM order_counter WHERE id = 1")
    const beforeValue = beforeCheck.rows[0]?.current_number
    console.log("[ORDER-NUMBER] Current counter value BEFORE increment:", beforeValue)

    // Get current number and increment
    const result = await pool.query(
      `UPDATE order_counter
       SET current_number = current_number + 1
       WHERE id = 1
       RETURNING current_number`
    )

    console.log("[ORDER-NUMBER] UPDATE query result:", {
      rowsAffected: result.rowCount,
      rowsReturned: result.rows.length,
      returnedValue: result.rows[0]?.current_number
    })

    if (result.rows.length === 0) {
      // If no row exists, create it and return 27
      console.log("[ORDER-NUMBER] WARNING: No row found after UPDATE, creating new row with 27")
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 27)")
      console.log("[ORDER-NUMBER] Created new counter row with value 27")
      return 27
    }

    const newOrderNumber = result.rows[0].current_number as number
    const duration = Date.now() - startTime
    console.log("[ORDER-NUMBER] Successfully generated order number:", {
      orderNumber: newOrderNumber,
      previousValue: beforeValue,
      duration: `${duration}ms`
    })
    
    return newOrderNumber
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("[ORDER-NUMBER] Error getting next order number:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`
    })
    
    // Fallback: return a timestamp-based number
    const fallbackNumber = Math.floor(Date.now() / 1000) % 1000000 + 27
    console.log("[ORDER-NUMBER] Using fallback order number:", fallbackNumber)
    return fallbackNumber
  }
}

// Helper function to check current counter state (for debugging)
export async function getCurrentOrderNumber(): Promise<number | null> {
  try {
    console.log("[ORDER-NUMBER] getCurrentOrderNumber() called - checking current state")
    const result = await pool.query("SELECT current_number FROM order_counter WHERE id = 1")
    if (result.rows.length > 0) {
      const currentValue = result.rows[0].current_number as number
      console.log("[ORDER-NUMBER] Current order number in database:", currentValue)
      return currentValue
    }
    console.log("[ORDER-NUMBER] No order counter found in database")
    return null
  } catch (error) {
    console.error("[ORDER-NUMBER] Error getting current order number:", error)
    return null
  }
}
