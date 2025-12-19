'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Shirt, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard,
  Plus,
  Minus,
  Clock,
  Truck,
  Sparkles,
  Award,
  Home,
  Loader2
} from 'lucide-react'
import { useAddresses } from '@/hooks/useAddresses'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const serviceTypes = [
  { id: 'wash-fold', name: 'Wash & Fold', icon: Shirt, price: 30, description: 'Regular washing and folding', color: 'blue' },
  { id: 'dry-cleaning', name: 'Dry Cleaning', icon: Sparkles, price: 80, description: 'Professional dry cleaning', color: 'purple' },
  { id: 'laundry', name: 'Laundry Service', icon: Package, price: 25, description: 'Complete laundry service', color: 'green' },
  { id: 'shoe-cleaning', name: 'Shoe Cleaning', icon: Award, price: 100, description: 'Professional shoe care', color: 'orange' },
  { id: 'express', name: 'Express Service', icon: Clock, price: 50, description: 'Same-day service', color: 'red' },
]

const itemTypesByService = {
  'wash-fold': [
    { id: 'mens_shirt', name: "Men's Shirt", basePrice: 25 },
    { id: 'womens_shirt', name: "Women's Shirt", basePrice: 25 },
    { id: 'trousers', name: 'Trousers/Jeans', basePrice: 35 },
    { id: 'bedsheet_single', name: 'Bed Sheet (Single)', basePrice: 40 },
    { id: 'bedsheet_double', name: 'Bed Sheet (Double)', basePrice: 60 },
    { id: 'towel', name: 'Towel', basePrice: 20 },
    { id: 'pillow_cover', name: 'Pillow Cover', basePrice: 15 },
  ],
  'dry-cleaning': [
    { id: 'formal_shirt', name: 'Formal Shirt', basePrice: 60 },
    { id: 'suit_2piece', name: 'Suit (2-piece)', basePrice: 250 },
    { id: 'saree_cotton', name: 'Saree (Cotton)', basePrice: 100 },
    { id: 'saree_silk', name: 'Saree (Silk)', basePrice: 150 },
    { id: 'blazer', name: 'Blazer/Jacket', basePrice: 180 },
    { id: 'dress_gown', name: 'Dress/Gown', basePrice: 120 },
    { id: 'curtains', name: 'Curtains (per panel)', basePrice: 200 },
  ],
  'laundry': [
    { id: 'tshirt', name: 'T-Shirt', basePrice: 25 },
    { id: 'shirt', name: 'Shirt', basePrice: 30 },
    { id: 'jeans', name: 'Jeans', basePrice: 40 },
    { id: 'dress', name: 'Dress', basePrice: 50 },
    { id: 'bedsheet', name: 'Bed Sheet', basePrice: 45 },
    { id: 'towel', name: 'Towel', basePrice: 20 },
  ],
  'shoe-cleaning': [
    { id: 'leather_shoes', name: 'Leather Shoes', basePrice: 150 },
    { id: 'sports_shoes', name: 'Sports Shoes', basePrice: 100 },
    { id: 'formal_shoes', name: 'Formal Shoes', basePrice: 120 },
    { id: 'boots', name: 'Boots', basePrice: 180 },
    { id: 'sandals', name: 'Sandals', basePrice: 80 },
  ],
  'express': [
    { id: 'shirt_express', name: 'Shirt (Express)', basePrice: 45 },
    { id: 'suit_express', name: 'Suit (Express)', basePrice: 400 },
    { id: 'jeans_express', name: 'Jeans (Express)', basePrice: 55 },
    { id: 'saree_express', name: 'Saree (Express)', basePrice: 200 },
    { id: 'dress_express', name: 'Dress (Express)', basePrice: 80 },
  ],
}

const timeSlots = [
  '09:00-11:00',
  '11:00-13:00',
  '13:00-15:00',
  '15:00-17:00',
  '17:00-19:00',
]

