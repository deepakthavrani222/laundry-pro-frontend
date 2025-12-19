'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Building2,
  Truck,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  DollarSign
} from 'lucide-react'

const orders = [
  {
    id: 'ORD-1247',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      isVIP: true
    },
    items: 8,
    service: 'Dry Cleaning',
    status: 'pending',
    statusText: 'Pending Assignment',
    amount: 680,
    date: '2024-01-19',
    pickupDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    priority: 'high',
    isExpress: false,
    branch: null,
    logistics: null,
    address: 'MG Road, Bangalore'
  },
  {
    id: 'ORD-1246',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '9876543211',
      isVIP: false
    },
    items: 5,
    service: 'Wash & Fold',
    status: 'assigned',
    statusText: 'Assigned to Branch',
    amount: 450,
    date: '2024-01-19',
    pickupDate: '2024-01-20',
    deliveryDate: '2024-01-21',
    priority: 'normal',
    isExpress: true,
    branch: 'Koramangala Branch',
    logistics: null,
    address: 'Koramangala, Bangalore'
  },
  {
    id: 'ORD-1245',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '9876543212',
      isVIP: true
    },
    items: 12,
    service: 'Wash & Fold',
    status: 'in_progress',
    statusText: 'In Progress',
    amount: 890,
    date: '2024-01-18',
    pickupDate: '2024-01-19',
    deliveryDate: '2024-01-21',
    priority: 'normal',
    isExpress: false,
    branch: 'Indiranagar Branch',
    logistics: 'FastDelivery',
    address: 'Indiranagar, Bangalore'
  },
  {
    id: 'ORD-1244',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '9876543213',
      isVIP: false
    },
    items: 3,
    service: 'Iron & Press',
    status: 'delivered',
    statusText: 'Delivered',
    amount: 320,
    date: '2024-01-17',
    pickupDate: '2024-01-18',
    deliveryDate: '2024-01-19',
    priority: 'low',
    isExpress: false,
    branch: 'Whitefield Branch',
    logistics: 'QuickLogistics',
    address: 'Whitefield, Bangalore'
  },
]

const branches = [
  { id: 'BR001', name: 'Koramangala Branch' },
  { id: 'BR002', name: 'Indiranagar Branch' },
  { id: 'BR003', name: 'Whitefield Branch' },
  { id: 'BR004', name: 'MG Road Branch' },
]

const logisticsPartners = [
  { id: 'LP001', name: 'FastDelivery' },
  { id: 'LP002', name: 'QuickLogistics' },
  { id: 'LP003', name: 'SpeedyPickup' },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignType, setAssignType] = useState<'branch' | 'logistics'>('branch')
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<string>('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle
      case 'assigned': return Building2
      case 'in_progress': return Clock
      case 'delivered': return CheckCircle
      default: return Package
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'assigned': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'in_progress': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const handleAssignOrder = (orderId: string, type: 'branch' | 'logistics') => {
    setSelectedOrderForAssign(orderId)
    setAssignType(type)
    setShowAssignModal(true)
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600">Manage and assign orders to branches and logistics partners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
            <Button variant="outline" className="px-4">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Orders ({filteredOrders.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <div key={order.id} className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(order.priority)}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.statusText}
                        </span>
                        {order.isExpress && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Express
                          </span>
                        )}
                        {order.customer.isVIP && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            VIP
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {order.customer.name}
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {order.items} items • {order.service}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.date}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ₹{order.amount}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <div>📍 {order.address}</div>
                        {order.branch && (
                          <div className="mt-1">🏢 {order.branch}</div>
                        )}
                        {order.logistics && (
                          <div className="mt-1">🚚 {order.logistics}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleAssignOrder(order.id, 'branch')}
                        >
                          <Building2 className="w-4 h-4 mr-1" />
                          Assign Branch
                        </Button>
                      </>
                    )}
                    
                    {(order.status === 'assigned' || order.status === 'in_progress') && !order.logistics && (
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleAssignOrder(order.id, 'logistics')}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Assign Logistics
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Assign {assignType === 'branch' ? 'Branch' : 'Logistics Partner'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {assignType === 'branch' ? 'Branch' : 'Logistics Partner'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose...</option>
                  {(assignType === 'branch' ? branches : logisticsPartners).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setShowAssignModal(false)}
                >
                  Assign
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}