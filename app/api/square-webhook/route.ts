import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

/**
 * Square Webhook Handler
 * 
 * Square sends webhooks when payments are completed.
 * This endpoint captures customer data including email, name, and payment details.
 * 
 * To set up webhooks in Square:
 * 1. Go to Square Developer Dashboard
 * 2. Navigate to your application
 * 3. Go to Webhooks section
 * 4. Add webhook URL: https://yourdomain.com/api/square-webhook
 * 5. Subscribe to events: payment.created, payment.updated
 * 
 * Square will send customer email, name, and payment information in the webhook payload.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-square-signature")
    const webhookUrl = request.headers.get("x-square-webhook-url")

    // Verify webhook signature (recommended for production)
    // You'll need to set SQUARE_WEBHOOK_SECRET in your environment variables
    const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const hash = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("base64")
      
      if (hash !== signature) {
        console.error("Invalid webhook signature")
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    const data = JSON.parse(body)
    
    // Square webhook structure
    // data.type will be "payment.created" or "payment.updated"
    // data.data.object will contain the payment object
    if (data.type && data.data?.object) {
      const payment = data.data.object
      
      // Extract customer information from Square payment
      const customerEmail = payment?.buyer_email_address || 
                           payment?.customer_email_address ||
                           payment?.billing_address?.address_line_1 // Sometimes email is in billing
      
      const customerName = payment?.buyer_email_address ? 
        payment?.buyer_email_address.split("@")[0] : 
        payment?.customer_id || "Customer"
      
      const squareCheckoutId = payment?.id || payment?.order_id
      const amount = payment?.amount_money?.amount
      const currency = payment?.amount_money?.currency || "USD"
      
      // Update order in database with customer email
      if (squareCheckoutId && customerEmail) {
        try {
          const { updateOrderWithCustomerEmail } = await import("@/lib/db")
          await updateOrderWithCustomerEmail(squareCheckoutId, customerEmail)
          console.log(`Updated order ${squareCheckoutId} with email: ${customerEmail}`)
        } catch (dbError) {
          console.error("Error updating order with customer email:", dbError)
        }
      }

      console.log("Square webhook received:", {
        type: data.type,
        paymentId: squareCheckoutId,
        customerEmail,
        amount: amount ? (amount / 100).toFixed(2) : "N/A",
        currency,
      })
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    // Still return 200 to prevent Square from retrying
    return NextResponse.json({ received: true, error: "Processing error" })
  }
}

// Square requires GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: "Square webhook endpoint is active",
    note: "Square will send POST requests to this endpoint when payments are completed"
  })
}

