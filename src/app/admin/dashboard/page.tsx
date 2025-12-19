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

export default function AdminDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Total Orders',
      value: '1,247',
      icon: ShoppingBag,
      change: '+12% from last month',
      changeType: 'positive',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Active Customers',
      value: '892',
      icon: Users,
      change: '+8% from last month',
      changeType: 'positive',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Revenue',
      value: '₹2,45,680',
      icon: DollarSign,
      change: '+15% from last month',
      changeType: 'positive',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Pending Orders',
      value: '23',
      icon: Clock,
      change: 'Needs attention',
      changeType: 'warning',
      color: 'from-orange-500 to-red-600',
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-1247',
      customer: 'John Doe',
      items: 8,
      status: 'pending',
      statusText: 'Pending Assignment',
      amount: 680,
      date: '2024-01-19',
      priority: 'high',
    },
    {
      id: 'ORD-1246',
      customer: 'Sarah Wilson',
      items: 5,
      status: 'in_progress',
      statusText: 'In Progress',
      amount: 450,
      date: '2024-01-19',
      priority: 'normal',
    },
    {
      id: 'ORD-1245',
      customer: 'Mike Johnson',
      items: 12,
      status: 'ready',
      statusText: 'Ready for Delivery',
      amount: 890,
      date: '2024-01-18',
      priority: 'normal',
    },
    {
      id: 'ORD-1244',
      customer: 'Emily Davis',
      items: 3,
      status: 'delivered',
      statusText: 'Delivered',
      amount: 320,
      date: '2024-01-18',
      priority: 'low',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'ready': return 'text-purple-600 bg-purple-50'
      case 'delivered': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'normal': return 'border-l-blue-500'
      case 'low': return 'border-l-gray-300'
      default: return 'border-l-gray-300'
    }
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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getPriorityColor(order.priority)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.customer} • {order.items} items</div>
                    <div className="text-xs text-gray-400">{order.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-2`}>
                    {order.statusText}
                  </div>
                  <div className="text-sm font-medium text-gray-800">₹{order.amount}</div>
                </div>
              </div>
            ))}
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
              <div className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-orange-800">23 Pending Orders</div>
                  <div className="text-xs text-orange-600">Need branch assignment</div>
                </div>
              </div>

              <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-blue-800">5 Express Orders</div>
                  <div className="text-xs text-blue-600">Due for delivery today</div>
                </div>
              </div>

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
              <h3 className="text-lg font-bold">This Month</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-100">Orders Processed</span>
                <span className="font-bold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Revenue Generated</span>
                <span className="font-bold">₹2,45,680</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Customer Satisfaction</span>
                <span className="font-bold">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}