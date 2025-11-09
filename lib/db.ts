import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export interface Order {
  id: number
  order_number: number
  email: string | null
  format: string
  price: string
  product_name: string
  square_checkout_id: string | null
  created_at: string
  status: string
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number INTEGER NOT NULL UNIQUE,
        email TEXT,
        format TEXT NOT NULL,
        price TEXT NOT NULL,
        product_name TEXT NOT NULL,
        square_checkout_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `)
    
    // Alter existing table to make email nullable if it exists
    try {
      await pool.query(`
        ALTER TABLE orders ALTER COLUMN email DROP NOT NULL
      `)
    } catch (error) {
      // Column might already be nullable or table doesn't exist yet - ignore
    }

    // Create admin_users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create order_counter table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_counter (
        id INTEGER PRIMARY KEY,
        current_number INTEGER NOT NULL DEFAULT 26
      )
    `)

    // Create newsletter_subscribers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subscribed BOOLEAN DEFAULT TRUE
      )
    `)

    // Insert default admin if not exists
    const adminCheck = await pool.query(
      "SELECT id FROM admin_users WHERE email = $1",
      ["admin.4sight@gmail.com"]
    )

    if (adminCheck.rows.length === 0) {
      // Simple password hash (in production, use bcrypt)
      const passwordHash = "4sightadmin123" // In production, hash this properly
      await pool.query(
        "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
        ["admin.4sight@gmail.com", passwordHash]
      )
    }

    // Initialize order counter if not exists
    const counterCheck = await pool.query("SELECT current_number FROM order_counter WHERE id = 1")
    if (counterCheck.rows.length === 0) {
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 26)")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    // Don't throw - tables might already exist
  }
}

// Initialize on first import
let initialized = false
if (!initialized) {
  initialized = true
  initializeDatabase().catch(console.error)
}

export async function saveOrder(order: {
  orderNumber: number
  email?: string | null
  format: string
  price: string
  productName: string
  squareCheckoutId?: string
}) {
  try {
    const result = await pool.query(
      `INSERT INTO orders (order_number, email, format, price, product_name, square_checkout_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id`,
      [
        order.orderNumber,
        order.email || null,
        order.format,
        order.price,
        order.productName,
        order.squareCheckoutId || null,
      ]
    )
    return { lastInsertRowid: result.rows[0]?.id }
  } catch (error) {
    console.error("Error saving order:", error)
    throw error
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC")
    return result.rows as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  try {
    const result = await pool.query("SELECT password_hash FROM admin_users WHERE email = $1", [
      email,
    ])

    if (result.rows.length === 0) {
      return false
    }

    const admin = result.rows[0] as { password_hash: string }

    // Simple password check (in production, use bcrypt)
    return admin.password_hash === password
  } catch (error) {
    console.error("Error verifying admin:", error)
    return false
  }
}

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM newsletter_subscribers WHERE email = $1",
      [email]
    )

    if (existing.rows.length > 0) {
      // Update subscription status if unsubscribed
      await pool.query(
        "UPDATE newsletter_subscribers SET subscribed = TRUE WHERE email = $1",
        [email]
      )
      return { success: true, message: "Email already subscribed" }
    }

    // Insert new subscriber
    await pool.query(
      "INSERT INTO newsletter_subscribers (email, subscribed) VALUES ($1, TRUE)",
      [email]
    )
    return { success: true, message: "Successfully subscribed" }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    throw error
  }
}

export async function getAllNewsletterSubscribers(): Promise<{ id: number; email: string; created_at: string; subscribed: boolean }[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM newsletter_subscribers WHERE subscribed = TRUE ORDER BY created_at DESC"
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error)
    throw error
  }
}

export async function updateOrderWithCustomerEmail(squareCheckoutId: string, email: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE orders 
       SET email = $1, status = 'completed' 
       WHERE square_checkout_id = $2`,
      [email, squareCheckoutId]
    )
  } catch (error) {
    console.error("Error updating order with customer email:", error)
    throw error
  }
}
