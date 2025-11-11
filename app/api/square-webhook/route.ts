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

    console.log("[WEBHOOK] Webhook received:", {
      hasBody: !!body,
      bodyLength: body.length,
      hasSignature: !!signature,
      webhookUrl
    })

    // Verify webhook signature (recommended for production)
    // You'll need to set SQUARE_WEBHOOK_SECRET in your environment variables
    const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const hash = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("base64")
      
      if (hash !== signature) {
        console.error("[WEBHOOK] Invalid webhook signature")
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    const data = JSON.parse(body)
    console.log("[WEBHOOK] Parsed webhook data:", {
      type: data.type,
      hasData: !!data.data,
      hasObject: !!data.data?.object,
      paymentId: data.data?.object?.id,
      fullDataKeys: Object.keys(data),
      dataKeys: data.data ? Object.keys(data.data) : null
    })
    
    // Log the full structure to understand what Square is sending
    console.log("[WEBHOOK] Full webhook payload structure:", JSON.stringify(data, null, 2).substring(0, 1000))
    
    // Square webhook structure can vary
    // Try different possible structures
    let payment = null
    
    // Structure 1: data.data.object (most common)
    if (data.data?.object) {
      payment = data.data.object
      console.log("[WEBHOOK] Found payment in data.data.object")
    }
    // Structure 2: data.object (alternative)
    else if (data.object) {
      payment = data.object
      console.log("[WEBHOOK] Found payment in data.object")
    }
    // Structure 3: data itself might be the payment
    else if (data.id && data.status) {
      payment = data
      console.log("[WEBHOOK] Found payment as root data object")
    }
    // Structure 4: Check if it's an array
    else if (Array.isArray(data.data)) {
      payment = data.data[0]
      console.log("[WEBHOOK] Found payment in data array")
    }
    
    if (!payment) {
      console.error("[WEBHOOK] ❌ Could not find payment object in webhook payload")
      console.log("[WEBHOOK] Payload structure:", JSON.stringify(data, null, 2))
      return NextResponse.json({ received: true, error: "Payment object not found" })
    }
    
    console.log("[WEBHOOK] Payment object found:", {
      id: payment.id,
      status: payment.status,
      amount: payment.amount_money?.amount,
      hasEmail: !!(payment.buyer_email_address || payment.customer_email_address)
    })
    
    // Only process completed payments
    const paymentStatus = payment?.status
    if (paymentStatus !== "COMPLETED") {
      console.log(`[WEBHOOK] Payment ${payment?.id} status: ${paymentStatus}, skipping order creation`)
      return NextResponse.json({ received: true })
    }
    
    // Extract customer information from Square payment
    const customerEmail = payment?.buyer_email_address || 
                         payment?.customer_email_address ||
                         payment?.billing_address?.email_address ||
                         payment?.email_address
    
    const squarePaymentId = payment?.id
    const squareOrderId = payment?.order_id
    const amount = payment?.amount_money?.amount
    const currency = payment?.amount_money?.currency || "USD"
    
    console.log("[WEBHOOK] Extracted payment data:", {
      paymentId: squarePaymentId,
      orderId: squareOrderId,
      customerEmail,
      amount,
      currency,
      paymentStatus: payment?.status,
      paymentSource: payment?.source_type,
      hasBuyerEmail: !!payment?.buyer_email_address,
      hasCustomerEmail: !!payment?.customer_email_address,
      hasBillingEmail: !!payment?.billing_address?.email_address
    })
    
    // Get payment link details to retrieve order metadata (format, price, productName)
    // We need to fetch the payment link to get the note/metadata
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
    const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || "sandbox"
    const squareApiUrl = SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com"
    
    let orderDetails = { format: "unknown", price: "0", productName: "4SIGHT" }
    
    // Try to get order details from payment link
    if (squareOrderId) {
      try {
        // Fetch order details from Square
        const orderResponse = await fetch(`${squareApiUrl}/v2/orders/${squareOrderId}`, {
          headers: {
            "Square-Version": "2024-01-18",
            "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
          },
        })
        
        if (orderResponse.ok) {
          const orderData = await orderResponse.json()
          const lineItems = orderData.order?.line_items || []
          if (lineItems.length > 0) {
            const item = lineItems[0]
            const itemName = item.name || ""
            
            // Parse format from product name
            if (itemName.includes("Ebook") || itemName.includes("ebook")) {
              orderDetails.format = "ebook"
              orderDetails.price = "4.99"
            } else if (itemName.includes("Paper") || itemName.includes("paperback")) {
              orderDetails.format = "paperback"
              orderDetails.price = "14.99"
            }
            orderDetails.productName = itemName
          }
        }
      } catch (error) {
        console.error("Error fetching order details from Square:", error)
      }
    }
    
    // Create order in database only after payment is completed
    // Create order even if email is missing (we can update it later)
    if (amount) {
      try {
        console.log("[WEBHOOK] Starting order creation process:", {
          customerEmail: customerEmail || "NO EMAIL",
          amount,
          format: orderDetails.format,
          price: orderDetails.price,
          squarePaymentId,
          squareOrderId
        })
        
        const { saveOrder, getNextOrderNumber } = await import("@/lib/db")
        
        console.log("[WEBHOOK] Calling getNextOrderNumber()...")
        const orderNumber = await getNextOrderNumber()
        console.log("[WEBHOOK] Received order number:", orderNumber)
        
        console.log("[WEBHOOK] Calling saveOrder() with order number:", orderNumber)
        await saveOrder({
          orderNumber,
          email: customerEmail || null, // Allow null email
          format: orderDetails.format,
          price: orderDetails.price,
          productName: orderDetails.productName,
          squareCheckoutId: squarePaymentId || squareOrderId || null,
        })
        
        console.log("[WEBHOOK] ✅ Successfully created order #" + orderNumber + (customerEmail ? " for " + customerEmail : " (no email)") + " after payment completion")
      } catch (dbError) {
        console.error("[WEBHOOK] ❌ Error creating order after payment:", {
          error: dbError instanceof Error ? dbError.message : String(dbError),
          stack: dbError instanceof Error ? dbError.stack : undefined,
          customerEmail,
          amount
        })
      }
    } else {
      console.log("[WEBHOOK] ⚠️ Skipping order creation - missing amount:", {
        hasEmail: !!customerEmail,
        hasAmount: !!amount,
        customerEmail,
        amount,
        paymentId: squarePaymentId
      })
    }

    console.log("[WEBHOOK] Square webhook received - payment completed:", {
      type: data.type,
      paymentId: squarePaymentId,
      orderId: squareOrderId,
      customerEmail,
      amount: amount ? (amount / 100).toFixed(2) : "N/A",
      currency,
      format: orderDetails.format,
    })

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

