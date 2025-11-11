import { NextRequest, NextResponse } from "next/server"
import { getAllVisitorIPs } from "@/lib/db"

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

    const visitors = await getAllVisitorIPs()
    return NextResponse.json({ visitors })
  } catch (error) {
    console.error("Error fetching visitor IPs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

