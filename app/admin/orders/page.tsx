"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface Order {
  id: number
  order_number: number
  email: string | null
  format: string
  price: string
  product_name: string
  square_checkout_id: string | null
  created_at: string
  status: string
  is_newsletter_subscriber?: boolean
  newsletter_subscribed_at?: string | null
}

function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/orders?page=${page}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to fetch orders")
      }

      setOrders(data.orders || [])
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 })
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

  const goToPage = (page: number) => {
    router.push(`/admin/orders?page=${page}`)
  }

  const handleClearOrders = async () => {
    if (!confirm("Are you sure you want to clear ALL orders? This will reset the order counter to 26 and cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/admin/clear-orders", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to clear orders")
      }

      // Refresh the page to show empty state
      router.refresh()
      fetchOrders(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear orders")
    }
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
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 
              className="text-5xl font-black mb-2 tracking-tighter text-red-600"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              4SIGHT
            </h1>
            <p className="text-muted-foreground">Orders Management</p>
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

        {/* Orders Table */}
        <div className="bg-card rounded-xl border-2 border-foreground/20 overflow-hidden">
          <div className="p-6 border-b border-foreground/20 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Orders ({pagination.total})</h2>
            {pagination.total > 0 && (
              <button
                onClick={handleClearOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-semibold"
              >
                Clear All Orders
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Order #</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email / Newsletter</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Format</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-foreground/10 hover:bg-muted/30">
                        <td className="px-6 py-4 font-semibold">#{order.order_number}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={order.email ? "" : "text-muted-foreground italic"}>
                              {order.email || "No email yet"}
                            </span>
                            {order.is_newsletter_subscriber && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 inline-block w-fit">
                                ✓ Newsletter Subscriber
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">{order.format}</td>
                        <td className="px-6 py-4">${order.price}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-foreground/20 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * 25) + 1} to {Math.min(pagination.page * 25, pagination.total)} of {pagination.total} orders
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border-2 border-foreground/20 rounded-xl hover:border-foreground/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-4 py-2 border-2 border-foreground/20 rounded-xl hover:border-foreground/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}

