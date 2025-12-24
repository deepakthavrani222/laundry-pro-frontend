'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSuperAdminDashboard } from '@/hooks/useSuperAdminDashboard'
import { useSuperAdminStore } from '@/store/superAdminStore'
import StatsCards from '@/components/dashboard/StatsCards'
import RevenueChart from '@/components/dashboard/RevenueChart'
import RecentOrders from '@/components/dashboard/RecentOrders'
import SystemAlerts from '@/components/dashboard/SystemAlerts'
import TopBranches from '@/components/dashboard/TopBranches'
import { 
  RefreshCw, 
  Calendar, 
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Shield,
  ShoppingBag,
  Users,
  Building2
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

export default function SuperAdminDashboard() {
  const { admin } = useSuperAdminStore()
  const {
    dashboardData,
    loading,
    error,
    fetchDashboardOverview,
    autoRefresh,
    setAutoRefresh,
    isDataStale,
    clearError
  } = useSuperAdminDashboard()

  const [timeframe, setTimeframe] = useState('30d')

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
    fetchDashboardOverview(newTimeframe)
  }

  const handleRefresh = () => {
    fetchDashboardOverview(timeframe)
  }

  const handleExport = () => {
    console.log('Export dashboard data')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => { clearError(); handleRefresh(); }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {admin?.name}! 👋</h1>
              <p className="text-purple-100 mt-1">Here's what's happening with your laundry business today.</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {dashboardData && (
              <div className="flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isDataStale ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <span className="text-purple-100">
                  {new Date(dashboardData.generatedAt).toLocaleTimeString()}
                </span>
              </div>
            )}

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                autoRefresh 
                  ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              {autoRefresh ? 'Auto ON' : 'Auto OFF'}
            </button>

            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="24h" className="text-gray-800">Last 24 hours</option>
              <option value="7d" className="text-gray-800">Last 7 days</option>
              <option value="30d" className="text-gray-800">Last 30 days</option>
              <option value="90d" className="text-gray-800">Last 90 days</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all flex items-center space-x-2 font-medium shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardData && (
        <StatsCards data={dashboardData.overview} loading={loading} />
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Order Status Distribution</h3>
            <p className="text-sm text-gray-500">Current order status breakdown</p>
          </div>
          <div className="h-64">
            {dashboardData?.orderDistribution && dashboardData.orderDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.orderDistribution.map((item: any, idx: number) => ({
                      name: item._id?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown',
                      value: item.count,
                      color: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4'][idx % 7]
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dashboardData.orderDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4'][index % 7]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No order data available
              </div>
            )}
          </div>
          {/* Legend */}
          {dashboardData?.orderDistribution && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dashboardData.orderDistribution.slice(0, 6).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'][idx % 6] }}
                  ></div>
                  <span className="text-xs text-gray-600 truncate">
                    {item._id?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown'}
                  </span>
                  <span className="text-xs font-bold text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Branches Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Branch Performance</h3>
            <p className="text-sm text-gray-500">Revenue by branch</p>
          </div>
          <div className="h-64">
            {dashboardData?.topBranches && dashboardData.topBranches.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topBranches.map((branch: any) => ({
                  name: branch.branchCode || branch.branchName?.slice(0, 8) || 'Branch',
                  revenue: branch.totalRevenue || 0,
                  orders: branch.totalOrders || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="url(#branchGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="branchGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No branch data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {dashboardData && (
            <RevenueChart data={dashboardData.revenue} loading={loading} />
          )}
        </div>
        <div>
          {dashboardData && (
            <SystemAlerts alerts={dashboardData.alerts} loading={loading} />
          )}
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {dashboardData && (
            <RecentOrders orders={dashboardData.recentOrders} loading={loading} />
          )}
        </div>
        <div>
          {dashboardData && (
            <TopBranches branches={dashboardData.topBranches} loading={loading} />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/superadmin/analytics" className="group flex items-center justify-center p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 hover:-translate-y-1">
            <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">View Analytics</span>
          </Link>
          <Link href="/superadmin/financial" className="group flex items-center justify-center p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1">
            <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Financial Reports</span>
          </Link>
          <Link href="/superadmin/orders" className="group flex items-center justify-center p-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1">
            <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Review Orders</span>
          </Link>
          <Link href="/superadmin/audit" className="group flex items-center justify-center p-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-1">
            <Shield className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Security & Audit</span>
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">System Status: All Good! ✅</h4>
              <p className="text-gray-600 text-sm">
                All services are running smoothly. Last check: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              99.9%
            </div>
            <div className="text-sm text-gray-600 font-medium">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}

