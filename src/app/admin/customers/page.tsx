'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  X,
  ShoppingBag,
  IndianRupee,
  Clock,
  MapPin,
  Download,
  RefreshCw
} from 'lucide-react'
import { useAdminCustomers } from '@/hooks/useAdmin'
import toast from 'react-hot-toast'

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  isActive: boolean
  isVIP: boolean
  createdAt: string
  stats: {
    totalOrders: number
    totalSpent: number
  }
  addresses?: Array<{
    addressLine1: string
    city: string
    pincode: string
  }>
}

export default function AdminCustomersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    isActive: undefined as boolean | undefined,
    isVIP: undefined as boolean | undefined
  })
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const { customers, pagination, loading, error, toggleStatus, updateVIPStatus, refetch } = useAdminCustomers(filters)

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleToggleStatus = async (customerId: string, customerName: string, isActive: boolean) => {
    setLoadingAction(`status-${customerId}`)
    try {
      await toggleStatus(customerId)
      toast.success(`${customerName} has been ${isActive ? 'deactivated' : 'activated'} successfully!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer status')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleToggleVIP = async (customerId: string, customerName: string, currentVIPStatus: boolean) => {
    setLoadingAction(`vip-${customerId}`)
    try {
      await updateVIPStatus(customerId, !currentVIPStatus)
      toast.success(`${customerName} ${currentVIPStatus ? 'removed from' : 'added to'} VIP list!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update VIP status')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowProfileModal(true)
  }

  const handleExport = () => {
    toast.success('Export started! File will download shortly.')
    // Create CSV data
    const headers = ['Name', 'Email', 'Phone', 'Status', 'VIP', 'Total Orders', 'Total Spent', 'Joined Date']
    const csvData = customers.map(c => [
      c.name,
      c.email,
      c.phone,
      c.isActive ? 'Active' : 'Inactive',
      c.isVIP ? 'Yes' : 'No',
      c.stats?.totalOrders || 0,
      c.stats?.totalSpent || 0,
      new Date(c.createdAt).toLocaleDateString('en-IN')
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
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
              <p className="text-2xl font-bold text-gray-800">{pagination.total}</p>
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
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.isActive).length}
              </p>
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
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.isVIP).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Page</p>
              <p className="text-2xl font-bold text-purple-600">{customers.length}</p>
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
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.isActive === undefined ? '' : filters.isActive.toString()}
              onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={filters.isVIP === undefined ? '' : filters.isVIP.toString()}
              onChange={(e) => handleFilterChange('isVIP', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Customers</option>
              <option value="true">VIP Only</option>
              <option value="false">Regular Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Customers ({pagination.total})
          </h2>
        </div>
        
        {error && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">Error loading customers: {error}</span>
            </div>
          </div>
        )}
        
        <div className="divide-y divide-gray-200">
          {customers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
              <p className="text-gray-600">No customers match your current filters.</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                        {customer.isVIP && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center truncate">
                            <Mail className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
                            <span className="truncate">{customer.email}</span>
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400" />
                            {customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                            Joined {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <span>Orders: <strong className="text-gray-700">{customer.stats?.totalOrders || 0}</strong></span>
                          <span>Spent: <strong className="text-gray-700">₹{customer.stats?.totalSpent?.toLocaleString() || '0'}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(customer)}
                      className="whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={`whitespace-nowrap ${customer.isActive ? "text-red-600 border-red-300 hover:bg-red-50" : "text-green-600 border-green-300 hover:bg-green-50"}`}
                      onClick={() => handleToggleStatus(customer._id, customer.name, customer.isActive)}
                      disabled={loadingAction === `status-${customer._id}`}
                    >
                      {loadingAction === `status-${customer._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : customer.isActive ? (
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
                      className={`whitespace-nowrap ${customer.isVIP ? "text-gray-600 border-gray-300 hover:bg-gray-50" : "text-yellow-600 border-yellow-300 hover:bg-yellow-50"}`}
                      onClick={() => handleToggleVIP(customer._id, customer.name, customer.isVIP)}
                      disabled={loadingAction === `vip-${customer._id}`}
                    >
                      {loadingAction === `vip-${customer._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-1" />
                          {customer.isVIP ? 'Remove VIP' : 'Make VIP'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {pagination.current} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Profile Modal */}
      {showProfileModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Customer Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h4>
                    {selectedCustomer.isVIP && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    selectedCustomer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomer.isActive ? 'Active Account' : 'Inactive Account'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h5>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Order Statistics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <ShoppingBag className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.stats?.totalOrders || 0}</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <IndianRupee className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">₹{selectedCustomer.stats?.totalSpent?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h5>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    className={selectedCustomer.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
                    onClick={() => {
                      handleToggleStatus(selectedCustomer._id, selectedCustomer.name, selectedCustomer.isActive)
                      setShowProfileModal(false)
                    }}
                  >
                    {selectedCustomer.isActive ? (
                      <>
                        <UserX className="w-4 h-4 mr-2" />
                        Deactivate Account
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Activate Account
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className={selectedCustomer.isVIP ? "text-gray-600 border-gray-600 hover:bg-gray-50" : "text-yellow-600 border-yellow-600 hover:bg-yellow-50"}
                    onClick={() => {
                      handleToggleVIP(selectedCustomer._id, selectedCustomer.name, selectedCustomer.isVIP)
                      setShowProfileModal(false)
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {selectedCustomer.isVIP ? 'Remove VIP Status' : 'Make VIP Customer'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
