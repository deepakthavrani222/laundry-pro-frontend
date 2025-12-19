'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Play,
  Pause,
  Check
} from 'lucide-react'

const orders = [
  {
    id: 'ORD-1247',
    customer: 'John Doe',
    items: 8,
    service: 'Dry Cleaning',
    status: 'processing',
    statusText: 'In Washing',
    amount: 680,
    assignedTo: 'Raj Kumar',
    startTime: '10:30 AM',
    estimatedCompletion: '2 hours',
    priority: 'high',
    specialInstructions: 'Handle with care - silk material'
  },
  {
    id: 'ORD-1246',
    customer: 'Sarah Wilson',
    items: 5,
    service: 'Wash & Fold',
    status: 'ready',
    statusText: 'Ready for Pickup',
    amount: 450,
    assignedTo: 'Priya Sharma',
    startTime: '9:15 AM',
    estimatedCompletion: 'Ready',
    priority: 'normal',
    specialInstructions: null
  },
  {
    id: 'ORD-1245',
    customer: 'Mike Johnson',
    items: 12,
    service: 'Iron & Press',
    status: 'processing',
    statusText: 'Ironing',
    amount: 890,
    assignedTo: 'Amit Singh',
    startTime: '11:00 AM',
    estimatedCompletion: '1 hour',
    priority: 'normal',
    specialInstructions: 'Extra starch on shirts'
  },
  {
    id: 'ORD-1243',
    customer: 'Lisa Chen',
    items: 6,
    service: 'Dry Cleaning',
    status: 'pending',
    statusText: 'Awaiting Assignment',
    amount: 540,
    assignedTo: null,
    startTime: null,
    estimatedCompletion: null,
    priority: 'normal',
    specialInstructions: null
  },
]

const staff = [
  { id: 'ST001', name: 'Raj Kumar', role: 'Washer', available: true },
  { id: 'ST002', name: 'Priya Sharma', role: 'Ironer', available: false },
  { id: 'ST003', name: 'Amit Singh', role: 'Washer', available: true },
  { id: 'ST004', name: 'Sunita Devi', role: 'Quality Check', available: true },
]

export default function BranchOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string>('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'ready': return 'text-green-600 bg-green-50 border-green-200'
      case 'completed': return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const handleAssignStaff = (orderId: string) => {
    setSelectedOrder(orderId)
    setShowAssignModal(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log('Update status:', orderId, newStatus)
    // API call to update order status
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Processing</h1>
          <p className="text-gray-600">Manage and process orders at Koramangala Branch</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">4</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-800">26</p>
            </div>
            <Package className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Active Orders ({filteredOrders.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(order.priority)}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.statusText}
                      </span>
                      {order.priority === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High Priority
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {order.customer}
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {order.items} items • {order.service}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ₹{order.amount}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {order.estimatedCompletion || 'Not started'}
                      </div>
                    </div>
                    
                    {order.assignedTo && (
                      <div className="text-sm text-gray-500 mb-1">
                        👤 Assigned to: {order.assignedTo}
                        {order.startTime && ` • Started: ${order.startTime}`}
                      </div>
                    )}
                    
                    {order.specialInstructions && (
                      <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded mt-2">
                        📝 {order.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  
                  {order.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleAssignStaff(order.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Assign Staff
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(order.id, 'paused')}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Ready
                      </Button>
                    </>
                  )}
                  
                  {order.status === 'ready' && (
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Staff Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Staff Member
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Choose staff member...</option>
                  {staff.filter(s => s.available).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Completion Time
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowAssignModal(false)}
                >
                  Assign & Start
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