export default function NewOrderPage() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')
  const { user } = useAuthStore()
  
  // Hooks
  const { addresses, loading: addressesLoading, addAddress } = useAddresses()
  const { createOrder, calculatePricing, getTimeSlots, loading: orderLoading, pricingLoading } = useOrders()
  
  // State
  const [selectedService, setSelectedService] = useState('wash-fold')
  const [items, setItems] = useState<{ [key: string]: number }>({})
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [pickupAddressId, setPickupAddressId] = useState('')
  const [deliveryAddressId, setDeliveryAddressId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod')
  const [isExpress, setIsExpress] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [calculatedPricing, setCalculatedPricing] = useState<any>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    pincode: '',
    isDefault: false
  })

  // Set service based on URL parameter
  useEffect(() => {
    if (serviceParam && serviceTypes.find(s => s.id === serviceParam)) {
      setSelectedService(serviceParam)
    }
  }, [serviceParam])

  // Load time slots
  useEffect(() => {
    const loadTimeSlots = async () => {
      try {
        const slots = await getTimeSlots()
        setTimeSlots(slots)
      } catch (error) {
        console.error('Failed to load time slots:', error)
      }
    }
    loadTimeSlots()
  }, [])

  // Set default addresses when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !pickupAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0]
      setPickupAddressId(defaultAddress._id)
      setDeliveryAddressId(defaultAddress._id)
    }
  }, [addresses, pickupAddressId])

  // Calculate pricing when items or service changes
  useEffect(() => {
    const calculatePrice = async () => {
      const orderItems = Object.entries(items)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => {
          const currentItems = getCurrentItemTypes()
          const item = currentItems.find(i => i.id === itemId)
          return {
            itemType: itemId,
            service: selectedService === 'wash-fold' ? 'washing' : 
                    selectedService === 'dry-cleaning' ? 'dry_cleaning' : 
                    selectedService === 'laundry' ? 'washing' : 'washing',
            category: 'normal',
            quantity
          }
        })

      if (orderItems.length > 0) {
        try {
          const pricing = await calculatePricing(orderItems, isExpress || selectedService === 'express')
          setCalculatedPricing(pricing)
        } catch (error) {
          console.error('Failed to calculate pricing:', error)
        }
      } else {
        setCalculatedPricing(null)
      }
    }

    calculatePrice()
  }, [items, selectedService, isExpress, calculatePricing])

  const updateItemQuantity = (itemId: string, change: number) => {
    setItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }))
  }

  const getCurrentItemTypes = () => {
    return itemTypesByService[selectedService as keyof typeof itemTypesByService] || []
  }

  const getTotalItems = () => {
    return Object.values(items).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getCalculatedTotal = () => {
    return calculatedPricing?.orderTotal?.total || 0
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const address = await addAddress(newAddress)
      setPickupAddressId(address._id)
      setDeliveryAddressId(address._id)
      setShowAddressForm(false)
      setNewAddress({
        name: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        pincode: '',
        isDefault: false
      })
      toast.success('Address added successfully!')
    } catch (error) {
      console.error('Failed to add address:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (getTotalItems() === 0) {
      toast.error('Please select at least one item')
      return
    }
    
    if (!selectedDate) {
      toast.error('Please select a pickup date')
      return
    }
    
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot')
      return
    }
    
    if (!pickupAddressId || !deliveryAddressId) {
      toast.error('Please select pickup and delivery addresses')
      return
    }

    // Prepare order data
    const orderItems = Object.entries(items)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        itemType: itemId,
        service: selectedService === 'wash-fold' ? 'washing' : 
                selectedService === 'dry-cleaning' ? 'dry_cleaning' : 
                selectedService === 'laundry' ? 'washing' : 'washing',
        category: 'normal',
        quantity,
        specialInstructions: ''
      }))

    const orderData = {
      items: orderItems,
      pickupAddressId,
      deliveryAddressId,
      pickupDate: selectedDate,
      pickupTimeSlot: selectedTimeSlot,
      paymentMethod,
      isExpress: isExpress || selectedService === 'express',
      specialInstructions
    }

    try {
      await createOrder(orderData)
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {serviceParam ? `Book ${serviceTypes.find(s => s.id === serviceParam)?.name}` : 'Create New Order'}
          </h1>
          <p className="text-gray-600">
            {serviceParam 
              ? `Schedule your ${serviceTypes.find(s => s.id === serviceParam)?.name.toLowerCase()} pickup in just a few steps`
              : 'Schedule your laundry pickup in just a few steps'
            }
          </p>
          {serviceParam && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
              {(() => {
                const ServiceIcon = serviceTypes.find(s => s.id === serviceParam)?.icon
                return ServiceIcon ? <ServiceIcon className="w-4 h-4 mr-2" /> : null
              })()}
              {serviceTypes.find(s => s.id === serviceParam)?.name} Service
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Service
              {serviceParam && (
                <span className="ml-2 text-sm text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                  Pre-selected: {serviceTypes.find(s => s.id === serviceParam)?.name}
                </span>
              )}
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {serviceTypes.map((service) => {
                const isSelected = selectedService === service.id
                const colorClasses = {
                  blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
                  purple: isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
                  green: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
                  orange: isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300',
                  red: isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300',
                }
                
                const iconColorClasses = {
                  blue: isSelected ? 'text-blue-600' : 'text-gray-400',
                  purple: isSelected ? 'text-purple-600' : 'text-gray-400',
                  green: isSelected ? 'text-green-600' : 'text-gray-400',
                  orange: isSelected ? 'text-orange-600' : 'text-gray-400',
                  red: isSelected ? 'text-red-600' : 'text-gray-400',
                }

                return (
                  <div
                    key={service.id}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      colorClasses[service.color as keyof typeof colorClasses]
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {(() => {
                        const ServiceIcon = service.icon
                        return <ServiceIcon className={`w-8 h-8 ${iconColorClasses[service.color as keyof typeof iconColorClasses]}`} />
                      })()}
                      <span className="text-lg font-bold text-gray-800">₹{service.price}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Address Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pickup & Delivery Address</h2>
            
            {addressesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                <span className="ml-2 text-gray-600">Loading addresses...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pickup Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          pickupAddressId === address._id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPickupAddressId(address._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Home className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-800">{address.name}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.pincode}
                            </p>
                            <p className="text-sm text-gray-500">{address.phone}</p>
                          </div>
                          {pickupAddressId === address._id && (
                            <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pickupAddressId === deliveryAddressId}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDeliveryAddressId(pickupAddressId)
                          }
                        }}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Same as pickup address</span>
                    </label>
                  </div>
                  
                  {pickupAddressId !== deliveryAddressId && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            deliveryAddressId === address._id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDeliveryAddressId(address._id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Home className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-800">{address.name}</span>
                                {address.isDefault && (
                                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.pincode}
                              </p>
                              <p className="text-sm text-gray-500">{address.phone}</p>
                            </div>
                            {deliveryAddressId === address._id && (
                              <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Address Button */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddressForm(true)}
                    className="border-dashed border-2 border-gray-300 hover:border-teal-500 text-gray-600 hover:text-teal-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              </div>
            )}

            {/* Add Address Form Modal */}
            {showAddressForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
                        Set as default address
                      </label>
                    </div>
                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                        Add Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Item Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Items for {serviceTypes.find(s => s.id === selectedService)?.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {getCurrentItemTypes().map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.basePrice}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      disabled={!items[item.id] || items[item.id] === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{items[item.id] || 0}</span>
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {getCurrentItemTypes().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No items available for this service</p>
              </div>
            )}
          </div>

          {/* Schedule Pickup */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pickup Date</h2>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Slot</h2>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Express Service - Only show if not already express service */}
          {selectedService !== 'express' && (
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-medium text-gray-800">Express Upgrade</h3>
                  <p className="text-sm text-gray-600">Get your order back in 24 hours (+₹50 charge)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          )}

          {/* Express Service Info - Show if express service is selected */}
          {selectedService === 'express' && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-medium text-gray-800">Express Service Selected</h3>
                  <p className="text-sm text-gray-600">Same-day pickup and delivery with ₹50 express charge included</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('online')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-800">Online Payment</h3>
                      <p className="text-sm text-gray-600">Pay securely online</p>
                    </div>
                  </div>
                  {paymentMethod === 'online' && (
                    <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Instructions</h2>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special care instructions for your items..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            {pricingLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                <span className="ml-2 text-gray-600">Calculating pricing...</span>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{serviceTypes.find(s => s.id === selectedService)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span>Pickup Date:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedTimeSlot && (
                  <div className="flex justify-between">
                    <span>Time Slot:</span>
                    <span className="font-medium">{selectedTimeSlot}</span>
                  </div>
                )}
                
                {calculatedPricing && (
                  <>
                    <hr className="my-3 border-gray-300" />
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{calculatedPricing.orderTotal.subtotal}</span>
                    </div>
                    {calculatedPricing.orderTotal.expressCharge > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Express Charge:</span>
                        <span className="font-medium">₹{calculatedPricing.orderTotal.expressCharge}</span>
                      </div>
                    )}
                    {calculatedPricing.orderTotal.deliveryCharge > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span className="font-medium">₹{calculatedPricing.orderTotal.deliveryCharge}</span>
                      </div>
                    )}
                    {calculatedPricing.orderTotal.tax > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (18%):</span>
                        <span className="font-medium">₹{calculatedPricing.orderTotal.tax}</span>
                      </div>
                    )}
                  </>
                )}
                
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-teal-600">₹{getCalculatedTotal()}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={orderLoading || getTotalItems() === 0 || !selectedDate || !selectedTimeSlot || !pickupAddressId || !deliveryAddressId}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 mr-2" />
                  Schedule Pickup - ₹{getCalculatedTotal()}
                </>
              )}
            </Button>
            
            {getTotalItems() === 0 && (
              <p className="text-center text-gray-500 text-sm mt-3">
                Please select at least one item to continue
              </p>
            )}
            
            {!pickupAddressId && (
              <p className="text-center text-red-500 text-sm mt-3">
                Please select a pickup address
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}