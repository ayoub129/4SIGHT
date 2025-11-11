import { NextRequest, NextResponse } from "next/server"
import { getOrderBySquareCheckoutId, getAllOrders } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get("paymentId")

    // If paymentId is "recent", get the most recent order (for polling)
    if (paymentId === "recent") {
      console.log("[ORDER-BY-PAYMENT] Fetching recent order...")
      const orders = await getAllOrders()
      console.log("[ORDER-BY-PAYMENT] Total orders found:", orders.length)
      
      if (orders.length > 0) {
        // Log all orders with their timestamps
        orders.slice(0, 5).forEach((order, index) => {
          const orderTime = new Date(order.created_at).getTime()
          const now = Date.now()
          const age = now - orderTime
          console.log(`[ORDER-BY-PAYMENT] Order #${order.order_number}:`, {
            created_at: order.created_at,
            ageMs: age,
            ageSeconds: Math.floor(age / 1000),
            isRecent: age < 120000
          })
        })
      }
      
      // Return the most recent order created in the last 2 minutes
      const recentOrder = orders.find(order => {
        const orderTime = new Date(order.created_at).getTime()
        const now = Date.now()
        const age = now - orderTime
        return age < 120000 // 2 minutes
      })
      
      if (recentOrder) {
        console.log("[ORDER-BY-PAYMENT] Found recent order:", {
          orderNumber: recentOrder.order_number,
          email: recentOrder.email,
          created_at: recentOrder.created_at
        })
      } else {
        console.log("[ORDER-BY-PAYMENT] No recent order found (within 2 minutes)")
        // If no recent order, return the most recent one anyway (might be slightly older)
        if (orders.length > 0) {
          const mostRecent = orders[0]
          const orderTime = new Date(mostRecent.created_at).getTime()
          const now = Date.now()
          const age = now - orderTime
          console.log("[ORDER-BY-PAYMENT] Most recent order is:", {
            orderNumber: mostRecent.order_number,
            ageSeconds: Math.floor(age / 1000),
            ageMinutes: Math.floor(age / 60000)
          })
          // Return it if it's less than 5 minutes old (more lenient)
          if (age < 300000) {
            console.log("[ORDER-BY-PAYMENT] Returning most recent order (within 5 minutes)")
            return NextResponse.json({ order: mostRecent })
          }
        }
      }
      
      return NextResponse.json({ order: recentOrder || null })
    }

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      )
    }

    const order = await getOrderBySquareCheckoutId(paymentId)

    if (!order) {
      return NextResponse.json({ order: null })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

