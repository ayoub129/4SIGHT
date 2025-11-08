"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 
            className="text-5xl font-black mb-2 tracking-tighter text-red-600"
            style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
          >
            4SIGHT
          </h1>
          <p className="text-muted-foreground">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-foreground/20 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all"
              placeholder="admin.4sight@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-foreground/20 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-600 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-foreground text-background font-semibold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

