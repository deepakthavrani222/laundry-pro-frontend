'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, MapPin, Sparkles, Package, Calendar, Clock, ChevronRight, ChevronLeft, Loader2, Check, Minus, Plus, Phone, CreditCard, Truck, CheckCircle, Building2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface Branch {
  _id: string
  name: string
  code: string
  address: {
    street?: string
    city?: string
    pincode?: string
    addressLine1?: string
  }
  contact?: { phone?: string }
  phone?: string
}

interface Service {
  _id: string
  name: string
  code: string
  displayName: string
  description: string
  turnaroundTime: { standard: number; express: number }
}

interface ServiceItem {
  id: string
  name: string
  basePrice: number
  category: string
}

interface Address {
  _id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  pincode: string
  isDefault: boolean
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginRequired: () => void
}

const STEPS = [
  { id: 1, title: 'Branch', icon: Building2 },
  { id: 2, title: 'Service', icon: Sparkles },
  { id: 3, title: 'Items', icon: Package },
  { id: 4, title: 'Address', icon: MapPin },
  { id: 5, title: 'Schedule', icon: Calendar },
  { id: 6, title: 'Payment', icon: CreditCard },
]

export default function BookingModal({ isOpen, onClose, onLoginRequired }: BookingModalProps) {
  const { isAuthenticated, user, token } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Data states
  const [branches, setBranches] = useState<Branch[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [serviceItems, setServiceItems] = useState<Record<string, ServiceItem[]>>({})
  const [addresses, setAddresses] = useState<Address[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  
  // Selection states
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [items, setItems] = useState<Record<string, number>>({})
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod')
  const [specialInstructions, setSpecialInstructions] = useState('')
  
  // Order states
  const [isExpress, setIsExpress] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<any>(null)
  const [calculatedPricing, setCalculatedPricing] = useState<any>(null)
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null)
  
  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', addressLine1: '', landmark: '', city: '', pincode: ''
  })

  // Fetch branches on mount
  useEffect(() => {
    if (isOpen) {
      fetchBranches()
      if (isAuthenticated) {
        fetchAddresses()
        fetchTimeSlots()
      }
    }
  }, [isOpen, isAuthenticated])

  // Update new address with user info when authenticated
  useEffect(() => {
    if (user) {
      setNewAddress(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }))
    }
  }, [user])

  // Fetch services when branch is selected
  useEffect(() => {
    if (selectedBranch) {
      fetchServices(selectedBranch._id)
      fetchServiceItems(selectedBranch._id)
    }
  }, [selectedBranch])

  // Calculate pricing when items change
  useEffect(() => {
    if (Object.values(items).some(qty => qty > 0) && selectedService) {
      calculatePrice()
    } else {
      setCalculatedPricing(null)
    }
  }, [items, selectedService, isExpress])

  // Calculate delivery when address and branch selected
  useEffect(() => {
    if (selectedBranch && selectedAddressId && addresses.length > 0) {
      calculateDelivery()
    }
  }, [selectedBranch, selectedAddressId, addresses, isExpress])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/services/branches')
      const data = await response.json()
      if (data.success) setBranches(data.data.branches || [])
    } catch (error) {
      console.error('Failed to fetch branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async (branchId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/services/branch/${branchId}`)
      const data = await response.json()
      if (data.success) setServices(data.data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceItems = async (branchId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/service-items/branch/${branchId}`)
      const data = await response.json()
      if (data.success) setServiceItems(data.data || {})
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customer/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        const addrs = data.data.addresses || []
        setAddresses(addrs)
        const defaultAddr = addrs.find((a: Address) => a.isDefault) || addrs[0]
        if (defaultAddr) setSelectedAddressId(defaultAddr._id)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services/time-slots')
      const data = await response.json()
      if (data.success) setTimeSlots(data.data.timeSlots || [])
    } catch (error) {
      setTimeSlots(['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00'])
    }
  }

  const calculatePrice = async () => {
    const orderItems = Object.entries(items)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        itemType: itemId,
        service: selectedService?.code || '',
        category: 'normal',
        quantity: qty
      }))
    
    if (orderItems.length === 0) return
    
    try {
      const response = await fetch('http://localhost:5000/api/services/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, isExpress })
      })
      const data = await response.json()
      if (data.success) setCalculatedPricing(data.data)
    } catch (error) {
      console.error('Failed to calculate pricing:', error)
    }
  }

  const calculateDelivery = async () => {
    const selectedAddress = addresses.find(a => a._id === selectedAddressId)
    if (!selectedAddress || !selectedBranch) return
    
    try {
      const response = await fetch('http://localhost:5000/api/delivery/calculate-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupAddress: {
            addressLine1: selectedAddress.addressLine1,
            city: selectedAddress.city,
            pincode: selectedAddress.pincode
          },
          branchId: selectedBranch._id,
          isExpress
        })
      })
      const data = await response.json()
      if (data.success) setDeliveryInfo(data.data)
    } catch (error) {
      console.error('Failed to calculate delivery:', error)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/customer/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 })
      })
      const data = await response.json()
      if (data.success) {
        const addr = data.data.address
        setAddresses(prev => [...prev, addr])
        setSelectedAddressId(addr._id)
        setShowAddressForm(false)
        setNewAddress({ name: user?.name || '', phone: user?.phone || '', addressLine1: '', landmark: '', city: '', pincode: '' })
        toast.success('Address added!')
      }
    } catch (error) {
      toast.error('Failed to add address')
    }
  }

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      onLoginRequired()
      return
    }
    
    const orderItems = Object.entries(items)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        itemType: itemId,
        service: selectedService?.code || '',
        category: 'normal',
        quantity: qty,
        specialInstructions: ''
      }))
    
    const orderData = {
      items: orderItems,
      pickupAddressId: selectedAddressId,
      deliveryAddressId: selectedAddressId,
      pickupDate: selectedDate,
      pickupTimeSlot: selectedTimeSlot,
      paymentMethod,
      isExpress,
      specialInstructions,
      branchId: selectedBranch?._id,
      deliveryDetails: deliveryInfo ? {
        distance: deliveryInfo.distance,
        deliveryCharge: deliveryInfo.deliveryCharge,
        isFallbackPricing: deliveryInfo.isFallback
      } : undefined
    }
    
    try {
      setSubmitting(true)
      const response = await fetch('http://localhost:5000/api/customer/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })
      const data = await response.json()
      if (data.success) {
        setCreatedOrder(data.data.order)
        setOrderSuccess(true)
        toast.success('Order placed successfully!')
      } else {
        toast.error(data.message || 'Failed to create order')
      }
    } catch (error) {
      toast.error('Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrentItems = () => serviceItems[selectedService?.code || ''] || []
  
  const updateItemQuantity = (itemId: string, change: number) => {
    setItems(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) + change) }))
  }

  const getTotalItems = () => Object.values(items).reduce((sum, qty) => sum + qty, 0)
  
  const getTotalPrice = () => {
    const currentItems = getCurrentItems()
    let total = 0
    Object.entries(items).forEach(([itemId, qty]) => {
      const item = currentItems.find(i => i.id === itemId)
      if (item) total += item.basePrice * qty
    })
    if (isExpress) total *= 1.5
    return total
  }

  const getSelectedAddress = () => addresses.find(a => a._id === selectedAddressId)

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedBranch
      case 2: return !!selectedService
      case 3: return getTotalItems() > 0
      case 4: return !!selectedAddressId && (!deliveryInfo || deliveryInfo.isServiceable)
      case 5: return !!selectedDate && !!selectedTimeSlot
      case 6: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (step === 3 && !isAuthenticated) {
      onLoginRequired()
      return
    }
    if (step < 6) setStep(step + 1)
    else handleSubmitOrder()
  }

  const resetModal = () => {
    setStep(1)
    setSelectedBranch(null)
    setSelectedService(null)
    setItems({})
    setSelectedAddressId('')
    setSelectedDate('')
    setSelectedTimeSlot('')
    setPaymentMethod('cod')
    setSpecialInstructions('')
    setIsExpress(false)
    setOrderSuccess(false)
    setCreatedOrder(null)
    setCalculatedPricing(null)
    setDeliveryInfo(null)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Order Placed!</h2>
            <p className="text-white/80 text-sm">Your pickup has been scheduled</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-teal-500" />
                <span>{selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', month: 'short', year: 'numeric', weekday: 'long'
                })}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-teal-500" />
                <span>{selectedTimeSlot}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-teal-500" />
                <span className="text-sm">{getSelectedAddress()?.addressLine1}, {getSelectedAddress()?.city}</span>
              </div>
            </div>
            
            {createdOrder && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-bold text-teal-600">{createdOrder.orderNumber || createdOrder._id}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => {
                setOrderSuccess(false)
                setStep(5)
              }}>
                <Clock className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button className="flex-1 bg-teal-500 hover:bg-teal-600" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quick Book</h2>
              <p className="text-xs text-white/80">Step {step} of 6 - {STEPS[step-1].title}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-3">
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors ${s.id <= step ? 'bg-teal-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && step === 1 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
          ) : (
            <>
              {/* Step 1: Select Branch */}
              {step === 1 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-500" />
                    Select Branch
                  </h3>
                  <p className="text-sm text-gray-500">Choose a branch near you</p>
                  
                  {branches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No branches available</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {branches.map((branch) => (
                        <div key={branch._id} onClick={() => setSelectedBranch(branch)}
                          className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedBranch?._id === branch._id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">{branch.name}</p>
                              <p className="text-sm text-gray-500">{branch.address?.city || branch.address?.addressLine1 || 'Location available'}</p>
                            </div>
                            {selectedBranch?._id === branch._id && (
                              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Select Service */}
              {step === 2 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    Select Service
                  </h3>
                  <p className="text-sm text-gray-500">Choose a laundry service</p>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No services available</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {services.map((service) => (
                        <div key={service._id} onClick={() => { setSelectedService(service); setItems({}) }}
                          className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedService?._id === service._id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">{service.displayName}</p>
                              <p className="text-xs text-gray-500">{service.turnaroundTime?.standard || 48}h delivery</p>
                            </div>
                            {selectedService?._id === service._id && (
                              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select Items */}
              {step === 3 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-teal-500" />
                    Select Items
                  </h3>
                  <p className="text-sm text-gray-500">Add items for {selectedService?.displayName}</p>
                  
                  {getCurrentItems().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No items available for this service</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getCurrentItems().map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-teal-600">₹{item.basePrice}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateItemQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{items[item.id] || 0}</span>
                            <button onClick={() => updateItemQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {getTotalItems() > 0 && (
                    <>
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-800">Express Delivery</p>
                            <p className="text-xs text-gray-500">Get it faster (+50%)</p>
                          </div>
                          <input type="checkbox" checked={isExpress} onChange={(e) => setIsExpress(e.target.checked)}
                            className="w-5 h-5 text-teal-500 rounded" />
                        </label>
                      </div>
                      <div className="p-4 bg-teal-50 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Total ({getTotalItems()} items)</p>
                            <p className="text-2xl font-bold text-teal-600">₹{getTotalPrice()}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Address */}
              {step === 4 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    Pickup Address
                  </h3>
                  
                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No addresses saved</p>
                      <Button onClick={() => setShowAddressForm(true)} className="bg-teal-500 hover:bg-teal-600">
                        <Plus className="w-4 h-4 mr-2" /> Add Address
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {addresses.map((address) => (
                          <div key={address._id} onClick={() => setSelectedAddressId(address._id)}
                            className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedAddressId === address._id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800">{address.name}</span>
                                  {address.isDefault && (
                                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Default</span>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                  <Phone className="w-3 h-3 mr-1" />{address.phone}
                                </div>
                                <p className="text-sm text-gray-600">{address.addressLine1}, {address.city} - {address.pincode}</p>
                              </div>
                              {selectedAddressId === address._id && (
                                <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setShowAddressForm(true)}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-600 flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-2" /> Add New Address
                      </button>
                    </>
                  )}

                  {/* Delivery Info */}
                  {selectedAddressId && deliveryInfo && (
                    <div className={`p-4 rounded-xl ${deliveryInfo.isServiceable ? 'bg-teal-50' : 'bg-red-50'}`}>
                      {deliveryInfo.isServiceable ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Truck className="w-4 h-4 text-teal-600 mr-2" />
                              <span className="font-medium text-gray-800">Delivery Charge</span>
                            </div>
                            <span className="font-bold text-teal-600">
                              {deliveryInfo.deliveryCharge === 0 ? 'FREE' : `₹${deliveryInfo.deliveryCharge}`}
                            </span>
                          </div>
                          {deliveryInfo.distance && <p className="text-sm text-gray-600">📍 Distance: {deliveryInfo.distance} km</p>}
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-red-600 font-medium">❌ Area Not Serviceable</p>
                          <p className="text-sm text-red-500">{deliveryInfo.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Schedule */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-500" />
                    Schedule Pickup
                  </h3>

                  {/* Summary */}
                  <div className="p-3 bg-gray-50 rounded-xl text-sm">
                    <div className="flex items-center text-gray-700 mb-1">
                      <Building2 className="w-4 h-4 mr-2 text-teal-500" />
                      <span>{selectedBranch?.name}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                      <span>{getSelectedAddress()?.addressLine1}, {getSelectedAddress()?.city}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2" /> Date
                    </label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min={new Date().toISOString().split('T')[0]} />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 mr-2" /> Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button key={slot} onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 border-2 rounded-xl text-sm transition-all ${
                            selectedTimeSlot === slot ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                    <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g., call before pickup"
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={2} />
                  </div>
                </div>
              )}

              {/* Step 6: Payment & Confirm */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-500" />
                    Confirm Order
                  </h3>

                  {/* Order Summary */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="font-medium text-gray-800 mb-2">Order Summary</p>
                    {Object.entries(items).filter(([_, qty]) => qty > 0).map(([itemId, qty]) => {
                      const item = getCurrentItems().find(i => i.id === itemId)
                      return (
                        <div key={itemId} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item?.name} x {qty}</span>
                          <span className="font-medium">₹{(item?.basePrice || 0) * qty}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Schedule Summary */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                      <span>{selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-teal-500" />
                      <span>{selectedTimeSlot}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setPaymentMethod('cod')}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          paymentMethod === 'cod' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                        }`}>
                        <Home className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <p className="font-medium text-gray-800 text-sm">Cash on Delivery</p>
                      </button>
                      <button onClick={() => setPaymentMethod('online')}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          paymentMethod === 'online' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                        }`}>
                        <CreditCard className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <p className="font-medium text-gray-800 text-sm">Online Payment</p>
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-teal-50 rounded-xl">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    {deliveryInfo && deliveryInfo.isServiceable && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Delivery</span>
                        <span className={deliveryInfo.deliveryCharge === 0 ? 'text-green-600' : ''}>
                          {deliveryInfo.deliveryCharge === 0 ? 'FREE' : `₹${deliveryInfo.deliveryCharge}`}
                        </span>
                      </div>
                    )}
                    <hr className="my-2 border-teal-200" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-teal-600">₹{getTotalPrice() + (deliveryInfo?.deliveryCharge || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canProceed() || submitting}
              className="flex-1 bg-teal-500 hover:bg-teal-600">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : step === 6 ? (
                <><Check className="w-4 h-4 mr-1" /> Place Order</>
              ) : step === 3 && !isAuthenticated ? (
                'Login to Continue'
              ) : (
                <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
              <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name *" value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <input type="tel" placeholder="Phone *" value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>
              <input type="text" placeholder="Address Line 1 *" value={newAddress.addressLine1}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              <input type="text" placeholder="Landmark (Optional)" value={newAddress.landmark}
                onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="City *" value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <input type="text" placeholder="Pincode *" value={newAddress.pincode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full">
                Add Address
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
