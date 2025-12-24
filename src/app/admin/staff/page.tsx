'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/Pagination'
import { PermissionMatrix } from '@/components/rbac/PermissionMatrix'
import { 
  Users, Search, Phone, Mail, Building2, AlertCircle, Shield, Calendar,
  UserCheck, UserX, RefreshCw, Loader2, Plus, X, Key, ChevronDown, ChevronUp, Check
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const ITEMS_PER_PAGE = 8

const getAuthToken = () => {
  let token = null
  try {
    const data = localStorage.getItem('admin-storage')
    if (data) { const p = JSON.parse(data); token = p.state?.token || p.token }
  } catch {}
  return token || localStorage.getItem('admin-token') || localStorage.getItem('token')
}

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...options.headers }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API request failed')
  return data
}

const getDefaultPermissions = () => ({
  orders: { view: false, create: false, update: false, delete: false, assign: false, cancel: false, refund: false },
  customers: { view: false, create: false, update: false, delete: false },
  branches: { view: false, create: false, update: false, delete: false },
  services: { view: false, create: false, update: false, delete: false, approveChanges: false },
  financial: { view: false, create: false, update: false, delete: false, approve: false, export: false },
  reports: { view: false, create: false, update: false, delete: false, export: false },
  users: { view: false, create: false, update: false, delete: false, assignRole: false },
  settings: { view: false, create: false, update: false, delete: false }
})

interface Staff {
  _id: string; name: string; email: string; phone: string; role: string
  assignedBranch?: { _id: string; name: string }
  permissions?: Record<string, Record<string, boolean>>
  isActive: boolean; lastLogin?: string; createdAt: string
  staffCount?: number
}

interface AdminProfile {
  _id: string; name: string; email: string
  permissions: Record<string, Record<string, boolean>>
  assignedBranch?: { _id: string; name: string }
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [centerAdmins, setCenterAdmins] = useState<Staff[]>([])
  const [branches, setBranches] = useState<{_id: string, name: string}[]>([])
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'staff' | 'center-admin'>('staff')
  
  // Create Staff Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', password: '' })
  const [newStaffPermissions, setNewStaffPermissions] = useState(getDefaultPermissions())
  const [showPermissions, setShowPermissions] = useState(true)
  
  // Edit Staff Modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [editPermissions, setEditPermissions] = useState(getDefaultPermissions())
  const [updating, setUpdating] = useState(false)

  // Create Center Admin Modal
  const [showCreateCenterAdminModal, setShowCreateCenterAdminModal] = useState(false)
  const [creatingCenterAdmin, setCreatingCenterAdmin] = useState(false)
  const [newCenterAdmin, setNewCenterAdmin] = useState({ name: '', email: '', phone: '', password: '', assignedBranch: '' })

  // Check if admin has users permissions
  const canViewUsers = adminProfile?.permissions?.users?.view
  const canCreateUsers = adminProfile?.permissions?.users?.create
  const canDeleteUsers = adminProfile?.permissions?.users?.delete
  const canUpdateUsers = adminProfile?.permissions?.users?.update

  useEffect(() => { fetchAdminProfile(); fetchStaff(); fetchBranches() }, [])
  
  useEffect(() => {
    if (canViewUsers) fetchCenterAdmins()
  }, [canViewUsers])

  const fetchAdminProfile = async () => {
    try {
      const data = await apiCall('/auth/profile')
      setAdminProfile(data.data?.user || data.user)
    } catch (err) { console.error('Error fetching profile:', err) }
  }

  const fetchStaff = async () => {
    setLoading(true); setError(null)
    try {
      const res = await apiCall('/admin/staff')
      setStaff(res.data?.staff || [])
    } catch (err: any) {
      console.error('Error fetching staff:', err)
      setError(err.message || 'Failed to fetch staff')
      setStaff([])
    }
    setLoading(false)
  }

  const fetchCenterAdmins = async () => {
    try {
      const res = await apiCall('/admin/center-admins')
      setCenterAdmins(res.data?.centerAdmins || [])
    } catch (err: any) {
      console.error('Error fetching center admins:', err)
      setCenterAdmins([])
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await apiCall('/admin/branches')
      setBranches(res.data?.branches || res.data || [])
    } catch { setBranches([]) }
  }

