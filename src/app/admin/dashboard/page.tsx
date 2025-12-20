'use client'

import { useAuthStore } from '@/store/authStore'
import { 
  ShoppingBag, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Truck,
  Building2,
  ArrowRight,
  Eye,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAdminDashboard } from '@/hooks/useAdmin'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const { metrics, recentOrders, loading, error } = useAdminDashboard()

  if (loading) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 mt-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">Error loading dashboard: {error}</span>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Orders',
      value: metrics?.totalOrders?.toLocaleString() || '0',
      icon: ShoppingBag,
      change: `${metrics?.todayOrders || 0} today`,
      changeType: 'positive',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Active Customers',
      value: metrics?.activeCustomers?.toLocaleString() || '0',
      icon: Users,
      change: `${metrics?.totalCustomers || 0} total`,
      changeType: 'positive',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Pending Orders',
      value: metrics?.pendingOrders?.toLocaleString() || '0',
      icon: Clock,
      change: 'Need assignment',
      changeType: metrics?.pendingOrders && metrics.pendingOrders > 0 ? 'warning' : 'positive',
      color: 'from-orange-500 to-red-600',
    },
    {
      name: 'Express Orders',
      value: metrics?.expressOrders?.toLocaleString() || '0',
      icon: TrendingUp,
      change: 'Priority delivery',
      changeType: 'warning',
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
      case 'pending': return 'text-orange-600 bg-orange-50'
      case 'assigned_to_branch':
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'ready': return 'text-purple-600 bg-purple-50'
      case 'delivered': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'placed': return 'Pending Assignment'
      case 'assigned_to_branch': return 'Assigned to Branch'
      case 'assigned_to_logistics_pickup': return 'Pickup Assigned'
      case 'picked': return 'Picked Up'
      case 'in_process': return 'In Progress'
      case 'ready': return 'Ready for Delivery'
      case 'assigned_to_logistics_delivery': return 'Delivery Assigned'
      case 'out_for_delivery': return 'Out for Delivery'
      case 'delivered': return 'Delivered'
      default: return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const getPriorityColor = (order: any) => {
    if (order.isExpress) return 'border-l-red-500'
    if (order.customer?.isVIP) return 'border-l-yellow-500'
    return 'border-l-blue-500'
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-blue-100">Here's what's happening with your laundry business today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/admin/orders">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingBag className="w-5 h-5 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.name}</div>
            <div className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-500'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? recentOrders.map((order) => (
              <div
                key={order._id}
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getPriorityColor(order)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {order.orderNumber}
                      {order.isExpress && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Express</span>
                      )}
                      {order.customer?.isVIP && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">VIP</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{order.customer?.name} • {order.items?.length || 0} items</div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-2`}>
                    {getStatusText(order.status)}
                  </div>
                  <div className="text-sm font-medium text-gray-800">₹{order.pricing?.total?.toLocaleString()}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/orders"
                className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Manage Orders</div>
                  <div className="text-xs text-gray-500">Assign & track orders</div>
                </div>
              </Link>

              <Link
                href="/admin/customers"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Customer Management</div>
                  <div className="text-xs text-gray-500">View & manage customers</div>
                </div>
              </Link>

              <Link
                href="/admin/branches"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Branch Operations</div>
                  <div className="text-xs text-gray-500">Monitor branches</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              {metrics?.pendingOrders && metrics.pendingOrders > 0 && (
                <div className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">{metrics.pendingOrders} Pending Orders</div>
                    <div className="text-xs text-orange-600">Need branch assignment</div>
                  </div>
                </div>
              )}

              {metrics?.expressOrders && metrics.expressOrders > 0 && (
                <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">{metrics.expressOrders} Express Orders</div>
                    <div className="text-xs text-blue-600">Priority handling required</div>
                  </div>
                </div>
              )}

              {metrics?.pendingComplaints && metrics.pendingComplaints > 0 && (
                <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-red-800">{metrics.pendingComplaints} Pending Complaints</div>
                    <div className="text-xs text-red-600">Need immediate attention</div>
                  </div>
                </div>
              )}

              <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-green-800">System Status: Good</div>
                  <div className="text-xs text-green-600">All services operational</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">System Overview</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-100">Total Orders</span>
                <span className="font-bold">{metrics?.totalOrders?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Active Customers</span>
                <span className="font-bold">{metrics?.activeCustomers?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Active Branches</span>
                <span className="font-bold">{metrics?.totalBranches?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}