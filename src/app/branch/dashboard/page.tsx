'use client'

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
  Truck,
  ArrowRight,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BranchDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Orders Today',
      value: '44',
      icon: ShoppingBag,
      change: '+8 from yesterday',
      changeType: 'positive',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'In Progress',
      value: '18',
      icon: Clock,
      change: 'Active processing',
      changeType: 'neutral',
      color: 'from-orange-500 to-yellow-600',
    },
    {
      name: 'Completed Today',
      value: '26',
      icon: CheckCircle,
      change: '+12 from yesterday',
      changeType: 'positive',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Staff Available',
      value: '15/18',
      icon: Users,
      change: '3 on leave',
      changeType: 'warning',
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-1247',
      customer: 'John Doe',
      items: 8,
      service: 'Dry Cleaning',
      status: 'processing',
      statusText: 'In Washing',
      assignedTo: 'Raj Kumar',
      priority: 'high',
      estimatedCompletion: '2 hours',
    },
    {
      id: 'ORD-1246',
      customer: 'Sarah Wilson',
      items: 5,
      service: 'Wash & Fold',
      status: 'ready',
      statusText: 'Ready for Pickup',
      assignedTo: 'Priya Sharma',
      priority: 'normal',
      estimatedCompletion: 'Ready',
    },
    {
      id: 'ORD-1245',
      customer: 'Mike Johnson',
      items: 12,
      service: 'Iron & Press',
      status: 'processing',
      statusText: 'Ironing',
      assignedTo: 'Amit Singh',
      priority: 'normal',
      estimatedCompletion: '1 hour',
    },
  ]

  const staffPerformance = [
    { name: 'Raj Kumar', role: 'Washer', ordersToday: 12, efficiency: 95 },
    { name: 'Priya Sharma', role: 'Ironer', ordersToday: 8, efficiency: 92 },
    { name: 'Amit Singh', role: 'Washer', ordersToday: 10, efficiency: 88 },
    { name: 'Sunita Devi', role: 'Quality Check', ordersToday: 15, efficiency: 98 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-600 bg-blue-50'
      case 'ready': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-orange-600 bg-orange-50'
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
    <div className="space-y-4 lg:space-y-6 mt-16 w-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl p-4 lg:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-3xl font-bold mb-2 truncate">Welcome, {user?.name}! 👋</h1>
            <p className="text-green-100 text-sm lg:text-base">Koramangala Branch - Today's Operations Overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3 flex-shrink-0">
            <Link href="/branch/orders">
              <Button className="bg-white text-green-600 hover:bg-gray-100 text-sm lg:text-base">
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className={`w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <div className="text-lg lg:text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-xs lg:text-sm text-gray-600 mb-1 lg:mb-2">{stat.name}</div>
            <div className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Active Orders */}
        <div className="xl:col-span-2 bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Active Orders</h2>
            <Link href="/branch/orders" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 lg:space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getPriorityColor(order.priority)}`}
              >
                <div className="flex items-center space-x-3 lg:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800 text-sm lg:text-base">{order.id}</div>
                    <div className="text-xs lg:text-sm text-gray-500 truncate">{order.customer} • {order.items} items</div>
                    <div className="text-xs text-gray-400 truncate">Assigned to: {order.assignedTo}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-1 lg:mb-2`}>
                    {order.statusText}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">{order.estimatedCompletion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance & Quick Actions */}
        <div className="space-y-4 lg:space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Quick Actions</h2>
            <div className="space-y-2 lg:space-y-3">
              <Link
                href="/branch/orders"
                className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">Process Orders</div>
                  <div className="text-xs text-gray-500">Assign & track orders</div>
                </div>
              </Link>

              <Link
                href="/branch/staff"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">Manage Staff</div>
                  <div className="text-xs text-gray-500">Assign tasks & monitor</div>
                </div>
              </Link>

              <Link
                href="/branch/inventory"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Package2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm lg:text-base">Check Inventory</div>
                  <div className="text-xs text-gray-500">Stock levels & supplies</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Staff Performance</h2>
            <div className="space-y-2 lg:space-y-3">
              {staffPerformance.map((staff) => (
                <div key={staff.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs lg:text-sm font-medium text-gray-800 truncate">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs lg:text-sm font-medium text-gray-800">{staff.ordersToday} orders</div>
                    <div className="text-xs text-green-600">{staff.efficiency}% efficiency</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Alerts</h2>
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm font-medium text-orange-800">Low Detergent Stock</div>
                  <div className="text-xs text-orange-600">Only 2 days supply left</div>
                </div>
              </div>

              <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm font-medium text-blue-800">3 Express Orders</div>
                  <div className="text-xs text-blue-600">Due for completion in 2 hours</div>
                </div>
              </div>

              <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm font-medium text-green-800">All Equipment Operational</div>
                  <div className="text-xs text-green-600">No maintenance required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}