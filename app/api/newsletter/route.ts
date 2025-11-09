import { NextRequest, NextResponse } from "next/server"
import { subscribeToNewsletter } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const result = await subscribeToNewsletter(email)

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    
    // Check if it's a unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    )
  }
}

