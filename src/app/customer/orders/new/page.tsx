'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Shirt, 
  Package, 
  Calendar, 
  MapPin, 
  Plus,
  Minus,
  Clock,
  Truck,
  Sparkles,
  Award,
  Home,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Phone,
  CheckCircle
} from 'lucide-react'
import { useAddresses } from '@/hooks/useAddresses'
import { useOrders } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const serviceTypes = [
  { id: 'wash_fold', name: 'Wash & Fold', icon: Shirt, price: 30, description: 'Fresh, clean, neatly folded clothes', color: 'blue' },
  { id: 'wash_iron', name: 'Wash & Iron', icon: Sparkles, price: 40, description: 'Clean, crisp, wrinkle-free garments', color: 'purple' },
  { id: 'premium_laundry', name: 'Premium Laundry', icon: Award, price: 60, description: 'Gentle, safe care for special fabrics', color: 'green' },
  { id: 'dry_clean', name: 'Dry Clean', icon: Package, price: 80, description: 'Expert, delicate care for formal wear', color: 'orange' },
  { id: 'steam_press', name: 'Steam Press', icon: Clock, price: 20, description: 'Smooth, polished finish with steam', color: 'red' },
  { id: 'starching', name: 'Starching', icon: Home, price: 25, description: 'Perfect stiffness for cottons & sarees', color: 'cyan' },
  { id: 'premium_steam_press', name: 'Premium Steam Press', icon: Truck, price: 35, description: 'Extra-fine press for premium outfits', color: 'pink' },
  { id: 'premium_dry_clean', name: 'Premium Dry Clean', icon: Sparkles, price: 120, description: 'Luxury care for branded clothing', color: 'indigo' },
]

const itemTypesByService: Record<string, Array<{ id: string; name: string; basePrice: number }>> = {
  'wash_fold': [
    { id: 'mens_shirt', name: "Men's Shirt", basePrice: 25 },
    { id: 'womens_shirt', name: "Women's Shirt", basePrice: 25 },
    { id: 'tshirt', name: 'T-Shirt', basePrice: 20 },
    { id: 'trousers', name: 'Trousers/Pants', basePrice: 30 },
    { id: 'jeans', name: 'Jeans', basePrice: 35 },
    { id: 'bedsheet_single', name: 'Bed Sheet (Single)', basePrice: 40 },
    { id: 'bedsheet_double', name: 'Bed Sheet (Double)', basePrice: 60 },
    { id: 'towel', name: 'Towel', basePrice: 20 },
    { id: 'pillow_cover', name: 'Pillow Cover', basePrice: 15 },
  ],
  'wash_iron': [
    { id: 'mens_shirt', name: "Men's Shirt", basePrice: 35 },
    { id: 'womens_shirt', name: "Women's Shirt", basePrice: 35 },
    { id: 'tshirt', name: 'T-Shirt', basePrice: 25 },
    { id: 'trousers', name: 'Trousers/Pants', basePrice: 40 },
    { id: 'jeans', name: 'Jeans', basePrice: 45 },
    { id: 'dress', name: 'Dress', basePrice: 50 },
    { id: 'kurti', name: 'Kurti', basePrice: 40 },
  ],
  'premium_laundry': [
    { id: 'silk_shirt', name: 'Silk Shirt', basePrice: 80 },
    { id: 'silk_saree', name: 'Silk Saree', basePrice: 150 },
    { id: 'woolen_sweater', name: 'Woolen Sweater', basePrice: 100 },
    { id: 'cashmere', name: 'Cashmere Item', basePrice: 200 },
    { id: 'linen_shirt', name: 'Linen Shirt', basePrice: 70 },
    { id: 'designer_dress', name: 'Designer Dress', basePrice: 180 },
  ],
  'dry_clean': [
    { id: 'formal_shirt', name: 'Formal Shirt', basePrice: 60 },
    { id: 'suit_2piece', name: 'Suit (2-piece)', basePrice: 250 },
    { id: 'blazer', name: 'Blazer/Jacket', basePrice: 180 },
    { id: 'saree_cotton', name: 'Saree (Cotton)', basePrice: 100 },
    { id: 'saree_silk', name: 'Saree (Silk)', basePrice: 150 },
    { id: 'dress_gown', name: 'Dress/Gown', basePrice: 120 },
    { id: 'curtains', name: 'Curtains (per panel)', basePrice: 200 },
    { id: 'coat', name: 'Coat/Overcoat', basePrice: 220 },
  ],
  'steam_press': [
    { id: 'shirt_press', name: 'Shirt', basePrice: 15 },
    { id: 'trousers_press', name: 'Trousers', basePrice: 20 },
    { id: 'saree_press', name: 'Saree', basePrice: 40 },
    { id: 'suit_press', name: 'Suit (2-piece)', basePrice: 60 },
    { id: 'dress_press', name: 'Dress', basePrice: 30 },
    { id: 'kurti_press', name: 'Kurti', basePrice: 20 },
  ],
  'starching': [
    { id: 'cotton_shirt_starch', name: 'Cotton Shirt', basePrice: 25 },
    { id: 'cotton_saree_starch', name: 'Cotton Saree', basePrice: 50 },
    { id: 'dhoti_starch', name: 'Dhoti', basePrice: 30 },
    { id: 'kurta_starch', name: 'Kurta', basePrice: 30 },
    { id: 'bedsheet_starch', name: 'Bed Sheet', basePrice: 45 },
  ],
  'premium_steam_press': [
    { id: 'silk_saree_press', name: 'Silk Saree', basePrice: 80 },
    { id: 'designer_suit_press', name: 'Designer Suit', basePrice: 100 },
    { id: 'lehenga_press', name: 'Lehenga', basePrice: 150 },
    { id: 'sherwani_press', name: 'Sherwani', basePrice: 120 },
    { id: 'wedding_dress_press', name: 'Wedding Dress', basePrice: 200 },
  ],
  'premium_dry_clean': [
    { id: 'designer_suit', name: 'Designer Suit', basePrice: 400 },
    { id: 'bridal_lehenga', name: 'Bridal Lehenga', basePrice: 800 },
    { id: 'sherwani', name: 'Sherwani', basePrice: 500 },
    { id: 'designer_saree', name: 'Designer Saree', basePrice: 350 },
    { id: 'luxury_coat', name: 'Luxury Coat', basePrice: 450 },
    { id: 'evening_gown', name: 'Evening Gown', basePrice: 400 },
  ],
}

