import { useState, useEffect } from 'react'

interface HomepageStats {
  overview: {
    totalCustomers: number
    totalOrders: number
    completedOrders: number
    totalCities: number
    totalBranches: number
    totalRevenue: number
    averageRating: number
    totalRatings: number
    vipCustomers: number
  }
  recentActivity: {
    newCustomersThisMonth: number
    newOrdersThisMonth: number
  }
  ordersByStatus: Record<string, number>
  topCities: Array<{
    name: string
    orders: number
  }>
  growth: {
    customerGrowth: string
    orderGrowth: string
  }
}

interface StatsResponse {
  success: boolean
  data: HomepageStats
}

export function useHomepageStats() {
  const [stats, setStats] = useState<HomepageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/stats/homepage')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: StatsResponse = await response.json()
        
        if (data.success) {
          setStats(data.data)
        } else {
          throw new Error('Failed to fetch stats')
        }
      } catch (err) {
        console.error('Error fetching homepage stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}