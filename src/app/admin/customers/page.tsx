'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Star,
  MoreHorizontal,
  UserCheck,
  UserX,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag
} from 'lucide-react'

const customers = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    isActive: true,
    isVIP: true,
    totalOrders: 24,
    totalSpent: 12450,
    lastOrder: '2024-01-19',
    joinDate: '2023-06-15',
    address: 'MG Road, Bangalore',
    rewardPoints: 450,
    averageRating: 4.8
  },
  {
    id: 'CUST-002',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '9876543211',
    isActive: true,
    isVIP: false,
    totalOrders: 8,
    totalSpent: 3200,
    lastOrder: '2024-01-18',
    joinDate: '2023-11-20',
    address: 'Koramangala, Bangalore',
    rewardPoints: 120,
    averageRating: 4.5
  },
  {
    id: 'CUST-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '9876543212',
    isActive: true,
    isVIP: true,
    totalOrders: 35,
    totalSpent: 18900,
    lastOrder: '2024-01-17',
    joinDate: '2023-03-10',
    address: 'Indiranagar, Bangalore',
    rewardPoints: 680,
    averageRating: 4.9
  },
  {
    id: 'CUST-004',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '9876543213',
    isActive: false,
    isVIP: false,
    totalOrders: 3,
    totalSpent: 890,
    lastOrder: '2023-12-15',
    joinDate: '2023-10-05',
    address: 'Whitefield, Bangalore',
    rewardPoints: 25,
    averageRating: 4.2
  },
  {
    id: 'CUST-005',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '9876543214',
    isActive: true,
    isVIP: false,
    totalOrders: 15,
    totalSpent: 6750,
    lastOrder: '2024-01-16',
    joinDate: '2023-08-22',
    address: 'HSR Layout, Bangalore',
    rewardPoints: 280,
    averageRating: 4.6
  },
]

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vipFilter, setVipFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && customer.isActive) ||
                         (statusFilter === 'inactive' && !customer.isActive)
    const matchesVIP = vipFilter === 'all' ||
                      (vipFilter === 'vip' && customer.isVIP) ||
                      (vipFilter === 'regular' && !customer.isVIP)
    return matchesSearch && matchesStatus && matchesVIP
  })

  const handleToggleStatus = (customerId: string) => {
    console.log('Toggle status for customer:', customerId)
    // API call to toggle customer status
  }

  const handleToggleVIP = (customerId: string) => {
    console.log('Toggle VIP status for customer:', customerId)
    // API call to toggle VIP status
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600">Manage customer accounts, VIP status, and view customer analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">892</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">847</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VIP Customers</p>
              <p className="text-2xl font-bold text-yellow-600">156</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-purple-600">67</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
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
              placeholder="Search by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Customers</option>
              <option value="vip">VIP Only</option>
              <option value="regular">Regular Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Customers ({filteredCustomers.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                      <span className="text-sm text-gray-500">({customer.id})</span>
                      {customer.isVIP && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Crown className="w-3 h-3 mr-1" />
                          VIP
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {customer.address}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {customer.joinDate}
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="ml-1 font-medium">{customer.totalOrders}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <span className="ml-1 font-medium">₹{customer.totalSpent.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Points:</span>
                        <span className="ml-1 font-medium">{customer.rewardPoints}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">Rating:</span>
                        <div className="ml-1 flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{customer.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={customer.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
                    onClick={() => handleToggleStatus(customer.id)}
                  >
                    {customer.isActive ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={customer.isVIP ? "text-gray-600 border-gray-600 hover:bg-gray-50" : "text-yellow-600 border-yellow-600 hover:bg-yellow-50"}
                    onClick={() => handleToggleVIP(customer.id)}
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    {customer.isVIP ? 'Remove VIP' : 'Make VIP'}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}