const STEPS = [
  { id: 1, title: 'Select Items' },
  { id: 2, title: 'Address' },
  { id: 3, title: 'Schedule' },
  { id: 4, title: 'Confirm' },
]

export default function NewOrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceParam = searchParams.get('service')
  const { user } = useAuthStore()
  
  // Hooks
  const { addresses, loading: addressesLoading, addAddress } = useAddresses()
  const { createOrder, calculatePricing, getTimeSlots, loading: orderLoading, pricingLoading } = useOrders()
  
  // Step state
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
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
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<any>(null)
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
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0]
      if (!pickupAddressId || !addresses.find(a => a._id === pickupAddressId)) {
        setPickupAddressId(defaultAddress._id)
      }
      if (!deliveryAddressId || !addresses.find(a => a._id === deliveryAddressId)) {
        setDeliveryAddressId(defaultAddress._id)
      }
    }
  }, [addresses, pickupAddressId, deliveryAddressId])

  // Calculate pricing when items change
  useEffect(() => {
    const calculatePrice = async () => {
      const orderItems = Object.entries(items)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => {
          return {
            itemType: itemId,
            service: selectedService,
            category: 'normal',
            quantity
          }
        })

      if (orderItems.length > 0) {
        try {
          const pricing = await calculatePricing(orderItems, isExpress)
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
    return itemTypesByService[selectedService] || []
  }

  const getTotalItems = () => {
    return Object.values(items).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getCalculatedTotal = () => {
    return calculatedPricing?.orderTotal?.total || 0
  }

  const getSelectedAddress = () => {
    return addresses.find(a => a._id === pickupAddressId)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const address = await addAddress(newAddress)
      if (address && address._id) {
        setPickupAddressId(address._id)
        setDeliveryAddressId(address._id)
      }
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
    } catch (error) {
      console.error('Failed to add address:', error)
    }
  }

  const handleSubmit = async () => {
    const orderItems = Object.entries(items)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({
        itemType: itemId,
        service: selectedService,
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
      isExpress,
      specialInstructions
    }

    try {
      const order = await createOrder(orderData)
      setCreatedOrder(order)
      setOrderSuccess(true)
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return getTotalItems() > 0
      case 2:
        return pickupAddressId && deliveryAddressId
      case 3:
        return selectedDate && selectedTimeSlot
      case 4:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 4) {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closeModal = () => {
    router.push('/')
  }


  // Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
            <div className="h-full bg-teal-500 w-full"></div>
          </div>

          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center pt-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pickup has been scheduled</h2>
            <p className="text-gray-500 mb-6">Please keep your items ready!</p>

            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric',
                  weekday: 'long'
                }) : ''}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-gray-400" />
                <span>{selectedTimeSlot}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setOrderSuccess(false)
                  setCurrentStep(3)
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={closeModal}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={currentStep > 1 ? prevStep : closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {STEPS[currentStep - 1].title}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Step 1: Select Items */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Service Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value)
                    setItems({})
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {serviceTypes.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {getCurrentItemTypes().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">₹{item.basePrice}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        disabled={!items[item.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{items[item.id] || 0}</span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {getTotalItems() > 0 && (
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                  {calculatedPricing && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Estimated Total:</span>
                      <span className="font-bold text-teal-600">₹{getCalculatedTotal()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {addressesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No addresses saved</p>
                  <Button onClick={() => setShowAddressForm(true)} className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pickup Address</label>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          pickupAddressId === address._id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setPickupAddressId(address._id)
                          setDeliveryAddressId(address._id)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{address.name}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {address.phone}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}, {address.city} - {address.pincode}
                            </p>
                          </div>
                          {pickupAddressId === address._id && (
                            <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-600 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Selected Address Summary */}
              {getSelectedAddress() && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">{getSelectedAddress()?.name}</span>
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      Change Address
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Phone className="w-3 h-3 mr-1" />
                    {getSelectedAddress()?.phone}
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                    {getSelectedAddress()?.addressLine1}, {getSelectedAddress()?.city} - {getSelectedAddress()?.pincode}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Time
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add notes for pickup
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="example: call before pickup"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}


          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Order Summary</h3>
                
                {/* Items */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  {Object.entries(items)
                    .filter(([_, qty]) => qty > 0)
                    .map(([itemId, qty]) => {
                      const item = getCurrentItemTypes().find(i => i.id === itemId)
                      return (
                        <div key={itemId} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item?.name} x {qty}</span>
                          <span className="font-medium">₹{(item?.basePrice || 0) * qty}</span>
                        </div>
                      )
                    })}
                </div>

                {/* Address */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Pickup Address</div>
                  <div className="font-medium text-gray-800">{getSelectedAddress()?.name}</div>
                  <div className="text-sm text-gray-600">
                    {getSelectedAddress()?.addressLine1}, {getSelectedAddress()?.city}
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Pickup Schedule</div>
                  <div className="font-medium text-gray-800">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-600">{selectedTimeSlot}</div>
                </div>

                {/* Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-800">Cash on Delivery</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        paymentMethod === 'online'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-800">Online</div>
                    </button>
                  </div>
                </div>

                {/* Total */}
                {calculatedPricing && (
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{calculatedPricing.orderTotal.subtotal}</span>
                    </div>
                    {calculatedPricing.orderTotal.deliveryCharge > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Delivery</span>
                        <span>₹{calculatedPricing.orderTotal.deliveryCharge}</span>
                      </div>
                    )}
                    {calculatedPricing.orderTotal.tax > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tax</span>
                        <span>₹{calculatedPricing.orderTotal.tax}</span>
                      </div>
                    )}
                    <hr className="my-2 border-teal-200" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-teal-600">₹{getCalculatedTotal()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            onClick={nextStep}
            disabled={!canProceed() || orderLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-full disabled:opacity-50"
          >
            {orderLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentStep === 4 ? (
              <>
                Confirm Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
              <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City *"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
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
