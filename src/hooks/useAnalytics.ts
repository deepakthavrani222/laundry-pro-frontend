import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

interface WeeklyOrderData {
  name: string
  date: string
  orders: number
  revenue: number
}

interface OrderStatusData {
  name: string
  value: number
  color: string
  status: string
}

interface RevenueData {
  daily: Array<{
    name: string
    date: string
    revenue: number
    orders: number
  }>
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
}

interface HourlyOrderData {
  hour: string
  orders: number
  revenue: number
}

interface ServiceDistributionData {
  name: string
  value: number
  revenue: number
  color: string
}

export function useAdminAnalytics() {
  const [weeklyOrders, setWeeklyOrders] = useState<WeeklyOrderData[]>([])
  const [orderStatus, setOrderStatus] = useState<OrderStatusData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistributionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [weeklyRes, statusRes, revenueRes, serviceRes] = await Promise.all([
        api.get('/admin/analytics/weekly-orders'),
        api.get('/admin/analytics/order-status'),
        api.get('/admin/analytics/revenue'),
        api.get('/admin/analytics/service-distribution')
      ])

      if (weeklyRes.data.success) {
        setWeeklyOrders(weeklyRes.data.data)
      }
      if (statusRes.data.success) {
        setOrderStatus(statusRes.data.data)
      }
      if (revenueRes.data.success) {
        setRevenueData(revenueRes.data.data)
      }
      if (serviceRes.data.success) {
        setServiceDistribution(serviceRes.data.data)
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.response?.data?.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    weeklyOrders,
    orderStatus,
    revenueData,
    serviceDistribution,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

export function useBranchAnalytics() {
  const [hourlyOrders, setHourlyOrders] = useState<HourlyOrderData[]>([])
  const [orderStatus, setOrderStatus] = useState<OrderStatusData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [hourlyRes, statusRes] = await Promise.all([
        api.get('/admin/analytics/hourly-orders'),
        api.get('/admin/analytics/order-status')
      ])

      if (hourlyRes.data.success) {
        setHourlyOrders(hourlyRes.data.data)
      }
      if (statusRes.data.success) {
        setOrderStatus(statusRes.data.data)
      }
    } catch (err: any) {
      console.error('Error fetching branch analytics:', err)
      setError(err.response?.data?.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    hourlyOrders,
    orderStatus,
    loading,
    error,
    refetch: fetchAnalytics
  }
}


// Center Admin Analytics Hooks

import { centerAdminApi } from '@/lib/centerAdminApi'

interface AnalyticsOverview {
  customerMetrics: {
    totalCustomers: number
    newCustomers: number
    retentionRate: number
    growth: number
  }
  revenueMetrics: {
    totalRevenue: number
    averageOrderValue: number
    growth: number
  }
  orderMetrics: {
    totalOrders: number
    completedOrders: number
    cancelledOrders: number
    completionRate: number
  }
  branchMetrics: {
    totalBranches: number
    activeBranches: number
    averageRevenuePerBranch: number
    totalBranchRevenue: number
  }
}

interface AnalyticsItem {
  _id: string
  analyticsId: string
  type: string
  status: string
  startDate: string
  endDate: string
  createdAt: string
  createdBy: {
    name: string
  }
}

interface AnalyticsFilters {
  type: string
  status: string
  search: string
  page: number
  limit: number
}

export function useAnalyticsOverview(timeframe: string) {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await centerAdminApi.getAnalyticsOverview(timeframe)
      
      if (response.success && response.data?.overview) {
        setOverview(response.data.overview)
      }
    } catch (err: any) {
      console.error('Error fetching analytics overview:', err)
      setError(err.message || 'Failed to fetch overview')
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  return { overview, loading, error, refetch: fetchOverview }
}

export function useAnalytics(filters: AnalyticsFilters) {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await centerAdminApi.getAnalytics({
        page: filters.page,
        limit: filters.limit,
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined
      })
      
      if (response.success && response.data) {
        setAnalytics(response.data.analytics || [])
        setPagination(response.data.pagination || {
          current: filters.page,
          pages: 1,
          total: 0,
          limit: filters.limit
        })
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { analytics, pagination, loading, error, refetch: fetchAnalytics }
}

export function useAnalyticsGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCustomerRetentionAnalysis = async (data: { startDate: string; endDate: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await centerAdminApi.generateCustomerRetentionAnalysis(data)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateBranchPerformanceAnalysis = async (data: { startDate: string; endDate: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await centerAdminApi.generateBranchPerformanceAnalysis(data)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateRevenueForecast = async (data: { 
    startDate: string
    endDate: string
    forecastHorizon: number
    methodology: string 
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await centerAdminApi.generateRevenueForecast(data)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateExpansionAnalysis = async (data: {
    targetLocation: { city: string; area: string; pincode: string }
    marketData: {
      populationDensity: number
      averageIncome: number
      competitorCount: number
      marketSaturation: number
      demandEstimate: number
    }
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await centerAdminApi.generateExpansionAnalysis(data)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    generateCustomerRetentionAnalysis,
    generateBranchPerformanceAnalysis,
    generateRevenueForecast,
    generateExpansionAnalysis
  }
}
