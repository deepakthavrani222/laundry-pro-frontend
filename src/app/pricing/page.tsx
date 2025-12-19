'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Shirt, 
  Sparkles, 
  CheckCircle, 
  CreditCard, 
  Truck,
  Zap,
  Award,
  Shield,
  Users,
  Star,
  ArrowLeft,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

// FAQ Component
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <h4 className="text-lg font-semibold text-gray-800 pr-4">{question}</h4>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-teal-500 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
          )}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  const { isAuthenticated } = useAuthStore()
  const [openFAQ, setOpenFAQ] = useState<number | null>(0) // First FAQ open by default

  const faqData = [
    {
      question: "Do you charge for pickup and delivery?",
      answer: "No, pickup and delivery are completely free for all orders above ₹200. For orders below ₹200, a nominal charge of ₹30 applies. We believe in transparent pricing with no hidden delivery fees."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment options for your convenience: Cash on Delivery (COD), UPI payments, credit/debit cards (Visa, Mastercard, RuPay), and popular digital wallets like Paytm, PhonePe, and Google Pay."
    },
    {
      question: "Is there a minimum order value?",
      answer: "No minimum order value required! You can place orders for even a single item. However, orders above ₹200 qualify for free pickup and delivery service."
    },
    {
      question: "Do you offer same-day service?",
      answer: "Yes! Our Express Service provides same-day pickup and delivery for urgent needs. An additional express charge of ₹50 applies, and the service is available Monday to Saturday before 2 PM."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 100% satisfaction guarantee. If you're not completely happy with our service, we'll redo your order for free. If you're still not satisfied, we provide a full refund - no questions asked."
    },
    {
      question: "How do bulk discounts work?",
      answer: "Bulk discounts are automatically applied at checkout based on your order value: 5% discount for orders above ₹500, 10% discount for orders above ₹1000, and 15% discount for orders above ₹2000. No coupon codes needed!"
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve 5+ major cities across India with plans to expand further. Check our service areas on the homepage or contact us to see if we deliver to your location."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is placed, you'll receive SMS and email updates at every stage. You can also track your order in real-time through your customer dashboard or by calling our support team."
    },
    {
      question: "What if an item gets damaged or lost?",
      answer: "While rare, if any item gets damaged during our process or goes missing, we provide full compensation based on the item's declared value. We also have comprehensive insurance coverage for all orders."
    },
    {
      question: "Do you handle delicate fabrics?",
      answer: "Absolutely! Our dry cleaning service specializes in delicate fabrics like silk, wool, and designer garments. We use eco-friendly solvents and have trained professionals who understand fabric care requirements."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 hover:text-teal-500">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">LaundryPro</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href="/customer/dashboard">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Quality laundry and dry cleaning services at competitive prices. 
            No hidden charges, no surprises - just honest, affordable pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                  <Truck className="w-5 h-5 mr-2" />
                  Book Service Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            )}
            <Link href="tel:+919876543210">
              <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50">
                <Phone className="w-5 h-5 mr-2" />
                Call for Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Service Categories */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Wash & Fold */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Wash & Fold</h3>
                <p className="text-gray-600">Professional washing and folding service</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Shirt/T-Shirt</span>
                  <span className="font-semibold text-blue-600 text-lg">₹25</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Jeans/Trousers</span>
                  <span className="font-semibold text-blue-600 text-lg">₹35</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Bedsheet (Single)</span>
                  <span className="font-semibold text-blue-600 text-lg">₹40</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Bedsheet (Double)</span>
                  <span className="font-semibold text-blue-600 text-lg">₹60</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Towel</span>
                  <span className="font-semibold text-blue-600 text-lg">₹20</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-100">
                  <span className="text-gray-700">Pillow Cover</span>
                  <span className="font-semibold text-blue-600 text-lg">₹15</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">What's Included:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional washing with quality detergent</li>
                  <li>• Fabric softener treatment</li>
                  <li>• Neat folding & protective packaging</li>
                  <li>• 48-hour delivery guarantee</li>
                </ul>
              </div>

              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=wash-fold">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    Book Wash & Fold
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Dry Cleaning */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-6 mt-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Dry Cleaning</h3>
                <p className="text-gray-600">Premium dry cleaning for delicate fabrics</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Formal Shirt</span>
                  <span className="font-semibold text-purple-600 text-lg">₹60</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Suit (2-piece)</span>
                  <span className="font-semibold text-purple-600 text-lg">₹250</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Saree (Cotton)</span>
                  <span className="font-semibold text-purple-600 text-lg">₹100</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Saree (Silk)</span>
                  <span className="font-semibold text-purple-600 text-lg">₹150</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Blazer/Jacket</span>
                  <span className="font-semibold text-purple-600 text-lg">₹180</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-100">
                  <span className="text-gray-700">Dress/Gown</span>
                  <span className="font-semibold text-purple-600 text-lg">₹120</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium Features:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eco-friendly dry cleaning solvents</li>
                  <li>• Advanced stain removal treatment</li>
                  <li>• Professional pressing & finishing</li>
                  <li>• Protective garment bags</li>
                </ul>
              </div>

              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=dry-cleaning">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Book Dry Cleaning
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Express Service */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Express Service</h3>
                <p className="text-gray-600">Same-day delivery for urgent needs</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-orange-100">
                  <span className="text-gray-700">Shirt (Express)</span>
                  <span className="font-semibold text-orange-600 text-lg">₹45</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-100">
                  <span className="text-gray-700">Suit (Express)</span>
                  <span className="font-semibold text-orange-600 text-lg">₹400</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-100">
                  <span className="text-gray-700">Jeans (Express)</span>
                  <span className="font-semibold text-orange-600 text-lg">₹55</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-100">
                  <span className="text-gray-700">Saree (Express)</span>
                  <span className="font-semibold text-orange-600 text-lg">₹200</span>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-800 font-medium">Express Charge</span>
                    <span className="font-bold text-orange-600 text-lg">+₹50</span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">Applied to all express orders</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Express Benefits:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Same-day pickup & delivery</li>
                  <li>• Priority processing queue</li>
                  <li>• Real-time order tracking</li>
                  <li>• 100% quality guarantee</li>
                </ul>
              </div>

              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=express">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Book Express
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">Additional Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Shoe Cleaning</h4>
                <p className="text-gray-600 text-sm mb-4">Professional shoe care and polishing</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Leather Shoes</span>
                    <span className="font-bold text-teal-600">₹150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sports Shoes</span>
                    <span className="font-bold text-teal-600">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formal Shoes</span>
                    <span className="font-bold text-teal-600">₹120</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Curtain Cleaning</h4>
                <p className="text-gray-600 text-sm mb-4">Deep cleaning for all curtain types</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Small (per panel)</span>
                    <span className="font-bold text-blue-600">₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medium (per panel)</span>
                    <span className="font-bold text-blue-600">₹300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Large (per panel)</span>
                    <span className="font-bold text-blue-600">₹500</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Carpet Cleaning</h4>
                <p className="text-gray-600 text-sm mb-4">Deep steam cleaning service</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Small (up to 4x6)</span>
                    <span className="font-bold text-purple-600">₹300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medium (up to 6x9)</span>
                    <span className="font-bold text-purple-600">₹500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Large (up to 9x12)</span>
                    <span className="font-bold text-purple-600">₹800</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Alterations</h4>
                <p className="text-gray-600 text-sm mb-4">Professional tailoring services</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hemming</span>
                    <span className="font-bold text-green-600">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resizing</span>
                    <span className="font-bold text-green-600">₹150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Complex Alterations</span>
                    <span className="font-bold text-green-600">₹300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Features */}
          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hidden Charges</h3>
              <p className="text-gray-600">Transparent pricing with no surprise fees. What you see is what you pay.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Payment</h3>
              <p className="text-gray-600">Pay online or cash on delivery. Multiple payment options available.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guaranteed or we'll redo your order for free.</p>
            </div>
          </div>

          {/* Bulk Discount Info */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white text-center mb-12">
            <h3 className="text-3xl font-bold mb-6">Bulk Order Discounts</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">5%</div>
                <div className="text-teal-100 text-lg">Orders above ₹500</div>
                <p className="text-teal-200 text-sm mt-2">Perfect for weekly laundry</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">10%</div>
                <div className="text-teal-100 text-lg">Orders above ₹1000</div>
                <p className="text-teal-200 text-sm mt-2">Great for family orders</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">15%</div>
                <div className="text-teal-100 text-lg">Orders above ₹2000</div>
                <p className="text-teal-200 text-sm mt-2">Best value for bulk orders</p>
              </div>
            </div>
            <p className="mt-6 text-teal-100">*Discounts applied automatically at checkout</p>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Got questions? We've got answers! Find everything you need to know about our services, pricing, and policies.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4">
                {faqData.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === index}
                    onToggle={() => toggleFAQ(index)}
                  />
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h4>
                <p className="text-gray-600 mb-6">
                  Our friendly customer support team is here to help you 24/7
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="tel:+919876543210">
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us: +91 98765 43210
                    </Button>
                  </Link>
                  <Link href="mailto:support@laundrypro.com">
                    <Button variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience Premium Care?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust LaundryPro for their laundry and dry cleaning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Book Service Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
            )}
            <Link href="mailto:support@laundrypro.com">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-teal-600">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">LaundryPro</span>
          </div>
          <p className="text-gray-400 mb-4">Premium laundry and dry cleaning services at your doorstep.</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">Help</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
            <p>&copy; 2024 LaundryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}