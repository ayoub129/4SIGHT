"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

interface NewsletterSubscriber {
  id: number
  email: string
  created_at: string
  subscribed: boolean
}

interface VisitorIP {
  id: number
  ip_address: string
  user_agent: string | null
  path: string | null
  referer: string | null
  created_at: string
  last_visit: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [visitors, setVisitors] = useState<VisitorIP[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
    fetchSubscribers()
    fetchVisitors()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to fetch orders")
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/newsletter")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to fetch subscribers")
      }

      setSubscribers(data.subscribers || [])
    } catch (err) {
      console.error("Error fetching subscribers:", err)
    }
  }

  const fetchVisitors = async () => {
    try {
      const response = await fetch("/api/admin/visitors")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to fetch visitors")
      }

      setVisitors(data.visitors || [])
    } catch (err) {
      console.error("Error fetching visitors:", err)
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

        {/* Orders Table */}
        <div className="bg-card rounded-xl border-2 border-foreground/20 overflow-hidden">
          <div className="p-6 border-b border-foreground/20">
            <h2 className="text-2xl font-bold">Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Newsletter Subscribers Table */}
        <div className="bg-card rounded-xl border-2 border-foreground/20 overflow-hidden mt-8">
          <div className="p-6 border-b border-foreground/20">
            <h2 className="text-2xl font-bold">Newsletter Subscribers ({subscribers.length})</h2>
          </div>

          {subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No newsletter subscribers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Subscribed Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-t border-foreground/10 hover:bg-muted/30">
                      <td className="px-6 py-4">{subscriber.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                          subscriber.subscribed 
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                        }`}>
                          {subscriber.subscribed ? "✓ Subscribed" : "Unsubscribed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Visitor IPs Table */}
        <div className="bg-card rounded-xl border-2 border-foreground/20 overflow-hidden mt-8">
          <div className="p-6 border-b border-foreground/20">
            <h2 className="text-2xl font-bold">Visitor IP Addresses ({visitors.length})</h2>
          </div>

          {visitors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No visitor IPs tracked yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">IP Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">First Visit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Last Visit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Path</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="border-t border-foreground/10 hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono text-sm">{visitor.ip_address}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(visitor.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(visitor.last_visit).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {visitor.path || "-"}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate" title={visitor.user_agent || ""}>
                        {visitor.user_agent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

