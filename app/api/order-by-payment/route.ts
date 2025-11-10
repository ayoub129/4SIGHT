import { NextRequest, NextResponse } from "next/server"
import { getOrderBySquareCheckoutId, getAllOrders } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get("paymentId")

    // If paymentId is "recent", get the most recent order (for polling)
    if (paymentId === "recent") {
      const orders = await getAllOrders()
      // Return the most recent order created in the last 2 minutes
      const recentOrder = orders.find(order => {
        const orderTime = new Date(order.created_at).getTime()
        const now = Date.now()
        return (now - orderTime) < 120000 // 2 minutes
      })
      
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

