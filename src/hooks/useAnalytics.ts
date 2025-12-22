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
