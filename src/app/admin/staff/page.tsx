'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  Phone,
  Mail,
  Building2,
  Eye,
  AlertCircle,
  Shield,
  Calendar,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { adminApi } from '@/lib/adminApi'
import toast from 'react-hot-toast'

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  assignedBranch?: {
    _id: string
    name: string
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = { page: 1, limit: 50 }
      if (roleFilter) params.role = roleFilter
      if (statusFilter === 'active') params.isActive = true
      if (statusFilter === 'inactive') params.isActive = false
      if (search) params.search = search

      const response = await adminApi.getStaff(params)
      
      if (response.success) {
        const allUsers = response.data.data || response.data.users || []
        setUsers(allUsers)
        setPagination(response.data.pagination || { current: 1, pages: 1, total: allUsers.length })
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchUsers()
  }

  const handleToggleStatus = async (userId: string, userName: string, isActive: boolean) => {
    setLoadingAction(userId)
    try {
      await adminApi.toggleStaffStatus(userId)
      toast.success(`${userName} has been ${isActive ? 'deactivated' : 'activated'} successfully!`)
      fetchUsers()
    } catch (err: any) {
      console.error('Error toggling status:', err)
      toast.error(err.message || 'Failed to update status')
    } finally {
      setLoadingAction(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search)
    return matchesSearch
  })

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; color: string }> = {
      'customer': { label: 'Customer', color: 'bg-teal-100 text-teal-800' },
      'branch_manager': { label: 'Branch Manager', color: 'bg-purple-100 text-purple-800' },
      'support_agent': { label: 'Support Agent', color: 'bg-blue-100 text-blue-800' },
      'staff': { label: 'Staff', color: 'bg-green-100 text-green-800' },
      'admin': { label: 'Admin', color: 'bg-red-100 text-red-800' },
      'center_admin': { label: 'Center Admin', color: 'bg-indigo-100 text-indigo-800' }
    }
    const config = roleConfig[role] || { label: role?.replace(/_/g, ' ') || 'Unknown', color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${config.color}`}>{config.label}</span>
  }

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all users and their roles</p>
        </div>
        <Button variant="outline" onClick={fetchUsers}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-blue-100">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-emerald-100">Active Users</p>
            <p className="text-3xl font-bold">{users.filter(u => u.isActive).length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-amber-100">Customers</p>
            <p className="text-3xl font-bold">{users.filter(u => u.role === 'customer').length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-purple-100">Admins & Staff</p>
            <p className="text-3xl font-bold">{users.filter(u => u.role !== 'customer').length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="center_admin">Center Admin</option>
            <option value="branch_manager">Branch Manager</option>
            <option value="support_agent">Support Agent</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Users ({filteredUsers.length})</h2>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">No users match your search criteria.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-400'
                    }`}>
                      <span className="text-white font-semibold">
                        {user.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center min-w-0">
                          <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        {user.assignedBranch && (
                          <div className="flex items-center min-w-0">
                            <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{user.assignedBranch.name}</span>
                          </div>
                        )}
                      </div>

                      {user.lastLogin && (
                        <p className="text-xs text-gray-400 mt-2">
                          Last login: {new Date(user.lastLogin).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleStatus(user._id, user.name, user.isActive)}
                      disabled={loadingAction === user._id}
                      className={user.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
                    >
                      {loadingAction === user._id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : user.isActive ? (
                        <UserX className="w-4 h-4 mr-1" />
                      ) : (
                        <UserCheck className="w-4 h-4 mr-1" />
                      )}
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
