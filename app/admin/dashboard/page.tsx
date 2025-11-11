"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [ordersCount, setOrders] = useState<number>(0)
  const [subscribersCount, setSubscribers] = useState<number>(0)
  const [visitorsCount, setVisitors] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCounts()
  }, [])

  const fetchCounts = async () => {
    try {
      // Fetch just the counts for summary
      const [ordersRes, subscribersRes, visitorsRes] = await Promise.all([
        fetch("/api/admin/orders?page=1&limit=1"),
        fetch("/api/admin/newsletter?page=1&limit=1"),
        fetch("/api/admin/visitors?page=1&limit=1")
      ])

      if (ordersRes.status === 401 || subscribersRes.status === 401 || visitorsRes.status === 401) {
        router.push("/admin/login")
        return
      }

      const ordersData = await ordersRes.json()
      const subscribersData = await subscribersRes.json()
      const visitorsData = await visitorsRes.json()

      setOrders(ordersData.pagination?.total || 0)
      setSubscribers(subscribersData.pagination?.total || 0)
      setVisitors(visitorsData.pagination?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-5xl font-black mb-2 tracking-tighter text-red-600"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              4SIGHT
            </h1>
            <p className="text-muted-foreground">Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border-2 border-foreground/20 rounded-xl hover:border-foreground/40 cursor-pointer transition-all"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-600 rounded-xl p-4 mb-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-card rounded-xl border-2 border-foreground/20 p-6 hover:border-foreground/40 transition-all cursor-pointer text-left"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Orders</h3>
            <p className="text-3xl font-black text-red-600">{ordersCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Click to view all orders →</p>
          </button>
          <button
            onClick={() => router.push("/admin/newsletter")}
            className="bg-card rounded-xl border-2 border-foreground/20 p-6 hover:border-foreground/40 transition-all cursor-pointer text-left"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Newsletter Subscribers</h3>
            <p className="text-3xl font-black text-red-600">{subscribersCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Click to view all subscribers →</p>
          </button>
          <button
            onClick={() => router.push("/admin/visitors")}
            className="bg-card rounded-xl border-2 border-foreground/20 p-6 hover:border-foreground/40 transition-all cursor-pointer text-left"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Unique Visitors</h3>
            <p className="text-3xl font-black text-red-600">{visitorsCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Click to view all visitors →</p>
          </button>
        </div>
      </div>
    </div>
  )
}

