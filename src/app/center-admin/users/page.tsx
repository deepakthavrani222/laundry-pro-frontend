'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Shield,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  X,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function to get auth token
const getAuthToken = () => {
  let token = null
  
  // First try center-admin-storage (Zustand persist format)
  try {
    const centerAdminData = localStorage.getItem('center-admin-storage')
    if (centerAdminData) {
      const parsed = JSON.parse(centerAdminData)
      token = parsed.state?.token || parsed.token
    }
  } catch (e) {
    console.error('Error parsing center-admin-storage:', e)
  }
  
  // Fallback to legacy token keys
  if (!token) {
    token = localStorage.getItem('center-admin-token') || localStorage.getItem('token')
  }
  
  return token
}

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  return data
}

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  isActive: boolean
  createdAt: string
  branch?: {
    _id: string
    name: string
  }
  assignedBranch?: {
    _id: string
    name: string
    code: string
  }
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  branch_manager: 'bg-blue-100 text-blue-800',
  staff: 'bg-green-100 text-green-800',
  customer: 'bg-gray-100 text-gray-800',
}

const roleOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'staff', label: 'Staff' },
  { value: 'branch_manager', label: 'Branch Manager' },
  { value: 'admin', label: 'Admin' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editRole, setEditRole] = useState('')
  const [editStatus, setEditStatus] = useState(true)
  const [editBranchId, setEditBranchId] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [branches, setBranches] = useState<{_id: string, name: string}[]>([])
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff',
    branchId: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const data = await apiCall('/center-admin/branches')
      const branchesData = data.data?.branches || data.data || []
      setBranches(branchesData)
    } catch (error) {
      console.error('Error fetching branches:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiCall('/center-admin/users')
      const usersData = data.data?.users || data.data || []
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditRole(user.role)
    setEditStatus(user.isActive)
    setEditBranchId(user.assignedBranch?._id || user.branch?._id || '')
    setShowEditModal(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      setUpdating(true)

      // Update role and branch if changed
      if (editRole !== selectedUser.role || editBranchId !== (selectedUser.assignedBranch?._id || selectedUser.branch?._id || '')) {
        await apiCall(`/center-admin/users/${selectedUser._id}/role`, {
          method: 'PATCH',
          body: JSON.stringify({ 
            role: editRole,
            assignedBranch: (editRole === 'branch_manager' || editRole === 'staff') ? editBranchId : undefined
          })
        })
      }

      // Update status if changed
      if (editStatus !== selectedUser.isActive) {
        await apiCall(`/center-admin/users/${selectedUser._id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ isActive: editStatus })
        })
      }

      toast.success('User updated successfully')
      setShowEditModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user')
    } finally {
      setUpdating(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await apiCall(`/center-admin/users/${user._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !user.isActive })
      })
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setCreating(true)
      await apiCall('/center-admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
          assignedBranch: newUser.role === 'branch_manager' || newUser.role === 'staff' ? newUser.branchId : undefined
        })
      })
      toast.success('User created successfully')
      setShowCreateModal(false)
      setNewUser({ name: '', email: '', phone: '', password: '', role: 'staff', branchId: '' })
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users & Roles</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="branch_manager">Branch Manager</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-sm text-purple-100">Total Users</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-white">
            {users.filter(u => u.role === 'branch_manager').length}
          </div>
          <div className="text-sm text-blue-100">Branch Managers</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-white">
            {users.filter(u => u.role === 'staff').length}
          </div>
          <div className="text-sm text-green-100">Staff</div>
        </div>
        <div className="bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-white">
            {users.filter(u => u.isActive).length}
          </div>
          <div className="text-sm text-gray-200">Active Users</div>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No users have been added yet'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-medium">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {(user.assignedBranch || user.branch) ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-3 h-3 mr-1" />
                          {user.assignedBranch?.name || user.branch?.name}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create New User</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewUser({ name: '', email: '', phone: '', password: '', role: 'staff', branchId: '' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Min 8 characters with uppercase, lowercase, and number</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch (for branch_manager and staff) */}
              {(newUser.role === 'branch_manager' || newUser.role === 'staff') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Branch {newUser.role === 'branch_manager' && '*'}
                  </label>
                  <select
                    value={newUser.branchId}
                    onChange={(e) => setNewUser({ ...newUser, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a branch</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateUser}
                disabled={creating || !newUser.name || !newUser.email || !newUser.password}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewUser({ name: '', email: '', phone: '', password: '', role: 'staff', branchId: '' })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-medium text-lg">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">{selectedUser.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <Phone className="w-3 h-3 inline mr-1" />
                {selectedUser.phone}
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Selection (for branch_manager and staff) */}
            {(editRole === 'branch_manager' || editRole === 'staff') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Branch {editRole === 'branch_manager' && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={editBranchId}
                  onChange={(e) => setEditBranchId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {editRole === 'branch_manager' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Branch manager will only see orders and data for this branch
                  </p>
                )}
              </div>
            )}

            {/* Status Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditStatus(true)}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    editStatus 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Active
                </button>
                <button
                  onClick={() => setEditStatus(false)}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    !editStatus 
                      ? 'bg-red-50 border-red-500 text-red-700' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Inactive
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleUpdateUser}
                disabled={updating}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
