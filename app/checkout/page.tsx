"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const format = searchParams.get("format") as "ebook" | "paperback" | null
  const price = searchParams.get("price") || "0"
  
  const productName = format === "ebook" ? "4SIGHT - Ebook" : "4SIGHT - Paper Book"
  const displayPrice = `$${price}`

  useEffect(() => {
    if (!format || !price) {
      router.push("/")
    }
  }, [format, price, router])

  // Track visitor IP address
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: window.location.pathname + window.location.search,
          }),
        })
      } catch (error) {
        // Silently fail - tracking shouldn't break the site
        console.error("Failed to track visit:", error)
      }
    }
    
    trackVisit()
  }, [])

  const handleCheckout = async () => {
    if (!format || !price) {
      setError("Missing product information")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call Square Checkout API
      const response = await fetch("/api/square-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format,
          price,
          productName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout")
      }

      // Redirect to Square checkout URL
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  if (!format || !price) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 tracking-tighter text-red-600">
            4SIGHT
          </h1>
          <p className="text-muted-foreground">Complete Your Purchase</p>
        </div>

        {/* Order Summary */}
        <div className="border-2 border-foreground/20 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{productName}</p>
              <p className="text-sm text-muted-foreground">
                {format === "ebook" ? "Digital Download" : "Physical Book"}
              </p>
            </div>
            <p className="text-xl font-bold">{displayPrice}</p>
          </div>

          <div className="border-t border-foreground/20 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Total</p>
              <p className="text-2xl font-black">{displayPrice}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-600 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full px-8 py-4 bg-foreground text-background font-semibold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg"
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </button>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Customer information will be collected securely through Square checkout
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full px-8 py-4 border-2 border-foreground/20 rounded-xl hover:border-foreground/40 cursor-pointer transition-all"
        >
          Back to Home
        </button>

        {/* Security Notice */}
        <p className="text-xs text-center text-muted-foreground">
          Secure payment powered by Square
        </p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

