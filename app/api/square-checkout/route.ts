import { NextRequest, NextResponse } from "next/server"
import { getNextOrderNumber } from "@/lib/order-number"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, price, productName, email } = body

    if (!format || !price || !productName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    // Email is optional

    // Square Checkout API configuration
    // Replace these with your actual Square credentials
    const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
    const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID
    const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || "sandbox" // or "production"

    // Check which credentials are missing
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      const missing = []
      if (!SQUARE_APPLICATION_ID) missing.push("SQUARE_APPLICATION_ID")
      if (!SQUARE_ACCESS_TOKEN) missing.push("SQUARE_ACCESS_TOKEN")
      if (!SQUARE_LOCATION_ID) missing.push("SQUARE_LOCATION_ID")
      
      console.error("Missing Square credentials:", missing)
      return NextResponse.json(
        { 
          error: "Square credentials not configured",
          missing: missing,
          message: `Please add these environment variables to Vercel: ${missing.join(", ")}`
        },
        { status: 500 }
      )
    }

    // Get the next sequential order number (starts from 27)
    let orderNumber: number
    try {
      orderNumber = await getNextOrderNumber()
    } catch (dbError) {
      console.error("Error getting order number:", dbError)
      // Continue with a fallback order number
      orderNumber = Math.floor(Date.now() / 1000) % 1000000 + 27
    }

    // Square API base URL
    const squareApiUrl =
      SQUARE_ENVIRONMENT === "production"
        ? "https://connect.squareup.com"
        : "https://connect.squareupsandbox.com"

    // Create payment link request using Square's Payment Links API
    const paymentLinkRequest = {
      idempotency_key: `${format}-${Date.now()}-${Math.random()}`,
      quick_pay: {
        name: productName,
        price_money: {
          amount: Math.round(parseFloat(price) * 100), // Convert to cents
          currency: "USD",
        },
        location_id: SQUARE_LOCATION_ID,
      },
      checkout_options: {
        ask_for_shipping_address: format === "paperback",
        allow_tipping: false,
        accepted_payment_methods: {
          apple_pay: true,
          google_pay: true,
          cash_app_pay: true,
          afterpay_clearpay: true,
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?orderNumber=${orderNumber}`,
      },
    }

    // Call Square Payment Links API
    const response = await fetch(`${squareApiUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Square-Version": "2024-01-18",
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentLinkRequest),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Square API Error:", data)
      return NextResponse.json(
        { error: data.errors?.[0]?.detail || "Failed to create checkout" },
        { status: response.status }
      )
    }

    const checkoutId = data.payment_link?.id

    // Save order to database (email is optional)
    try {
      const { saveOrder } = await import("@/lib/db")
      await saveOrder({
        orderNumber,
        email: email || null,
        format,
        price,
        productName,
        squareCheckoutId: checkoutId,
      })
    } catch (dbError) {
      console.error("Error saving order to database:", dbError)
      // Continue even if database save fails
    }

    // Return payment link URL and order number
    return NextResponse.json({
      checkoutUrl: data.payment_link?.url,
      checkoutId,
      orderNumber,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: errorMessage,
        // Only include stack in development
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      },
      { status: 500 }
    )
  }
}

