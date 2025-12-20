'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  RefreshCw,
  Loader2,
  UserCheck,
  UserX,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download
} from 'lucide-react'
import { branchApi } from '@/lib/branchApi'
import toast from 'react-hot-toast'

interface StaffMember {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
  stats: {
    ordersToday: number
    totalOrders: number
    efficiency: number
  }
}

export default function BranchStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [branchInfo, setBranchInfo] = useState<{ name: string; code: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await branchApi.getStaff()
      if (response.success) {
        setStaff(response.data.staff || [])
        setBranchInfo(response.data.branch)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleToggleAvailability = async (staffId: string, currentStatus: boolean) => {
    try {
      setActionLoading(staffId)
      const response = await branchApi.toggleStaffAvailability(staffId)
      if (response.success) {
        toast.success(`Staff ${response.data.staff.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchStaff()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Orders Today', 'Total Orders', 'Efficiency'].join(','),
      ...staff.map(member => [
        member.name,
        member.email,
        member.phone || 'N/A',
        member.role,
        member.isActive ? 'Active' : 'Inactive',
        member.stats.ordersToday,
        member.stats.totalOrders,
        `${member.stats.efficiency}%`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `branch-staff-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Staff data exported successfully')
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && member.isActive) ||
                         (statusFilter === 'inactive' && !member.isActive)
    return matchesSearch && matchesStatus
  })

  const activeCount = staff.filter(s => s.isActive).length
  const inactiveCount = staff.filter(s => !s.isActive).length
  const totalOrdersToday = staff.reduce((sum, s) => sum + s.stats.ordersToday, 0)
  const avgEfficiency = staff.length > 0 
    ? Math.round(staff.reduce((sum, s) => sum + s.stats.efficiency, 0) / staff.length) 
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600">{branchInfo?.name || 'Your Branch'} - Manage your team</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchStaff}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800">{staff.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrdersToday}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-purple-600">{avgEfficiency}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Staff Members ({filteredStaff.length})
          </h2>
        </div>
        
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No staff members found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredStaff.map((member) => (
              <div key={member._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-400'}`}>
                      <span className="text-white font-semibold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      {member.phone && <p className="text-sm text-gray-500">{member.phone}</p>}
                      <p className="text-xs text-gray-400 capitalize">Role: {member.role.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Stats */}
                    <div className="flex gap-4 text-center">
                      <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{member.stats.ordersToday}</p>
                        <p className="text-xs text-gray-600">Today</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-lg">
                        <p className="text-lg font-bold text-gray-700">{member.stats.totalOrders}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      <div className="bg-purple-50 px-4 py-2 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">{member.stats.efficiency}%</p>
                        <p className="text-xs text-gray-600">Efficiency</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      variant={member.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleAvailability(member._id, member.isActive)}
                      disabled={actionLoading === member._id}
                      className={member.isActive ? '' : 'bg-green-500 hover:bg-green-600 text-white'}
                    >
                      {actionLoading === member._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : member.isActive ? (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {staff.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performers Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staff
              .filter(s => s.isActive)
              .sort((a, b) => b.stats.ordersToday - a.stats.ordersToday)
              .slice(0, 3)
              .map((member, idx) => (
                <div key={member._id} className={`p-4 rounded-lg ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'} text-white font-bold`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.stats.ordersToday} orders today</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
