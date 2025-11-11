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

    // Create visitor_ips table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitor_ips (
        id SERIAL PRIMARY KEY,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        path TEXT,
        referer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create index on ip_address for faster queries
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_visitor_ips_ip_address ON visitor_ips(ip_address)
      `)
    } catch (error) {
      // Index might already exist - ignore
    }

    // Create index on created_at for faster date queries
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_visitor_ips_created_at ON visitor_ips(created_at)
      `)
    } catch (error) {
      // Index might already exist - ignore
    }

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
    console.log("[DB-INIT] Order counter check:", {
      exists: counterCheck.rows.length > 0,
      currentValue: counterCheck.rows[0]?.current_number
    })
    if (counterCheck.rows.length === 0) {
      await pool.query("INSERT INTO order_counter (id, current_number) VALUES (1, 26)")
      console.log("[DB-INIT] Initialized order counter with value 26")
    } else {
      console.log("[DB-INIT] Order counter already initialized with value:", counterCheck.rows[0].current_number)
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
  const startTime = Date.now()
  console.log("[SAVE-ORDER] saveOrder() called at", new Date().toISOString(), {
    orderNumber: order.orderNumber,
    email: order.email,
    format: order.format,
    price: order.price,
    productName: order.productName,
    squareCheckoutId: order.squareCheckoutId
  })
  
  try {
    // Check if order number already exists
    const existingCheck = await pool.query(
      "SELECT id, order_number FROM orders WHERE order_number = $1",
      [order.orderNumber]
    )
    
    if (existingCheck.rows.length > 0) {
      console.warn("[SAVE-ORDER] WARNING: Order number already exists!", {
        orderNumber: order.orderNumber,
        existingOrderId: existingCheck.rows[0].id
      })
    }
    
    const result = await pool.query(
      `INSERT INTO orders (order_number, email, format, price, product_name, square_checkout_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed')
       RETURNING id, order_number, created_at`,
      [
        order.orderNumber,
        order.email || null,
        order.format,
        order.price,
        order.productName,
        order.squareCheckoutId || null,
      ]
    )
    
    const savedOrder = result.rows[0]
    const duration = Date.now() - startTime
    
    console.log("[SAVE-ORDER] Order saved successfully:", {
      orderId: savedOrder.id,
      orderNumber: savedOrder.order_number,
      email: order.email,
      createdAt: savedOrder.created_at,
      duration: `${duration}ms`
    })
    
    return { lastInsertRowid: savedOrder.id }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("[SAVE-ORDER] Error saving order:", {
      orderNumber: order.orderNumber,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`
    })
    throw error
  }
}

export async function clearAllOrders(): Promise<void> {
  try {
    await pool.query("DELETE FROM orders")
    // Reset order counter to 26
    await pool.query("UPDATE order_counter SET current_number = 26 WHERE id = 1")
    console.log("All orders cleared and order counter reset")
  } catch (error) {
    console.error("Error clearing orders:", error)
    throw error
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    console.log("[GET-ALL-ORDERS] Fetching all orders...")
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC")
    console.log("[GET-ALL-ORDERS] Query returned", result.rows.length, "orders")
    if (result.rows.length > 0) {
      console.log("[GET-ALL-ORDERS] First order:", {
        id: result.rows[0].id,
        order_number: result.rows[0].order_number,
        created_at: result.rows[0].created_at,
        email: result.rows[0].email
      })
    }
    return result.rows as Order[]
  } catch (error) {
    console.error("[GET-ALL-ORDERS] Error fetching orders:", error)
    throw error
  }
}

export async function getOrderBySquareCheckoutId(squareCheckoutId: string): Promise<Order | null> {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE square_checkout_id = $1 ORDER BY created_at DESC LIMIT 1",
      [squareCheckoutId]
    )
    return result.rows.length > 0 ? (result.rows[0] as Order) : null
  } catch (error) {
    console.error("Error fetching order by Square checkout ID:", error)
    throw error
  }
}

export interface OrderWithNewsletter extends Order {
  is_newsletter_subscriber: boolean
  newsletter_subscribed_at: string | null
}

export async function getAllOrdersWithNewsletter(limit?: number, offset?: number): Promise<{ orders: OrderWithNewsletter[]; total: number }> {
  try {
    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) as total FROM orders")
    const total = parseInt(countResult.rows[0].total)
    
    // Build query with pagination
    let query = `
      SELECT 
        o.*,
        CASE WHEN ns.email IS NOT NULL THEN true ELSE false END as is_newsletter_subscriber,
        ns.created_at as newsletter_subscribed_at
      FROM orders o
      LEFT JOIN newsletter_subscribers ns ON LOWER(o.email) = LOWER(ns.email) AND ns.subscribed = true
      ORDER BY o.created_at DESC
    `
    
    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT $1 OFFSET $2`
      const result = await pool.query(query, [limit, offset])
      return { orders: result.rows as OrderWithNewsletter[], total }
    } else {
      const result = await pool.query(query)
      return { orders: result.rows as OrderWithNewsletter[], total }
    }
  } catch (error) {
    console.error("Error fetching orders with newsletter:", error)
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

export async function getAllNewsletterSubscribers(limit?: number, offset?: number): Promise<{ subscribers: { id: number; email: string; created_at: string; subscribed: boolean }[]; total: number }> {
  try {
    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) as total FROM newsletter_subscribers WHERE subscribed = TRUE")
    const total = parseInt(countResult.rows[0].total)
    
    let query = "SELECT * FROM newsletter_subscribers WHERE subscribed = TRUE ORDER BY created_at DESC"
    
    if (limit !== undefined && offset !== undefined) {
      query += " LIMIT $1 OFFSET $2"
      const result = await pool.query(query, [limit, offset])
      return { subscribers: result.rows, total }
    } else {
      const result = await pool.query(query)
      return { subscribers: result.rows, total }
    }
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error)
    throw error
  }
}

export interface VisitorIP {
  id: number
  ip_address: string
  user_agent: string | null
  path: string | null
  referer: string | null
  created_at: string
  last_visit: string
}

export async function trackVisitorIP(
  ipAddress: string,
  userAgent?: string | null,
  path?: string | null,
  referer?: string | null
): Promise<void> {
  try {
    // Check if IP already exists
    const existing = await pool.query(
      "SELECT id, last_visit FROM visitor_ips WHERE ip_address = $1",
      [ipAddress]
    )

    if (existing.rows.length > 0) {
      // Update last visit time
      await pool.query(
        "UPDATE visitor_ips SET last_visit = CURRENT_TIMESTAMP, user_agent = COALESCE($1, user_agent), path = COALESCE($2, path), referer = COALESCE($3, referer) WHERE ip_address = $4",
        [userAgent || null, path || null, referer || null, ipAddress]
      )
    } else {
      // Insert new visitor
      await pool.query(
        "INSERT INTO visitor_ips (ip_address, user_agent, path, referer) VALUES ($1, $2, $3, $4)",
        [ipAddress, userAgent || null, path || null, referer || null]
      )
    }
  } catch (error) {
    console.error("Error tracking visitor IP:", error)
    // Don't throw - tracking shouldn't break the app
  }
}

export async function getAllVisitorIPs(limit?: number, offset?: number): Promise<{ visitors: VisitorIP[]; total: number }> {
  try {
    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) as total FROM visitor_ips")
    const total = parseInt(countResult.rows[0].total)
    
    let query = "SELECT * FROM visitor_ips ORDER BY last_visit DESC"
    
    if (limit !== undefined && offset !== undefined) {
      query += " LIMIT $1 OFFSET $2"
      const result = await pool.query(query, [limit, offset])
      return { visitors: result.rows as VisitorIP[], total }
    } else {
      const result = await pool.query(query)
      return { visitors: result.rows as VisitorIP[], total }
    }
  } catch (error) {
    console.error("Error fetching visitor IPs:", error)
    throw error
  }
}

// Export getNextOrderNumber from order-number module
export { getNextOrderNumber } from "@/lib/order-number"
