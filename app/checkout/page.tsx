"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  
  const format = searchParams.get("format") as "ebook" | "paperback" | null
  const price = searchParams.get("price") || "0"
  
  const productName = format === "ebook" ? "4SIGHT - Ebook" : "4SIGHT - Paper Book"
  const displayPrice = `$${price}`

  useEffect(() => {
    if (!format || !price) {
      router.push("/")
    }
  }, [format, price, router])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!format || !price) {
      setError("Missing product information")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call Square Checkout API (email is optional)
      const response = await fetch("/api/square-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format,
          price,
          productName,
          email: email || undefined, // Email is optional
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

        {/* Email Input */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-base border-2 border-foreground/20 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-2">
              We'll send your order confirmation to this email. You can add it later if you prefer.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-600 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-foreground text-background font-semibold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>

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

