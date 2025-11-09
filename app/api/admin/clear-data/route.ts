import { NextRequest, NextResponse } from "next/server"
import { clearAllOrders } from "@/lib/db"

function verifySession(request: NextRequest): boolean {
  const sessionToken = request.cookies.get("admin_session")?.value
  if (!sessionToken) {
    return false
  }

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8")
    const [email] = decoded.split(":")
    return email === "admin.4sight@gmail.com"
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    if (!verifySession(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await clearAllOrders()
    
    return NextResponse.json({ 
      success: true,
      message: "All orders cleared and order counter reset to 26"
    })
  } catch (error) {
    console.error("Error clearing orders:", error)
    return NextResponse.json(
      { error: "Failed to clear orders" },
      { status: 500 }
    )
  }
}

