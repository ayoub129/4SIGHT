"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const maxPolls = 30 // Poll for up to 30 seconds

  useEffect(() => {
    // Try to get payment ID from URL or check for any order created in last minute
    // Since Square redirects don't always include the payment ID, we'll poll for the most recent order
    let interval: NodeJS.Timeout | null = null
    let numberInterval: NodeJS.Timeout | null = null
    let attempts = 0
    
    const pollForOrder = async () => {
      interval = setInterval(async () => {
        attempts++
        
        try {
          // Try to get the most recent order (likely this customer's order)
          const response = await fetch(`/api/order-by-payment?paymentId=recent`)
          const data = await response.json()
          
          if (data.order && data.order.order_number) {
            const targetNumber = data.order.order_number
            
            // Animate number from 26 to the actual order number
            const duration = 2000 // 2 seconds
            const steps = 30
            const increment = (targetNumber - 26) / steps
            let currentStep = 0
            
            numberInterval = setInterval(() => {
              currentStep++
              if (currentStep <= steps) {
                setOrderNumber(Math.floor(26 + increment * currentStep))
              } else {
                setOrderNumber(targetNumber)
                setIsAnimating(false)
                if (numberInterval) clearInterval(numberInterval)
              }
            }, duration / steps)
            
            setIsLoading(false)
            if (interval) clearInterval(interval)
          } else if (attempts >= maxPolls) {
            // Stop polling after max attempts
            setIsLoading(false)
            if (interval) clearInterval(interval)
          }
        } catch (error) {
          console.error("Error polling for order:", error)
          if (attempts >= maxPolls) {
            setIsLoading(false)
            if (interval) clearInterval(interval)
          }
        }
      }, 1000) // Poll every 1 second
    }

    pollForOrder()

    return () => {
      if (interval) clearInterval(interval)
      if (numberInterval) clearInterval(numberInterval)
    }
  }, [])

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
          
          {/* Order Number Display */}
          <div className="py-8">
            {isLoading ? (
              <div className="space-y-2">
                <div className="text-6xl md:text-7xl font-black text-red-600 mb-2">
                  ...
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAnimating ? "Calculating your order number..." : "Processing..."}
                </p>
              </div>
            ) : orderNumber ? (
              <div className="space-y-2">
                <div className="text-6xl md:text-7xl font-black text-red-600 mb-2 transition-all duration-300">
                  #{orderNumber}
                </div>
                <p className="text-sm text-muted-foreground">
                  {orderNumber === 27 ? "You are the first to pre-order!" : `You are order #${orderNumber} to pre-order this book!`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your order number will be sent to your email shortly.
                </p>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
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