  const handleCreateStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.password) {
      toast.error('Please fill all required fields'); return
    }
    const hasP = Object.values(newStaffPermissions).some(m => Object.values(m).some(v => v))
    if (!hasP) { toast.error('Assign at least one permission'); return }
    
    setCreating(true)
    try {
      await apiCall('/admin/staff', {
        method: 'POST',
        body: JSON.stringify({ ...newStaff, permissions: newStaffPermissions })
      })
      toast.success('Staff created successfully!')
      setShowCreateModal(false)
      setNewStaff({ name: '', email: '', phone: '', password: '' })
      setNewStaffPermissions(getDefaultPermissions())
      fetchStaff()
    } catch (e: any) { toast.error(e.message) }
    setCreating(false)
  }

  const openEditModal = async (staffMember: Staff) => {
    try {
      const data = await apiCall(`/admin/staff/${staffMember._id}`)
      const fullStaff = data.data?.staff
      setSelectedStaff(fullStaff)
      setEditPermissions(fullStaff.permissions || getDefaultPermissions())
      setShowEditModal(true)
    } catch { toast.error('Failed to load staff details') }
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return
    setUpdating(true)
    try {
      await apiCall(`/admin/staff/${selectedStaff._id}`, {
        method: 'PUT',
        body: JSON.stringify({ permissions: editPermissions })
      })
      toast.success('Staff updated!')
      setShowEditModal(false)
      fetchStaff()
    } catch (e: any) { toast.error(e.message) }
    setUpdating(false)
  }

  const handleToggleStatus = async (staffMember: Staff) => {
    setLoadingAction(staffMember._id)
    try {
      if (staffMember.isActive) {
        await apiCall(`/admin/staff/${staffMember._id}`, { method: 'DELETE' })
        toast.success(`${staffMember.name} deactivated`)
      } else {
        await apiCall(`/admin/staff/${staffMember._id}/reactivate`, { method: 'PUT' })
        toast.success(`${staffMember.name} reactivated`)
      }
      fetchStaff()
    } catch (e: any) { toast.error(e.message) }
    setLoadingAction(null)
  }

  const handleCreateCenterAdmin = async () => {
    if (!newCenterAdmin.name || !newCenterAdmin.email || !newCenterAdmin.phone || !newCenterAdmin.password) {
      toast.error('Please fill all required fields'); return
    }
    if (!newCenterAdmin.assignedBranch) {
      toast.error('Please select a branch'); return
    }
    setCreatingCenterAdmin(true)
    try {
      await apiCall('/admin/center-admins', {
        method: 'POST',
        body: JSON.stringify(newCenterAdmin)
      })
      toast.success('Center Admin created successfully!')
      setShowCreateCenterAdminModal(false)
      setNewCenterAdmin({ name: '', email: '', phone: '', password: '', assignedBranch: '' })
      fetchCenterAdmins()
    } catch (e: any) { toast.error(e.message) }
    setCreatingCenterAdmin(false)
  }

  const handleToggleCenterAdminStatus = async (ca: Staff) => {
    setLoadingAction(ca._id)
    try {
      if (ca.isActive) {
        await apiCall(`/admin/center-admins/${ca._id}`, { method: 'DELETE' })
        toast.success(`${ca.name} deactivated`)
      } else {
        await apiCall(`/admin/center-admins/${ca._id}/reactivate`, { method: 'PUT' })
        toast.success(`${ca.name} reactivated`)
      }
      fetchCenterAdmins()
    } catch (e: any) { toast.error(e.message) }
    setLoadingAction(null)
  }

  const filteredStaff = staff.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? s.isActive : !s.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredCenterAdmins = centerAdmins.filter(ca => {
    const matchesSearch = !search || ca.name.toLowerCase().includes(search.toLowerCase()) || ca.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? ca.isActive : !ca.isActive)
    return matchesSearch && matchesStatus
  })

  // Pagination - based on active tab
  const currentList = activeTab === 'staff' ? filteredStaff : filteredCenterAdmins
  const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const paginatedCenterAdmins = filteredCenterAdmins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  
  // Reset to page 1 when filters or tab change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, activeTab])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const countPermissions = (perms?: Record<string, Record<string, boolean>>) => {
    if (!perms) return 0
    return Object.values(perms).reduce((sum, m) => sum + Object.values(m).filter(v => v).length, 0)
  }

  if (loading && staff.length === 0) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
  }

  return (
    <div className="space-y-6 mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage staff and center admins</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'staff' && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />Create Staff
            </Button>
          )}
          {activeTab === 'center-admin' && canCreateUsers && (
            <Button onClick={() => setShowCreateCenterAdminModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />Create Center Admin
            </Button>
          )}
          <Button variant="outline" onClick={() => { fetchStaff(); fetchCenterAdmins() }}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('staff')} 
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'staff' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />Staff ({staff.length})
        </button>
        {canViewUsers && (
          <button 
            onClick={() => setActiveTab('center-admin')} 
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'center-admin' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />Center Admins ({centerAdmins.length})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div>
          <p className="text-sm text-blue-100">Total Staff</p>
          <p className="text-3xl font-bold">{staff.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"><Building2 className="w-6 h-6" /></div>
          <p className="text-sm text-green-100">Center Admins</p>
          <p className="text-3xl font-bold">{centerAdmins.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"><UserCheck className="w-6 h-6" /></div>
          <p className="text-sm text-emerald-100">Active Users</p>
          <p className="text-3xl font-bold">{staff.filter(s => s.isActive).length + centerAdmins.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"><Key className="w-6 h-6" /></div>
          <p className="text-sm text-purple-100">Your Permissions</p>
          <p className="text-3xl font-bold">{countPermissions(adminProfile?.permissions)}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border rounded-lg">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Staff List */}
      {activeTab === 'staff' && (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b"><h2 className="text-lg font-semibold">Your Staff ({filteredStaff.length})</h2></div>
        
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Found</h3>
            <p className="text-gray-600 mb-4">Create your first staff member with permissions</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Create Staff</Button>
          </div>
        ) : (
          <div className="divide-y">
            {paginatedStaff.map(s => (
              <div key={s._id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-400'}`}>
                      <span className="text-white font-semibold">{s.name?.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center"><Mail className="w-4 h-4 mr-1" />{s.email}</div>
                        <div className="flex items-center"><Phone className="w-4 h-4 mr-1" />{s.phone}</div>
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />Joined {new Date(s.createdAt).toLocaleDateString()}</div>
                        {s.assignedBranch && <div className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{s.assignedBranch.name}</div>}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded"><Key className="w-3 h-3 inline mr-1" />{countPermissions(s.permissions)} permissions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(s)}><Key className="w-4 h-4 mr-1" />Permissions</Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(s)} disabled={loadingAction === s._id}
                      className={s.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}>
                      {loadingAction === s._id ? <Loader2 className="w-4 h-4 animate-spin" /> : s.isActive ? <><UserX className="w-4 h-4 mr-1" />Deactivate</> : <><UserCheck className="w-4 h-4 mr-1" />Activate</>}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredStaff.length > ITEMS_PER_PAGE && (
          <Pagination
            current={currentPage}
            pages={totalPages}
            total={filteredStaff.length}
            limit={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="staff"
          />
        )}
      </div>
      )}

      {/* Center Admin List */}
      {activeTab === 'center-admin' && (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b"><h2 className="text-lg font-semibold">Center Admins ({filteredCenterAdmins.length})</h2></div>
        
        {!canViewUsers ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Permission</h3>
            <p className="text-gray-600">You don&apos;t have permission to view users</p>
          </div>
        ) : filteredCenterAdmins.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Center Admins Found</h3>
            <p className="text-gray-600 mb-4">Create your first center admin to manage a branch</p>
            {canCreateUsers && (
              <Button onClick={() => setShowCreateCenterAdminModal(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />Create Center Admin
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {paginatedCenterAdmins.map(ca => (
              <div key={ca._id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ca.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-400'}`}>
                      <span className="text-white font-semibold">{ca.name?.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">{ca.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Center Admin</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${ca.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{ca.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center"><Mail className="w-4 h-4 mr-1" />{ca.email}</div>
                        <div className="flex items-center"><Phone className="w-4 h-4 mr-1" />{ca.phone}</div>
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />Joined {new Date(ca.createdAt).toLocaleDateString()}</div>
                        {ca.assignedBranch && <div className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{ca.assignedBranch.name}</div>}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"><Users className="w-3 h-3 inline mr-1" />{ca.staffCount || 0} staff</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(ca.isActive ? canDeleteUsers : canUpdateUsers) && (
                      <Button variant="outline" size="sm" onClick={() => handleToggleCenterAdminStatus(ca)} disabled={loadingAction === ca._id}
                        className={ca.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}>
                        {loadingAction === ca._id ? <Loader2 className="w-4 h-4 animate-spin" /> : ca.isActive ? <><UserX className="w-4 h-4 mr-1" />Deactivate</> : <><UserCheck className="w-4 h-4 mr-1" />Activate</>}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredCenterAdmins.length > ITEMS_PER_PAGE && (
          <Pagination
            current={currentPage}
            pages={totalPages}
            total={filteredCenterAdmins.length}
            limit={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="center admins"
          />
        )}
      </div>
      )}

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create New Staff</h3>
              <button onClick={() => setShowCreateModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Full name" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="10-digit" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Min 6 chars" /></div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800"><Shield className="w-4 h-4 inline mr-1" />Staff can only have permissions that you have. Disabled options are permissions you don't have.</p>
              </div>

              <div>
                <button type="button" onClick={() => setShowPermissions(!showPermissions)} className="flex items-center gap-2 text-blue-600 font-medium mb-3">
                  {showPermissions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showPermissions ? 'Hide' : 'Show'} Permissions
                </button>
                {showPermissions && adminProfile && (
                  <PermissionMatrix 
                    permissions={newStaffPermissions} 
                    onChange={setNewStaffPermissions}
                    maxPermissions={adminProfile.permissions}
                  />
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-3">
              <Button onClick={handleCreateStaff} disabled={creating} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {creating ? 'Creating...' : 'Create Staff'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && adminProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div><h3 className="text-lg font-semibold">Edit Staff Permissions</h3><p className="text-sm text-gray-500">{selectedStaff.name} ({selectedStaff.email})</p></div>
              <button onClick={() => setShowEditModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800"><Shield className="w-4 h-4 inline mr-1" />Staff can only have permissions that you have.</p>
              </div>
              <PermissionMatrix 
                permissions={editPermissions} 
                onChange={setEditPermissions}
                maxPermissions={adminProfile.permissions}
              />
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-3">
              <Button onClick={handleUpdateStaff} disabled={updating} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                {updating ? 'Saving...' : 'Save Permissions'}
              </Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Center Admin Modal */}
      {showCreateCenterAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create Center Admin</h3>
              <button onClick={() => setShowCreateCenterAdminModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-2">Center Admin Capabilities</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Manage orders for assigned branch</li>
                  <li>• Manage staff within the branch</li>
                  <li>• View branch performance & analytics</li>
                  <li>• Handle inventory management</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={newCenterAdmin.name} onChange={(e) => setNewCenterAdmin({ ...newCenterAdmin, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Full name" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={newCenterAdmin.email} onChange={(e) => setNewCenterAdmin({ ...newCenterAdmin, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={newCenterAdmin.phone} onChange={(e) => setNewCenterAdmin({ ...newCenterAdmin, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="10-digit" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" value={newCenterAdmin.password} onChange={(e) => setNewCenterAdmin({ ...newCenterAdmin, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Min 6 chars" /></div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Branch *</label>
                <select 
                  value={newCenterAdmin.assignedBranch} 
                  onChange={(e) => setNewCenterAdmin({ ...newCenterAdmin, assignedBranch: e.target.value })} 
                  className={`w-full px-3 py-2 border rounded-lg ${!newCenterAdmin.assignedBranch ? 'border-red-300' : ''}`}
                >
                  <option value="">Select a branch (required)</option>
                  {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">Center Admin will manage this branch</p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-3">
              <Button onClick={handleCreateCenterAdmin} disabled={creatingCenterAdmin} className="flex-1 bg-green-600 hover:bg-green-700">
                {creatingCenterAdmin ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {creatingCenterAdmin ? 'Creating...' : 'Create Center Admin'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateCenterAdminModal(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
