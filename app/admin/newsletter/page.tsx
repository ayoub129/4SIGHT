"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface NewsletterSubscriber {
  id: number
  email: string
  created_at: string
  subscribed: boolean
}

function NewsletterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const currentPage = parseInt(searchParams.get("page") || "1", 10)

  useEffect(() => {
    fetchSubscribers(currentPage)
  }, [currentPage])

  const fetchSubscribers = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/newsletter?page=${page}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(data.error || "Failed to fetch subscribers")
      }

      setSubscribers(data.subscribers || [])
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
    router.push(`/admin/newsletter?page=${page}`)
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
            <p className="text-muted-foreground">Newsletter Subscribers</p>
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

        {/* Newsletter Subscribers Table */}
        <div className="bg-card rounded-xl border-2 border-foreground/20 overflow-hidden">
          <div className="p-6 border-b border-foreground/20">
            <h2 className="text-2xl font-bold">Newsletter Subscribers ({pagination.total})</h2>
          </div>

          {subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No newsletter subscribers yet</p>
            </div>
          ) : (
            <>
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-foreground/20 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * 25) + 1} to {Math.min(pagination.page * 25, pagination.total)} of {pagination.total} subscribers
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

export default function AdminNewsletterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <NewsletterContent />
    </Suspense>
  )
}

