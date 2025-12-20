'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { 
  ShoppingBag, 
  Users, 
  Package2,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Package,
  ArrowRight,
  RefreshCw,
  Loader2,
  IndianRupee,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { branchApi } from '@/lib/branchApi'
import toast from 'react-hot-toast'

interface DashboardData {
  branch: { _id: string; name: string; code: string }
  metrics: {
    todayOrders: number
    pendingOrders: number
    processingOrders: number
    readyOrders: number
    completedToday: number
    weeklyOrders: number
    todayRevenue: number
    staffCount: number
    activeStaff: number
  }
  recentOrders: Array<{
    _id: string
    orderNumber: string
    status: string
    amount: number
    itemCount: number
    isExpress: boolean
    createdAt: string
    customer: { name: string; phone: string }
  }>
  staffPerformance: Array<{ name: string; role: string; ordersProcessed: number }>
  alerts: Array<{ type: string; title: string; message: string }>
}

export default function BranchDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchApi.getDashboard()
      if (response.success) {
        setData(response.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard')
      toast.error(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_process': return 'text-blue-600 bg-blue-50'
      case 'ready': return 'text-green-600 bg-green-50'
      case 'assigned_to_branch': case 'picked': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'assigned_to_branch': 'Pending',
      'picked': 'Picked Up',
      'in_process': 'Processing',
      'ready': 'Ready',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mt-16 p-6 bg-red-50 rounded-xl text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800">{error || 'Failed to load dashboard'}</h3>
        <Button onClick={fetchDashboard} className="mt-4">Try Again</Button>
      </div>
    )
  }

  const stats = [
    { name: 'Orders Today', value: data.metrics.todayOrders, icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { name: 'In Progress', value: data.metrics.processingOrders, icon: Clock, color: 'from-orange-500 to-yellow-600' },
    { name: 'Completed Today', value: data.metrics.completedToday, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { name: 'Staff Available', value: `${data.metrics.activeStaff}/${data.metrics.staffCount}`, icon: Users, color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <div className="space-y-4 lg:space-y-6 mt-16 w-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl p-4 lg:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-3xl font-bold mb-2 truncate">Welcome, {user?.name}! 👋</h1>
            <p className="text-green-100 text-sm lg:text-base">{data.branch.name} ({data.branch.code}) - Today's Operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3 flex-shrink-0">
            <Button variant="outline" onClick={fetchDashboard} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
            <Link href="/branch/orders">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />View Orders
              </Button>
            </Link>
          </div>
        </div>
        {/* Revenue Card */}
        <div className="mt-4 bg-white/10 rounded-lg p-4 inline-block">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm">Today's Revenue:</span>
            <span className="text-xl font-bold">₹{data.metrics.todayRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className={`w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <div className="text-lg lg:text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-xs lg:text-sm text-gray-600">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Pending & Ready Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-700">{data.metrics.pendingOrders}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Ready for Pickup</p>
              <p className="text-3xl font-bold text-green-700">{data.metrics.readyOrders}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Active Orders */}
        <div className="xl:col-span-2 bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link href="/branch/orders" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              View All<ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 lg:space-y-4">
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${order.isExpress ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                  <div className="flex items-center space-x-3 lg:space-x-4 mb-2 sm:mb-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 text-sm lg:text-base">{order.orderNumber}</span>
                        {order.isExpress && <Zap className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 truncate">{order.customer?.name} • {order.itemCount} items</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-1`}>
                      {getStatusText(order.status)}
                    </div>
                    <div className="text-sm font-medium text-gray-800">₹{order.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Quick Actions</h2>
            <div className="space-y-2 lg:space-y-3">
              <Link href="/branch/orders" className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">Process Orders</div>
                  <div className="text-xs text-gray-500">Assign & track orders</div>
                </div>
              </Link>
              <Link href="/branch/staff" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">Manage Staff</div>
                  <div className="text-xs text-gray-500">Assign tasks & monitor</div>
                </div>
              </Link>
              <Link href="/branch/performance" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">View Analytics</div>
                  <div className="text-xs text-gray-500">Performance metrics</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Staff Performance */}
          {data.staffPerformance.length > 0 && (
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Top Staff Today</h2>
              <div className="space-y-2 lg:space-y-3">
                {data.staffPerformance.map((staff, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs lg:text-sm font-medium text-gray-800 truncate">{staff.name || 'Staff'}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs lg:text-sm font-medium text-gray-800">{staff.ordersProcessed} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {data.alerts.length > 0 && (
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Alerts</h2>
              <div className="space-y-2 lg:space-y-3">
                {data.alerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-start p-3 rounded-lg border ${alert.type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                    <AlertTriangle className={`w-4 h-4 lg:w-5 lg:h-5 mt-0.5 mr-3 flex-shrink-0 ${alert.type === 'warning' ? 'text-orange-600' : 'text-red-600'}`} />
                    <div className="min-w-0">
                      <div className={`text-xs lg:text-sm font-medium ${alert.type === 'warning' ? 'text-orange-800' : 'text-red-800'}`}>{alert.title}</div>
                      <div className={`text-xs ${alert.type === 'warning' ? 'text-orange-600' : 'text-red-600'}`}>{alert.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
