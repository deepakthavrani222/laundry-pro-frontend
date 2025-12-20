'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp,
  RefreshCw,
  Loader2,
  Package,
  IndianRupee,
  Users,
  Clock,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { branchApi } from '@/lib/branchApi'
import toast from 'react-hot-toast'

interface AnalyticsData {
  branch: { name: string; code: string }
  timeframe: string
  totals: {
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
  }
  dailyStats: Array<{
    _id: { year: number; month: number; day: number }
    orders: number
    revenue: number
  }>
  serviceStats: Array<{
    _id: string
    count: number
    revenue: number
  }>
  statusDistribution: Array<{
    _id: string
    count: number
  }>
  staffPerformance: Array<{
    name: string
    ordersProcessed: number
    revenue: number
  }>
}

export default function BranchPerformancePage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await branchApi.getAnalytics(timeframe)
      if (response.success) {
        setData(response.data)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'placed': 'Placed',
      'assigned_to_branch': 'Pending',
      'picked': 'Picked Up',
      'in_process': 'Processing',
      'ready': 'Ready',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'placed': 'bg-gray-500',
      'assigned_to_branch': 'bg-orange-500',
      'picked': 'bg-yellow-500',
      'in_process': 'bg-blue-500',
      'ready': 'bg-green-500',
      'out_for_delivery': 'bg-purple-500',
      'delivered': 'bg-emerald-500',
      'cancelled': 'bg-red-500'
    }
    return colorMap[status] || 'bg-gray-500'
  }

  const handleExport = () => {
    if (!data) return
    
    const csvContent = [
      ['Branch Performance Report'],
      [`Branch: ${data.branch.name} (${data.branch.code})`],
      [`Timeframe: ${timeframe}`],
      [''],
      ['Summary'],
      ['Total Orders', data.totals.totalOrders],
      ['Total Revenue', `₹${data.totals.totalRevenue}`],
      ['Avg Order Value', `₹${Math.round(data.totals.avgOrderValue)}`],
      [''],
      ['Daily Stats'],
      ['Date', 'Orders', 'Revenue'],
      ...data.dailyStats.map(d => [
        `${d._id.day}/${d._id.month}/${d._id.year}`,
        d.orders,
        `₹${d.revenue}`
      ]),
      [''],
      ['Service Breakdown'],
      ['Service', 'Count', 'Revenue'],
      ...data.serviceStats.map(s => [s._id || 'Unknown', s.count, `₹${s.revenue}`]),
      [''],
      ['Staff Performance'],
      ['Name', 'Orders', 'Revenue'],
      ...data.staffPerformance.map(s => [s.name, s.ordersProcessed, `₹${s.revenue}`])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `branch-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Analytics exported successfully')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mt-16 p-6 bg-red-50 rounded-xl text-center">
        <p className="text-red-600">Failed to load analytics</p>
        <Button onClick={fetchAnalytics} className="mt-4">Try Again</Button>
      </div>
    )
  }

  const maxDailyOrders = Math.max(...data.dailyStats.map(d => d.orders), 1)
  const maxServiceCount = Math.max(...data.serviceStats.map(s => s.count), 1)

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-gray-600">{data.branch.name} ({data.branch.code})</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{data.totals.totalOrders}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">₹{data.totals.totalRevenue.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Order Value</p>
              <p className="text-3xl font-bold">₹{Math.round(data.totals.avgOrderValue).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Daily Orders
          </h2>
          {data.dailyStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {data.dailyStats.slice(-7).map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">
                    {day._id.day}/{day._id.month}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(day.orders / maxDailyOrders) * 100}%`, minWidth: '40px' }}
                    >
                      <span className="text-xs text-white font-medium">{day.orders}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-24 text-right">
                    ₹{day.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
            Service Breakdown
          </h2>
          {data.serviceStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {data.serviceStats.map((service, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28 truncate capitalize">
                    {service._id?.replace(/_/g, ' ') || 'Unknown'}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(service.count / maxServiceCount) * 100}%`, minWidth: '40px' }}
                    >
                      <span className="text-xs text-white font-medium">{service.count}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-24 text-right">
                    ₹{service.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Distribution & Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Order Status Distribution
          </h2>
          {data.statusDistribution.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No data available
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {data.statusDistribution.map((status, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status._id)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{getStatusText(status._id)}</p>
                    <p className="text-lg font-bold text-gray-700">{status.count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Staff Performance
          </h2>
          {data.staffPerformance.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No staff data available
            </div>
          ) : (
            <div className="space-y-3">
              {data.staffPerformance.slice(0, 5).map((staff, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-400'} text-white font-bold text-sm`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.ordersProcessed} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{staff.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Most Popular Service</p>
            <p className="text-lg font-bold text-gray-800 capitalize">
              {data.serviceStats[0]?._id?.replace(/_/g, ' ') || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Top Performer</p>
            <p className="text-lg font-bold text-gray-800">
              {data.staffPerformance[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-lg font-bold text-green-600">
              {data.totals.totalOrders > 0 
                ? Math.round((data.statusDistribution.find(s => s._id === 'delivered')?.count || 0) / data.totals.totalOrders * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
