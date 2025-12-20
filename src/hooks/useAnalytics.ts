'use client'

import { useState, useEffect } from 'react'
import { centerAdminApi } from '@/lib/centerAdminApi'

export interface AnalyticsOverview {
  analyticsStats: {
    total: number
    byType: Record<string, {
      total: number
      completed: number
      completionRate: number
    }>
    completionRate: number
  }
  customerMetrics: {
    totalCustomers: number
    newCustomers: number
    activeCustomers: number
    retentionRate: number
    growth: number
  }
  revenueMetrics: {
    totalRevenue: number
    totalTransactions: number
    averageOrderValue: number
    growth: number
  }
  orderMetrics: {
    totalOrders: number
    completedOrders: number
    cancelledOrders: number
    completionRate: number
    cancellationRate: number
  }
  branchMetrics: {
    totalBranches: number
    activeBranches: number
    totalBranchRevenue: number
    averageRevenuePerBranch: number
    topPerformingBranches: Array<{
      _id: string
      revenue: number
      orders: number
    }>
  }
}

export interface Analytics {
  _id: string
  analyticsId: string
  type: string
  periodType: string
  startDate: string
  endDate: string
  status: string
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  keyMetrics?: Record<string, number>
  insights?: Array<{
    category: string
    insight: string
    impact: 'low' | 'medium' | 'high'
    actionable: boolean
    recommendedActions: string[]
  }>
  forecasts?: Array<{
    metric: string
    period: string
    predictedValue: number
    confidenceInterval: {
      lower: number
      upper: number
    }
    methodology: string
  }>
  cohortData?: Array<{
    cohortMonth: string
    cohortSize: number
    retentionRates: Array<{
      period: number
      activeUsers: number
      retentionRate: number
    }>
  }>
  branchPerformance?: Array<{
    branchId: string
    branchName: string
    period: string
    totalRevenue: number
    totalOrders: number
    completedOrders: number
    orderCompletionRate: number
    averageOrderValue: number
    revenueRank: number
  }>
  expansionAnalysis?: Array<{
    analysisId: string
    targetLocation: {
      city: string
      area?: string
      pincode?: string
    }
    marketData: {
      populationDensity?: number
      averageIncome?: number
      competitorCount?: number
      marketSaturation?: number
      demandEstimate?: number
    }
    projections: {
      setupCost: number
      monthlyOperatingCost: number
      breakEvenMonths: number
      roi12Months: number
      roi24Months: number
      projectedMonthlyRevenue: Array<{
        month: number
        revenue: number
        orders: number
        customers: number
      }>
    }
    overallRiskScore: number
    recommendation: {
      decision: 'highly_recommended' | 'recommended' | 'conditional' | 'not_recommended'
      confidence: number
      reasoning: string
      conditions: string[]
      timeline: string
    }
  }>
}

export function useAnalyticsOverview(timeframe: string = '30d') {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.getAnalyticsOverview(timeframe)
      setOverview(response.data.overview)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics overview')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [timeframe])

  return {
    overview,
    loading,
    error,
    refetch: fetchOverview
  }
}

export function useAnalytics(params?: {
  page?: number
  limit?: number
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: string
  sortOrder?: string
}) {
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.getAnalytics(params)
      setAnalytics(response.data.analytics)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [JSON.stringify(params)])

  return {
    analytics,
    pagination,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

export function useAnalyticsById(analyticsId: string) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    if (!analyticsId) return

    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.getAnalyticsById(analyticsId)
      setAnalytics(response.data.analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [analyticsId])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

export function useAnalyticsGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCustomerRetentionAnalysis = async (data: {
    startDate: string
    endDate: string
    filters?: any
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.generateCustomerRetentionAnalysis(data)
      return response.data.analytics
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate customer retention analysis'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const generateBranchPerformanceAnalysis = async (data: {
    startDate: string
    endDate: string
    filters?: any
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.generateBranchPerformanceAnalysis(data)
      return response.data.analytics
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate branch performance analysis'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const generateRevenueForecast = async (data: {
    startDate: string
    endDate: string
    forecastHorizon?: number
    methodology?: string
    filters?: any
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.generateRevenueForecast(data)
      return response.data.analytics
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate revenue forecast'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const generateExpansionAnalysis = async (data: {
    targetLocation: {
      city: string
      area?: string
      pincode?: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    marketData: {
      populationDensity?: number
      averageIncome?: number
      competitorCount?: number
      marketSaturation?: number
      demandEstimate?: number
      seasonalityFactor?: number
    }
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.generateExpansionAnalysis(data)
      return response.data.analytics
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate expansion analysis'
      setError(errorMessage)
      throw new Error(errorMessage)
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