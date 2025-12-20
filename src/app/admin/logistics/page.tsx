'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Truck, 
  Search, 
  MapPin,
  Phone,
  User,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Star,
  Clock,
  TrendingUp,
  Mail,
  Calendar,
  X
} from 'lucide-react'

interface CoverageArea {
  pincode: string
  area?: string
  isActive?: boolean
  _id?: string
}

interface LogisticsPartner {
  _id: string
  companyName: string
  contactPerson: {
    name: string
    phone: string
    email: string
  }
  coverageAreas: (string | CoverageArea)[]
  isActive: boolean
  vehicleCount: number
  sla: {
    pickupTime: number
    deliveryTime: number
  }
  performance: {
    rating: number
    totalDeliveries: number
    onTimeRate: number
    activeOrders: number
  }
  createdAt: string
}

export default function AdminLogisticsPage() {
  const [partners, setPartners] = useState<LogisticsPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedPartner, setSelectedPartner] = useState<LogisticsPartner | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const authData = localStorage.getItem('laundry-auth')
      let token = null
      if (authData) {
        const parsed = JSON.parse(authData)
        token = parsed.token
      }

      const response = await fetch('http://localhost:5000/api/admin/logistics-partners', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPartners(data.data?.partners || data.data || [])
      } else {
        // Use mock data
        setPartners([
          {
            _id: '1',
            companyName: 'FastDelivery Express',
            contactPerson: { name: 'Amit Kumar', phone: '9876543210', email: 'amit@fastdelivery.com' },
            coverageAreas: ['110001', '110002', '110003', '110004', '110005'],
            isActive: true,
            vehicleCount: 15,
            sla: { pickupTime: 60, deliveryTime: 120 },
            performance: { rating: 4.8, totalDeliveries: 2500, onTimeRate: 96, activeOrders: 45 },
            createdAt: '2024-01-10'
          },
          {
            _id: '2',
            companyName: 'QuickLogistics',
            contactPerson: { name: 'Priya Sharma', phone: '9876543220', email: 'priya@quicklogistics.com' },
            coverageAreas: ['110048', '110049', '110050', '110051'],
            isActive: true,
            vehicleCount: 10,
            sla: { pickupTime: 45, deliveryTime: 90 },
            performance: { rating: 4.5, totalDeliveries: 1800, onTimeRate: 92, activeOrders: 32 },
            createdAt: '2024-02-15'
          },
          {
            _id: '3',
            companyName: 'SpeedyPickup Services',
            contactPerson: { name: 'Rahul Verma', phone: '9876543230', email: 'rahul@speedypickup.com' },
            coverageAreas: ['201301', '201302', '201303'],
            isActive: false,
            vehicleCount: 8,
            sla: { pickupTime: 90, deliveryTime: 180 },
            performance: { rating: 4.2, totalDeliveries: 950, onTimeRate: 88, activeOrders: 0 },
            createdAt: '2024-03-20'
          }
        ])
      }
    } catch (err) {
      setError('Failed to fetch logistics partners')
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.companyName.toLowerCase().includes(search.toLowerCase()) ||
                         partner.contactPerson.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && partner.isActive) ||
                         (statusFilter === 'inactive' && !partner.isActive)
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (partner: LogisticsPartner) => {
    setSelectedPartner(partner)
    setShowModal(true)
  }

  // Helper function to get pincode from coverage area (handles both string and object)
  const getPincode = (area: string | CoverageArea): string => {
    if (typeof area === 'string') return area
    return area.pincode || 'N/A'
  }

  // Helper function to get area name
  const getAreaName = (area: string | CoverageArea): string => {
    if (typeof area === 'string') return area
    return area.area || area.pincode || 'N/A'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-yellow-600'
    return 'text-orange-600'
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-800">Logistics Partners</h1>
          <p className="text-gray-600">Manage delivery and pickup partners</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Partners</p>
              <p className="text-2xl font-bold text-gray-800">{partners.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Partners</p>
              <p className="text-2xl font-bold text-green-600">{partners.filter(p => p.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-purple-600">
                {partners.reduce((sum, p) => sum + (p.performance?.activeOrders || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(partners.reduce((sum, p) => sum + (p.performance?.rating || 0), 0) / partners.length || 0).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
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
              placeholder="Search by company name or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Partners ({filteredPartners.length})</h2>
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
          {filteredPartners.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Partners Found</h3>
              <p className="text-gray-600">No logistics partners match your search criteria.</p>
            </div>
          ) : (
            filteredPartners.map((partner) => (
              <div key={partner._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      partner.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-400'
                    }`}>
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{partner.companyName}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {partner.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`flex items-center ${getRatingColor(partner.performance.rating)}`}>
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          {partner.performance.rating}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {partner.contactPerson.name}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {partner.contactPerson.phone}
                        </div>
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 mr-1" />
                          {partner.vehicleCount} vehicles
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {partner.coverageAreas.length} areas
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <div className="text-blue-600">
                          <Package className="w-4 h-4 inline mr-1" />
                          {partner.performance.totalDeliveries} deliveries
                        </div>
                        <div className="text-green-600">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          {partner.performance.onTimeRate}% on-time
                        </div>
                        <div className="text-purple-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {partner.performance.activeOrders} active
                        </div>
                        <div className="text-gray-500">
                          SLA: {partner.sla.pickupTime}min pickup / {partner.sla.deliveryTime}min delivery
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(partner)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedPartner.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-400'
                }`}>
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedPartner.companyName}</h2>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPartner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedPartner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Person</p>
                      <p className="font-medium">{selectedPartner.contactPerson.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedPartner.contactPerson.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedPartner.contactPerson.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{selectedPartner.performance.rating}</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{selectedPartner.performance.totalDeliveries}</p>
                    <p className="text-xs text-gray-500">Total Deliveries</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{selectedPartner.performance.onTimeRate}%</p>
                    <p className="text-xs text-gray-500">On-Time Rate</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{selectedPartner.performance.activeOrders}</p>
                    <p className="text-xs text-gray-500">Active Orders</p>
                  </div>
                </div>
              </div>

              {/* SLA & Fleet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">SLA Commitments</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pickup Time</span>
                      <span className="font-medium">{selectedPartner.sla.pickupTime} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery Time</span>
                      <span className="font-medium">{selectedPartner.sla.deliveryTime} minutes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Fleet Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Vehicles</span>
                      <span className="font-medium">{selectedPartner.vehicleCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Partner Since</span>
                      <span className="font-medium">{new Date(selectedPartner.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Areas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Coverage Areas ({selectedPartner.coverageAreas.length} pincodes)</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.coverageAreas.map((area, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {getPincode(area)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
