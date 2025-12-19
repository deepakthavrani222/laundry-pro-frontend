'use client'

import { useAuthStore } from '@/store/authStore'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Package,
  Truck,
  Star,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CustomerDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Total Orders',
      value: '12',
      icon: ShoppingBag,
      change: '+2 this month',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'In Progress',
      value: '3',
      icon: Clock,
      change: 'Active orders',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      name: 'Completed',
      value: '9',
      icon: CheckCircle,
      change: 'All time',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Total Spent',
      value: '₹4,250',
      icon: TrendingUp,
      change: '+₹850 this month',
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      items: 5,
      status: 'In Progress',
      date: '2024-01-15',
      amount: 450,
      statusColor: 'text-yellow-600 bg-yellow-50',
    },
    {
      id: 'ORD-002',
      items: 8,
      status: 'Delivered',
      date: '2024-01-10',
      amount: 680,
      statusColor: 'text-green-600 bg-green-50',
    },
    {
      id: 'ORD-003',
      items: 3,
      status: 'Picked Up',
      date: '2024-01-08',
      amount: 320,
      statusColor: 'text-blue-600 bg-blue-50',
    },
  ]

  return (
    <div className="space-y-6 mt-16">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-teal-100">Ready to schedule your next laundry pickup?</p>
          </div>
          <Link href="/customer/orders/new">
            <Button className="mt-4 md:mt-0 bg-white text-teal-600 hover:bg-gray-100">
              <Plus className="w-5 h-5 mr-2" />
              New Order
            </Button>
          </Link>
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
            <div className="text-xs text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link href="/customer/orders" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.items} items • {order.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.statusColor} mb-2`}>
                    {order.status}
                  </div>
                  <div className="text-sm font-medium text-gray-800">₹{order.amount}</div>
                </div>
              </div>
            ))}
          </div>

          {recentOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first order</p>
              <Link href="/customer/orders/new">
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/customer/orders/new"
                className="flex items-center p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg hover:from-teal-100 hover:to-cyan-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">New Order</div>
                  <div className="text-xs text-gray-500">Schedule pickup</div>
                </div>
              </Link>

              <Link
                href="/customer/orders"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Track Order</div>
                  <div className="text-xs text-gray-500">View status</div>
                </div>
              </Link>

              <Link
                href="/customer/addresses"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Manage Addresses</div>
                  <div className="text-xs text-gray-500">Add or edit</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Loyalty Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Loyalty Points</h3>
              <Star className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">250 Points</div>
            <p className="text-purple-100 text-sm mb-4">50 more points to unlock ₹100 discount!</p>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '83%' }}></div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Special Offer! 🎉</h3>
            <p className="text-sm text-orange-100 mb-4">Get 20% off on your next order above ₹500</p>
            <Button className="bg-white text-orange-600 hover:bg-gray-100 w-full">
              Use Code: SAVE20
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}