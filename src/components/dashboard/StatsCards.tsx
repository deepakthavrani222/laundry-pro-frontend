'use client'

import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Building2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface StatsData {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  activeBranches: number
  averageOrderValue: number
  periodStats: {
    orders: number
    revenue: number
    customers: number
  }
  growth: {
    orders: number
    revenue: number
    customers: number
  }
}

interface StatsCardsProps {
  data: StatsData
  loading?: boolean
}

export default function StatsCards({ data, loading }: StatsCardsProps) {
  const stats = [
    {
      name: 'Total Orders',
      value: data.totalOrders.toLocaleString(),
      change: data.growth.orders,
      changeText: `+${data.periodStats.orders} this period`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Revenue',
      value: `₹${data.totalRevenue.toLocaleString()}`,
      change: data.growth.revenue,
      changeText: `+₹${data.periodStats.revenue.toLocaleString()} this period`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Total Customers',
      value: data.totalCustomers.toLocaleString(),
      change: data.growth.customers,
      changeText: `+${data.periodStats.customers} this period`,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Active Branches',
      value: data.activeBranches.toString(),
      change: 0,
      changeText: 'Operational branches',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return Minus
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const ChangeIcon = getChangeIcon(stat.change)
        const changeColor = getChangeColor(stat.change)
        
        return (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <ChangeIcon className={`w-4 h-4 ${changeColor}`} />
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {stat.name}
            </div>
            
            <div className="flex items-center space-x-1">
              {stat.change !== 0 && (
                <span className={`text-sm font-medium ${changeColor}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                </span>
              )}
              <span className="text-xs text-gray-500">
                {stat.changeText}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}