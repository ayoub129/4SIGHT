"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"

function CheckoutSuccessContent() {
  const router = useRouter()

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
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          <p className="text-sm text-muted-foreground mt-4">
            You will receive a confirmation email shortly with your order details and order number.
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

