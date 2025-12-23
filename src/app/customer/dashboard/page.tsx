'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, Clock, CheckCircle, Truck, Plus, MapPin, Calendar, ArrowRight,
  Package, Loader2, Sparkles, User, HelpCircle,
  Star, Gift, ChevronRight, BarChart3, Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useOrders } from '@/hooks/useOrders'

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return
    
    const incrementTime = duration / end
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, Math.max(incrementTime, 20))
    
    return () => clearInterval(timer)
  }, [value, duration])
  
  return <span>{count}</span>
}

// Donut Chart Component
function DonutChart({ data, size = 160 }: { data: { value: number; color: string; label: string }[]; size?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const total = data.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100)
    return () => clearTimeout(timer)
  }, [])

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm">No order data yet</p>
      </div>
    )
  }

  const strokeWidth = 18
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#bgGradient)" strokeWidth={strokeWidth} />
          {data.map((item, i) => {
            if (item.value === 0) return null
            const percentage = item.value / total
            const animatedPercentage = percentage * animationProgress
            const strokeDasharray = `${animatedPercentage * circumference} ${circumference}`
            const strokeDashoffset = -currentOffset * circumference * animationProgress
            const isHovered = hoveredIndex === i
            currentOffset += percentage
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out cursor-pointer"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${item.color}80)` : 'none',
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hoveredIndex !== null ? (
            <>
              <p className="text-3xl font-bold" style={{ color: data[hoveredIndex].color }}>{data[hoveredIndex].value}</p>
              <p className="text-xs text-gray-500 font-medium">{data[hoveredIndex].label}</p>
              <p className="text-xs text-gray-400">{Math.round((data[hoveredIndex].value / total) * 100)}%</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {data.map((item, i) => item.value > 0 && (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${hoveredIndex === i ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50'}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, transform: hoveredIndex === i ? 'scale(1.3)' : 'scale(1)', boxShadow: hoveredIndex === i ? `0 0 8px ${item.color}80` : 'none' }} />
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Spending Bar Chart
function SpendingChart({ orders }: { orders: any[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100)
    return () => clearTimeout(timer)
  }, [])

  const monthlyData = useMemo(() => {
    const last6Months: { month: string; amount: number; orders: number; fullMonth: string }[] = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' })
      const fullMonth = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
      })
      const totalAmount = monthOrders.reduce((sum, order) => sum + (order.totalAmount || order.pricing?.total || 0), 0)
      last6Months.push({ month: monthName, amount: totalAmount, orders: monthOrders.length, fullMonth })
    }
    return last6Months
  }, [orders])
  
  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 100)
  const totalSpending = monthlyData.reduce((sum, d) => sum + d.amount, 0)
  const totalOrders = monthlyData.reduce((sum, d) => sum + d.orders, 0)
  const avgSpending = totalOrders > 0 ? Math.round(totalSpending / totalOrders) : 0

  const barColors = [
    { from: 'from-teal-400', to: 'to-cyan-400', hover: 'from-teal-500 to-cyan-500', shadow: 'shadow-teal-400/40' },
    { from: 'from-emerald-400', to: 'to-teal-400', hover: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-400/40' },
    { from: 'from-cyan-400', to: 'to-blue-400', hover: 'from-cyan-500 to-blue-500', shadow: 'shadow-cyan-400/40' },
    { from: 'from-blue-400', to: 'to-indigo-400', hover: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-400/40' },
    { from: 'from-indigo-400', to: 'to-purple-400', hover: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-400/40' },
    { from: 'from-purple-400', to: 'to-pink-400', hover: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-400/40' },
  ]
  
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-teal-600">₹{totalSpending.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
        <div className="w-px h-10 bg-teal-200"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-cyan-600">{totalOrders}</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
        <div className="w-px h-10 bg-teal-200"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-emerald-600">₹{avgSpending}</p>
          <p className="text-xs text-gray-500">Avg/Order</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {monthlyData.map((item, i) => {
          const isHovered = hoveredIndex === i
          const barWidth = Math.max((item.amount / maxAmount) * 100, item.amount > 0 ? 8 : 2) * animationProgress
          const color = barColors[i % barColors.length]
          
          return (
            <div 
              key={i} 
              className={`relative group cursor-pointer transition-all duration-300 ${isHovered ? 'scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ 
                animationDelay: `${i * 100}ms`,
                opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1
              }}
            >
              {/* Tooltip */}
              {isHovered && item.amount > 0 && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl text-sm whitespace-nowrap animate-fade-in">
                  <div className="font-semibold">{item.fullMonth}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <span>₹{item.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>{item.orders} order{item.orders !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                    <div className="border-8 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-10 transition-colors duration-300 ${isHovered ? 'text-teal-600' : 'text-gray-800'}`}>
                  {item.month}
                </span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full bg-gradient-to-r ${color.from} ${color.to} rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-3 ${isHovered ? `shadow-lg ${color.shadow}` : ''}`}
                    style={{ 
                      width: `${barWidth}%`,
                      transitionDelay: `${i * 80}ms`
                    }}
                  >
                    {barWidth > 25 && (
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {barWidth <= 25 && (
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold transition-colors duration-300 ${isHovered ? 'text-teal-600' : 'text-gray-800'}`}>
                      ₹{item.amount.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className={`w-8 text-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.orders > 0 ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.orders}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const { user } = useAuthStore()
  const { orders, loading, fetchOrders } = useOrders()
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, pending: 0, cancelled: 0 })
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    fetchOrders()
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const active = orders.filter(o => ['placed', 'picked', 'in_process', 'ready', 'out_for_delivery'].includes(o.status)).length
      const completed = orders.filter(o => o.status === 'delivered').length
      const pending = orders.filter(o => o.status === 'placed').length
      const cancelled = orders.filter(o => o.status === 'cancelled').length
      setStats({ total: orders.length, active, completed, pending, cancelled })
    }
  }, [orders])

  const chartData = useMemo(() => [
    { value: stats.completed, color: '#10b981', label: 'Completed' },
    { value: stats.active, color: '#f59e0b', label: 'Active' },
    { value: stats.cancelled, color: '#ef4444', label: 'Cancelled' },
  ], [stats])

  const totalSpending = useMemo(() => orders.reduce((sum, order) => sum + (order.totalAmount || order.pricing?.total || 0), 0), [orders])
  const recentOrders = orders.slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
      case 'placed': return 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20'
      case 'picked': case 'in_process': return 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20'
      case 'ready': case 'out_for_delivery': return 'bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20'
      default: return 'bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20'
    }
  }

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Simple Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your laundry</p>
        </div>
        <Link href="/customer/orders/new">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30 font-semibold px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
          { label: 'Active', value: stats.active, icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
          { label: 'Pending', value: stats.pending, icon: Truck, gradient: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/25' },
        ].map((stat, i) => (
          <div key={i} className={`group relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 text-white shadow-xl ${stat.shadow} hover:scale-[1.02] transition-all duration-300`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold"><AnimatedCounter value={stat.value} /></p>
              <p className="text-sm text-white/80 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Only for users with orders */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800">Order Status</h3>
                <p className="text-sm text-gray-500">Distribution overview</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            <DonutChart data={chartData} size={150} />
          </div>

          {/* Spending Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-800">Monthly Spending</h3>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <SpendingChart orders={orders} />
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Recent Orders</h2>
              <p className="text-sm text-gray-500">Your latest laundry orders</p>
            </div>
          </div>
          <Link href="/customer/orders" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-teal-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your laundry journey with us! Book your first pickup today.</p>
            <Link href="/customer/orders/new">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30 px-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Book First Order
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link key={order._id} href={`/customer/orders/${order._id}`}>
                <div className="group p-5 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/30 cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Package className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">#{order.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {order.items?.length || 0} items
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">₹{order.totalAmount || order.pricing?.total || 0}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/customer/addresses', icon: MapPin, label: 'Addresses', desc: 'Manage locations', gradient: 'from-teal-500 to-cyan-500', shadow: 'shadow-teal-500/30' },
          { href: '/customer/profile', icon: User, label: 'Profile', desc: 'Account settings', gradient: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-500/30' },
          { href: '/pricing', icon: Star, label: 'Pricing', desc: 'View rates', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30' },
          { href: '/customer/support', icon: HelpCircle, label: 'Support', desc: 'Get help', gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/30' },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg ${item.shadow} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Promo Banner - Only for new users */}
      {orders.length === 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-6 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczIgNCA0IDRjMiAwIDQtMiA0LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Get 20% OFF</h3>
                <p className="text-white/80">On your first order! Use code: FIRST20</p>
              </div>
            </div>
            <Link href="/customer/orders/new">
              <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-lg">
                Claim Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
