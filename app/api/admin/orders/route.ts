import { NextRequest, NextResponse } from "next/server"
import { getAllOrdersWithNewsletter } from "@/lib/db"

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

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    if (!verifySession(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = 25
    const offset = (page - 1) * limit

    const { orders, total } = await getAllOrdersWithNewsletter(limit, offset)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ 
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

