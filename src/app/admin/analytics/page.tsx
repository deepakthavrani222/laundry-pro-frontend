'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Star,
  Repeat,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { adminApi } from '@/lib/adminApi'

interface AnalyticsData {
  overview: {
    totalOrders: number
    totalRevenue: number
    totalCustomers: number
    avgOrderValue: number
    orderGrowth: number
    revenueGrowth: number
    customerGrowth: number
    activeBranches: number
  }
  ordersByStatus: { status: string; count: number; revenue: number }[]
  topBranches: { branchName: string; totalOrders: number; totalRevenue: number }[]
  dailyRevenue: { date: string; revenue: number; orders: number }[]
  recentOrders: any[]
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await adminApi.getAnalytics(dateRange)
      
      if (response.success && response.data) {
        const data = response.data
        
        // Transform API response to match our interface
        setAnalytics({
          overview: {
            totalOrders: data.overview?.totalOrders || 0,
            totalRevenue: data.overview?.totalRevenue || 0,
            totalCustomers: data.overview?.totalCustomers || 0,
            avgOrderValue: data.overview?.averageOrderValue || 0,
            orderGrowth: data.overview?.growth?.orders || 0,
            revenueGrowth: data.overview?.growth?.revenue || 0,
            customerGrowth: data.overview?.growth?.customers || 0,
            activeBranches: data.overview?.activeBranches || 0
          },
          ordersByStatus: (data.orderDistribution || []).map((item: any) => ({
            status: formatStatus(item._id),
            count: item.count,
            revenue: item.revenue || 0
          })),
          topBranches: (data.topBranches || []).map((branch: any) => ({
            branchName: branch.branchName || 'Unknown',
            totalOrders: branch.totalOrders || 0,
            totalRevenue: branch.totalRevenue || 0
          })),
          dailyRevenue: (data.revenue?.daily || []).map((day: any) => ({
            date: formatDate(day._id),
            revenue: day.revenue || 0,
            orders: day.orders || 0
          })),
          recentOrders: data.recentOrders || []
        })
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatStatus = (status: string) => {
    if (!status) return 'Unknown'
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDate = (dateObj: any) => {
    if (!dateObj) return ''
    const { year, month, day } = dateObj
    if (year && month && day) {
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    }
    return ''
  }

  if (loading) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-xl"></div>
            <div className="h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 mt-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Analytics</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const GrowthIndicator = ({ value }: { value: number }) => (
    <span className={`flex items-center text-sm ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )

  const maxDailyOrders = Math.max(...analytics.dailyRevenue.map(d => d.orders), 1)
  const totalStatusOrders = analytics.ordersByStatus.reduce((sum, item) => sum + item.count, 0) || 1

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Business performance insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <GrowthIndicator value={analytics.overview.orderGrowth} />
          </div>
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{analytics.overview.totalOrders.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <GrowthIndicator value={analytics.overview.revenueGrowth} />
          </div>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <GrowthIndicator value={analytics.overview.customerGrowth} />
          </div>
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-gray-800">{analytics.overview.totalCustomers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-800">₹{analytics.overview.avgOrderValue.toFixed(0)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Orders & Revenue</h3>
          {analytics.dailyRevenue.length > 0 ? (
            <div className="space-y-3">
              {analytics.dailyRevenue.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-gray-600">{day.date}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${Math.max((day.orders / maxDailyOrders) * 100, 10)}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.orders}</span>
                    </div>
                  </div>
                  <span className="w-20 text-sm text-gray-600 text-right">₹{(day.revenue / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data available for this period</p>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
          {analytics.ordersByStatus.length > 0 ? (
            <div className="space-y-4">
              {analytics.ordersByStatus.map((item, index) => {
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500']
                const percentage = (item.count / totalStatusOrders) * 100
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.status}</span>
                      <span className="font-medium">{item.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No order data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Branches & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Branches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Branches</h3>
          {analytics.topBranches.length > 0 ? (
            <div className="space-y-4">
              {analytics.topBranches.map((branch, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{branch.branchName}</p>
                      <p className="text-sm text-gray-500">{branch.totalOrders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{branch.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No branch data available</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          {analytics.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">#{order.orderId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{order.totalAmount?.toLocaleString() || 0}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6" />
            <span className="text-lg font-semibold">Active Branches</span>
          </div>
          <p className="text-3xl font-bold">{analytics.overview.activeBranches}</p>
          <p className="text-blue-100 text-sm mt-1">currently operational</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-lg font-semibold">Period Orders</span>
          </div>
          <p className="text-3xl font-bold">{analytics.dailyRevenue.reduce((sum, d) => sum + d.orders, 0)}</p>
          <p className="text-green-100 text-sm mt-1">in selected timeframe</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6" />
            <span className="text-lg font-semibold">Period Revenue</span>
          </div>
          <p className="text-3xl font-bold">₹{(analytics.dailyRevenue.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(1)}K</p>
          <p className="text-purple-100 text-sm mt-1">in selected timeframe</p>
        </div>
      </div>
    </div>
  )
}
