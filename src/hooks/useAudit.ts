'use client'

import { useState, useEffect } from 'react'
import { centerAdminApi } from '@/lib/centerAdminApi'

export interface AuditLog {
  _id: string
  action: string
  category: string
  description: string
  userEmail: string
  userType: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failure' | 'warning'
  timestamp: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  metadata?: Record<string, any>
}

export interface AuditStats {
  overview: {
    totalLogs: number
    timeframe: string
    startDate: string
    endDate: string
  }
  breakdown: {
    byCategory: Array<{ _id: string; count: number }>
    byRiskLevel: Array<{ _id: string; count: number }>
    byStatus: Array<{ _id: string; count: number }>
  }
  activity: {
    timeline: Array<{
      _id: { year: number; month: number; day: number }
      total: number
      success: number
      failure: number
      high_risk: number
    }>
    recentHighRisk: AuditLog[]
    topUsers: Array<{ _id: string; count: number }>
    topActions: Array<{ _id: string; count: number }>
  }
}

export interface ActivitySummary {
  last24h: number
  last7d: number
  criticalAlerts: number
  failedLogins: number
  systemErrors: number
  alerts: {
    highFailedLogins: boolean
    criticalIssues: boolean
    systemIssues: boolean
  }
}

export function useAudit(filters?: {
  page?: number
  limit?: number
  category?: string
  action?: string
  userEmail?: string
  riskLevel?: string
  status?: string
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: string
  sortOrder?: string
}, timeframe: string = '30d') {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 50
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.getAuditLogs(filters)
      setLogs(response.data.logs)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await centerAdminApi.getAuditStats(timeframe)
      setStats(response.data)
    } catch (err) {
      console.error('Failed to fetch audit stats:', err)
    }
  }

  const fetchActivitySummary = async () => {
    try {
      const response = await centerAdminApi.getActivitySummary()
      setActivitySummary(response.data.summary)
    } catch (err) {
      console.error('Failed to fetch activity summary:', err)
    }
  }

  const exportLogs = async (format: 'json' | 'csv', exportFilters?: any) => {
    try {
      const response = await centerAdminApi.exportAuditLogs({
        format,
        ...exportFilters
      })
      
      // Create download link
      const blob = new Blob([format === 'csv' ? response : JSON.stringify(response, null, 2)], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-logs-${Date.now()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export audit logs'
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [JSON.stringify(filters)])

  useEffect(() => {
    fetchStats()
    fetchActivitySummary()
  }, [timeframe])

  return {
    logs,
    stats,
    activitySummary,
    pagination,
    loading,
    error,
    exportLogs,
    refetch: () => {
      fetchLogs()
      fetchStats()
      fetchActivitySummary()
    }
  }
}

export function useAuditLog(logId: string) {
  const [log, setLog] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLog = async () => {
    if (!logId) return

    try {
      setLoading(true)
      setError(null)
      const response = await centerAdminApi.getAuditLog(logId)
      setLog(response.data.log)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLog()
  }, [logId])

  return {
    log,
    loading,
    error,
    refetch: fetchLog
  }
}