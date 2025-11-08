import { NextRequest, NextResponse } from "next/server"
import { getNextOrderNumber } from "@/lib/order-number"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, price, productName, email } = body

    if (!format || !price || !productName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the next sequential order number (starts from 27)
    const orderNumber = await getNextOrderNumber()

    // Square Checkout API configuration
    // Replace these with your actual Square credentials
    const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
    const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID
    const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || "sandbox" // or "production"

    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      return NextResponse.json(
        { error: "Square credentials not configured" },
        { status: 500 }
      )
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

    // Save order to database
    try {
      const { saveOrder } = await import("@/lib/db")
      await saveOrder({
        orderNumber,
        email,
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

