"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [number, setNumber] = useState(27)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Get order number from URL parameter
    const orderNumberParam = searchParams.get("orderNumber")
    const targetNumber = orderNumberParam ? parseInt(orderNumberParam, 10) : 27

    // Animate number from 27 to the actual order number
    const duration = 2000 // 2 seconds
    const steps = 30
    const increment = (targetNumber - 27) / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setNumber(Math.floor(27 + increment * currentStep))
      } else {
        setNumber(targetNumber)
        setIsAnimating(false)
        clearInterval(interval)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-red-600">4SIGHT</h1>
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="text-muted-foreground">
            Your order has been successfully processed.
          </p>
          
          {/* Number Dial */}
          <div className="py-8">
            <div className="inline-block">
              <div className="text-6xl md:text-7xl font-black text-red-600 mb-2 transition-all duration-300">
                #{number}
              </div>
              <p className="text-sm text-muted-foreground">
                {isAnimating ? "Calculating your order number..." : "Your order number"}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly with your order details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-8">
          <button
            onClick={() => router.push("/")}
            className="w-full px-8 py-4 bg-foreground text-background font-semibold text-lg rounded-xl hover:opacity-90 cursor-pointer transition-all shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

