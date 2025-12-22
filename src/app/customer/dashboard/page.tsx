'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  Plus,
  MapPin,
  Calendar,
  ArrowRight,
  Package,
  Loader2,
  Sparkles,
  User,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useOrders } from '@/hooks/useOrders'

export default function CustomerDashboard() {
  const { user } = useAuthStore()
  const { orders, loading, fetchOrders } = useOrders()
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const active = orders.filter(o => 
        ['placed', 'picked', 'in_process', 'ready', 'out_for_delivery'].includes(o.status)
      ).length
      const completed = orders.filter(o => o.status === 'delivered').length
      const pending = orders.filter(o => o.status === 'placed').length
      
      setStats({
        total: orders.length,
        active,
        completed,
        pending
      })
    }
  }, [orders])

  const recentOrders = orders.slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      case 'placed': return 'bg-amber-100 text-amber-700 border border-amber-200'
      case 'picked': case 'in_process': return 'bg-blue-100 text-blue-700 border border-blue-200'
      case 'ready': case 'out_for_delivery': return 'bg-purple-100 text-purple-700 border border-purple-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200'
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 rounded-2xl p-8 mb-8 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-teal-100 mt-1">Here's what's happening with your laundry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/customer/orders/new">
            <div className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">Schedule Pickup</h3>
                  <p className="text-teal-100 text-sm">Book a new laundry service</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/customer/orders">
            <div className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Track Orders</h3>
                  <p className="text-gray-500 text-sm">View all your orders</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold">{stats.total}</p>
              <p className="text-sm text-white/80 font-medium mt-1">Total Orders</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold">{stats.active}</p>
              <p className="text-sm text-white/80 font-medium mt-1">Active Orders</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold">{stats.completed}</p>
              <p className="text-sm text-white/80 font-medium mt-1">Completed</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold">{stats.pending}</p>
              <p className="text-sm text-white/80 font-medium mt-1">Pending Pickup</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            </div>
            <Link href="/customer/orders" className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors">
              View All 
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                <p className="text-gray-500">Loading orders...</p>
              </div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start your laundry journey with us! Schedule your first pickup today.</p>
              <Link href="/customer/orders/new">
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30 px-8 py-3 text-base">
                  <Plus className="w-5 h-5 mr-2" />
                  Book Your First Order
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link key={order._id} href={`/customer/orders/${order._id}`}>
                  <div className="group p-6 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 cursor-pointer transition-all duration-200">
                    <div className="flex items-center justify-between gap-4">
                      {/* Order Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="w-6 h-6 text-teal-600" />
                      </div>
                      
                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-800 text-base">#{order.orderNumber}</span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-gray-400" />
                            {order.items?.length || 0} items
                          </span>
                        </div>
                      </div>
                      
                      {/* Price & Arrow */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-xl">₹{order.totalAmount}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Link href="/customer/addresses">
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-semibold text-gray-700">Addresses</p>
              <p className="text-xs text-gray-500 mt-1">Manage locations</p>
            </div>
          </Link>
          <Link href="/customer/profile">
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-semibold text-gray-700">Profile</p>
              <p className="text-xs text-gray-500 mt-1">Account settings</p>
            </div>
          </Link>
          <Link href="/pricing">
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-semibold text-gray-700">Pricing</p>
              <p className="text-xs text-gray-500 mt-1">View rates</p>
            </div>
          </Link>
          <Link href="/help">
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-semibold text-gray-700">Help</p>
              <p className="text-xs text-gray-500 mt-1">Get support</p>
            </div>
          </Link>
        </div>
    </div>
  )
}
