"use client"

import type React from "react"

import { useState } from "react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [preorderType, setPreorderType] = useState<"ebook" | "paperback" | null>(null)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    alert(`Thank you! We'll notify ${email} about updates.`)
    setEmail("")
  }

  const handlePreorder = (type: "ebook" | "paperback") => {
    setPreorderType(type)
    alert(`You've preordered the ${type}. Coming soon!`)
  }

  return (
    <section className="relative py-20 px-4">
      {/* Decorative cards */}
      <div className="absolute top-10 right-5 w-16 h-24 border border-foreground/10 rounded-sm opacity-15 transform rotate-12" />
      <div className="absolute bottom-10 left-8 w-20 h-28 border border-foreground/10 rounded-sm opacity-10 transform -rotate-6" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Secure Your Copy</h2>
          <p className="text-lg text-muted-foreground font-light">
            Join the community of readers who are already experiencing 4SIGHT
          </p>
        </div>

        {/* Preorder buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => handlePreorder("ebook")}
            className={`group relative px-8 py-6 font-semibold tracking-wide transition-all duration-300 border-2 rounded-sm ${
              preorderType === "ebook"
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground/5"
            }`}
          >
            <span className="relative z-10 flex flex-col">
              <span>Preorder eBook</span>
              <span className="text-xs font-light tracking-widest mt-1 opacity-70">Coming Soon</span>
            </span>
          </button>

          <button
            onClick={() => handlePreorder("paperback")}
            className={`group relative px-8 py-6 font-semibold tracking-wide transition-all duration-300 border-2 rounded-sm ${
              preorderType === "paperback"
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground/5"
            }`}
          >
            <span className="relative z-10 flex flex-col">
              <span>Preorder Paperback</span>
              <span className="text-xs font-light tracking-widest mt-1 opacity-70">Coming Soon</span>
            </span>
          </button>
        </div>

        {/* Email signup */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-muted border border-foreground/20 rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-foreground text-background font-semibold tracking-wide rounded-sm hover:bg-muted-foreground/80 transition-colors"
            >
              Notify Me About Updates
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4 font-light">
            We'll keep you posted on release dates and exclusive content
          </p>
        </div>
      </div>
    </section>
  )
}
