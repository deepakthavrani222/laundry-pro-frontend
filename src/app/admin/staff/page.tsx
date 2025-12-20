'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  Phone,
  Mail,
  Building2,
  CheckCircle,
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

interface Staff {
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

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [roleFilter, statusFilter])

  const fetchStaff = async () => {
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
        // Filter out customers, only show staff roles
        const staffUsers = (response.data.data || response.data.users || []).filter(
          (user: Staff) => user.role !== 'customer'
        )
        setStaff(staffUsers)
        setPagination(response.data.pagination || { current: 1, pages: 1, total: staffUsers.length })
      }
    } catch (err) {
      console.error('Error fetching staff:', err)
      setError('Failed to fetch staff members')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchStaff()
  }

  const handleToggleStatus = async (userId: string, memberName: string, isActive: boolean) => {
    setLoadingAction(userId)
    try {
      await adminApi.toggleStaffStatus(userId)
      toast.success(`${memberName} has been ${isActive ? 'deactivated' : 'activated'} successfully!`)
      fetchStaff() // Refresh list
    } catch (err: any) {
      console.error('Error toggling status:', err)
      toast.error(err.message || 'Failed to update status')
    } finally {
      setLoadingAction(null)
    }
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = !search || 
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone?.includes(search)
    return matchesSearch
  })

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; color: string }> = {
      'branch_manager': { label: 'Branch Manager', color: 'bg-purple-100 text-purple-800' },
      'support_agent': { label: 'Support Agent', color: 'bg-blue-100 text-blue-800' },
      'staff': { label: 'Staff', color: 'bg-green-100 text-green-800' },
      'admin': { label: 'Admin', color: 'bg-red-100 text-red-800' },
      'center_admin': { label: 'Center Admin', color: 'bg-indigo-100 text-indigo-800' }
    }
    const config = roleConfig[role] || { label: role?.replace(/_/g, ' ') || 'Unknown', color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${config.color}`}>{config.label}</span>
  }

  if (loading && staff.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600">Manage staff members and their roles</p>
        </div>
        <Button variant="outline" onClick={fetchStaff}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800">{staff.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">{staff.filter(s => s.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{staff.filter(s => s.role === 'admin' || s.role === 'center_admin').length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Support Agents</p>
              <p className="text-2xl font-bold text-blue-600">{staff.filter(s => s.role === 'support_agent').length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
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
            <option value="admin">Admin</option>
            <option value="branch_manager">Branch Manager</option>
            <option value="support_agent">Support Agent</option>
            <option value="staff">Staff</option>
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

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Staff Members ({filteredStaff.length})</h2>
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
          {filteredStaff.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Found</h3>
              <p className="text-gray-600">No staff members match your search criteria.</p>
            </div>
          ) : (
            filteredStaff.map((member) => (
              <div key={member._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-400'
                    }`}>
                      <span className="text-white font-semibold">
                        {member.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        {getRoleBadge(member.role)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {member.phone}
                          </div>
                        )}
                        {member.assignedBranch && (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {member.assignedBranch.name}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {new Date(member.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      {member.lastLogin && (
                        <p className="text-xs text-gray-400 mt-2">
                          Last login: {new Date(member.lastLogin).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleStatus(member._id, member.name, member.isActive)}
                      disabled={loadingAction === member._id}
                      className={member.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
                    >
                      {loadingAction === member._id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : member.isActive ? (
                        <UserX className="w-4 h-4 mr-1" />
                      ) : (
                        <UserCheck className="w-4 h-4 mr-1" />
                      )}
                      {member.isActive ? 'Deactivate' : 'Activate'}
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
