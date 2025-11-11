import { NextRequest, NextResponse } from "next/server"
import { trackVisitorIP } from "@/lib/db"

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip") // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to the connection IP (might be the proxy IP in production)
  return request.ip || "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null
    
    // Get the path from the request body or URL
    const body = await request.json().catch(() => ({}))
    const path = body.path || new URL(request.url).pathname || null
    
    // Track the visit (non-blocking)
    await trackVisitorIP(ipAddress, userAgent, path, referer)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visit:", error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// Also support GET for simple tracking
export async function GET(request: NextRequest) {
  try {
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null
    const path = new URL(request.url).searchParams.get("path") || new URL(request.url).pathname || null
    
    await trackVisitorIP(ipAddress, userAgent, path, referer)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visit:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

