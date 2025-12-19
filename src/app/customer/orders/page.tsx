'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Eye,
  RotateCcw,
  Star,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    items: 5,
    service: 'Wash & Fold',
    status: 'in_progress',
    statusText: 'In Progress',
    amount: 450,
    pickupDate: '2024-01-16',
    deliveryDate: '2024-01-18',
    canCancel: true,
    canReorder: false,
    canRate: false,
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    items: 8,
    service: 'Dry Cleaning',
    status: 'delivered',
    statusText: 'Delivered',
    amount: 680,
    pickupDate: '2024-01-11',
    deliveryDate: '2024-01-13',
    canCancel: false,
    canReorder: true,
    canRate: true,
    rating: 0,
  },
  {
    id: 'ORD-003',
    date: '2024-01-08',
    items: 3,
    service: 'Iron & Press',
    status: 'picked_up',
    statusText: 'Picked Up',
    amount: 320,
    pickupDate: '2024-01-09',
    deliveryDate: '2024-01-11',
    canCancel: true,
    canReorder: false,
    canRate: false,
  },
  {
    id: 'ORD-004',
    date: '2024-01-05',
    items: 12,
    service: 'Wash & Fold',
    status: 'delivered',
    statusText: 'Delivered',
    amount: 890,
    pickupDate: '2024-01-06',
    deliveryDate: '2024-01-08',
    canCancel: false,
    canReorder: true,
    canRate: true,
    rating: 5,
  },
]

const statusConfig = {
  placed: { color: 'text-blue-600 bg-blue-50', icon: Package },
  picked_up: { color: 'text-yellow-600 bg-yellow-50', icon: Truck },
  in_progress: { color: 'text-orange-600 bg-orange-50', icon: Clock },
  ready: { color: 'text-purple-600 bg-purple-50', icon: CheckCircle },
  delivered: { color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { color: 'text-red-600 bg-red-50', icon: AlertCircle },
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config ? config.icon : Package
  }

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config ? config.color : 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600">Track and manage your laundry orders</p>
        </div>
        <Link href="/customer/orders/new">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by creating your first order'
              }
            </p>
            <Link href="/customer/orders/new">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Create Order
              </Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.statusText}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.date}
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {order.items} items • {order.service}
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-800">₹{order.amount}</span>
                        </div>
                      </div>
                      {order.status === 'delivered' && order.canRate && order.rating === 0 && (
                        <div className="mt-2 flex items-center text-sm text-orange-600">
                          <Star className="w-4 h-4 mr-1" />
                          Rate this order to help us improve
                        </div>
                      )}
                      {order.rating > 0 && (
                        <div className="mt-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">Your rating</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/customer/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {order.canReorder && (
                      <Button variant="outline" size="sm" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reorder
                      </Button>
                    )}
                    {order.canRate && order.rating === 0 && (
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Star className="w-4 h-4 mr-1" />
                        Rate
                      </Button>
                    )}
                    {order.canCancel && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <span className="px-3 py-2 text-sm text-gray-600">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}