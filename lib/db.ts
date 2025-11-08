import { sql } from "@vercel/postgres"

export interface Order {
  id: number
  order_number: number
  email: string
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
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number INTEGER NOT NULL UNIQUE,
        email TEXT NOT NULL,
        format TEXT NOT NULL,
        price TEXT NOT NULL,
        product_name TEXT NOT NULL,
        square_checkout_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `

    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert default admin if not exists
    const adminCheck = await sql`
      SELECT id FROM admin_users WHERE email = 'admin.4sight@gmail.com'
    `

    if (adminCheck.rows.length === 0) {
      // Simple password hash (in production, use bcrypt)
      const passwordHash = "4sightadmin123" // In production, hash this properly
      await sql`
        INSERT INTO admin_users (email, password_hash)
        VALUES ('admin.4sight@gmail.com', ${passwordHash})
      `
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
  email: string
  format: string
  price: string
  productName: string
  squareCheckoutId?: string
}) {
  try {
    const result = await sql`
      INSERT INTO orders (order_number, email, format, price, product_name, square_checkout_id, status)
      VALUES (${order.orderNumber}, ${order.email}, ${order.format}, ${order.price}, ${order.productName}, ${order.squareCheckoutId || null}, 'pending')
      RETURNING id
    `
    return { lastInsertRowid: result.rows[0]?.id }
  } catch (error) {
    console.error("Error saving order:", error)
    throw error
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const result = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `
    return result.rows as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT password_hash FROM admin_users WHERE email = ${email}
    `

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
