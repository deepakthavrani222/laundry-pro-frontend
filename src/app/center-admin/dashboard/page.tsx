'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCenterAdminDashboard } from '@/hooks/useCenterAdminDashboard'
import { useCenterAdminStore } from '@/store/centerAdminStore'
import StatsCards from '@/components/dashboard/StatsCards'
import RevenueChart from '@/components/dashboard/RevenueChart'
import RecentOrders from '@/components/dashboard/RecentOrders'
import SystemAlerts from '@/components/dashboard/SystemAlerts'
import TopBranches from '@/components/dashboard/TopBranches'
import { 
  RefreshCw, 
  Calendar, 
  Download, 
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function CenterAdminDashboard() {
  const { admin } = useCenterAdminStore()
  const {
    dashboardData,
    loading,
    error,
    fetchDashboardOverview,
    autoRefresh,
    setAutoRefresh,
    isDataStale,
    refreshData,
    clearError
  } = useCenterAdminDashboard()

  const [timeframe, setTimeframe] = useState('30d')
  const [showFilters, setShowFilters] = useState(false)

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
    fetchDashboardOverview(newTimeframe)
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardOverview(timeframe)
  }

  // Handle export (placeholder)
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export dashboard data')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError()
              handleRefresh()
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your laundry business today.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Data Freshness Indicator */}
          {dashboardData && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isDataStale ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <span>
                Last updated: {new Date(dashboardData.generatedAt).toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>

          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => handleTimeframeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardData && (
        <StatsCards 
          data={dashboardData.overview} 
          loading={loading}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          {dashboardData && (
            <RevenueChart 
              data={dashboardData.revenue} 
              loading={loading}
            />
          )}
        </div>

        {/* System Alerts */}
        <div>
          {dashboardData && (
            <SystemAlerts 
              alerts={dashboardData.alerts} 
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          {dashboardData && (
            <RecentOrders 
              orders={dashboardData.recentOrders} 
              loading={loading}
            />
          )}
        </div>

        {/* Top Branches */}
        <div>
          {dashboardData && (
            <TopBranches 
              branches={dashboardData.topBranches} 
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/center-admin/analytics" className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Analytics
          </Link>
          <Link href="/center-admin/financial" className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
            <Calendar className="w-5 h-5 mr-2" />
            Financial Reports
          </Link>
          <Link href="/center-admin/orders" className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
            <CheckCircle className="w-5 h-5 mr-2" />
            Review Orders
          </Link>
          <Link href="/center-admin/audit" className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Security & Audit
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              System Status: All Good! ✅
            </h4>
            <p className="text-gray-600">
              All services are running smoothly. Last system check: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              99.9%
            </div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}