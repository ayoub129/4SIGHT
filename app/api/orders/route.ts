import { NextRequest, NextResponse } from "next/server"
import { saveOrder } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, email, format, price, productName, squareCheckoutId } = body

    if (!orderNumber || !email || !format || !price || !productName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save order to database
    const result = await saveOrder({
      orderNumber,
      email,
      format,
      price,
      productName,
      squareCheckoutId,
    })

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Error saving order:", error)
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    )
  }
}

