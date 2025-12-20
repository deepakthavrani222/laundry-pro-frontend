'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MessageCircle,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Truck,
  CreditCard,
  Shield,
  Star,
  FileText,
  AlertCircle,
  CheckCircle,
  Package,
  RefreshCw,
  Users
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'

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

export default function HelpPage() {
  const { isAuthenticated } = useAuthStore()
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('general')

  const faqCategories = {
    general: [
      {
        question: "How does LaundryPro work?",
        answer: "LaundryPro makes laundry simple! Just place an order online, schedule a pickup time, and our team will collect your clothes from your doorstep. We clean them professionally and deliver them back fresh and folded within 24-48 hours."
      },
      {
        question: "What areas do you serve?",
        answer: "We currently serve 5+ major cities across India including Delhi NCR, Mumbai, Bangalore, Hyderabad, and Chennai. We're constantly expanding to new areas. Check our service availability by entering your pincode on the homepage."
      },
      {
        question: "What are your operating hours?",
        answer: "Our pickup and delivery services operate from 8 AM to 9 PM, 7 days a week. Customer support is available 24/7 via phone, email, and WhatsApp."
      },
      {
        question: "How do I track my order?",
        answer: "Once your order is placed, you'll receive SMS and email updates at every stage. You can also track your order in real-time through your customer dashboard or by calling our support team."
      }
    ],
    orders: [
      {
        question: "How do I place an order?",
        answer: "You can place an order through our website or mobile app. Simply select your service type, add items, choose pickup/delivery times, and confirm. It takes less than 2 minutes!"
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Yes! You can modify or cancel your order up to 2 hours before the scheduled pickup time. Go to 'My Orders' in your dashboard and select the order you want to change."
      },
      {
        question: "What is the minimum order value?",
        answer: "There's no minimum order value! You can place orders for even a single item. However, orders above ₹200 qualify for free pickup and delivery."
      },
      {
        question: "Do you offer same-day service?",
        answer: "Yes! Our Express Service provides same-day pickup and delivery for urgent needs. An additional express charge of ₹50 applies. Orders must be placed before 2 PM for same-day delivery."
      }
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept Cash on Delivery (COD), UPI payments, credit/debit cards (Visa, Mastercard, RuPay), and digital wallets like Paytm, PhonePe, and Google Pay."
      },
      {
        question: "Is online payment secure?",
        answer: "Absolutely! We use industry-standard SSL encryption and partner with trusted payment gateways like Razorpay to ensure your payment information is always secure."
      },
      {
        question: "Do you offer any discounts?",
        answer: "Yes! We offer bulk order discounts: 5% off on orders above ₹500, 10% off above ₹1000, and 15% off above ₹2000. Discounts are applied automatically at checkout."
      },
      {
        question: "Can I get a refund?",
        answer: "If you're not satisfied with our service, we'll redo your order for free. If you're still not happy, we provide a full refund within 7 business days. Contact our support team to initiate a refund."
      }
    ],
    services: [
      {
        question: "What services do you offer?",
        answer: "We offer Wash & Fold, Dry Cleaning, Ironing, Shoe Cleaning, Curtain Cleaning, Carpet Cleaning, and Alterations. Each service is handled by trained professionals using quality products."
      },
      {
        question: "How do you handle delicate fabrics?",
        answer: "Our dry cleaning service specializes in delicate fabrics like silk, wool, cashmere, and designer garments. We use eco-friendly solvents and have trained professionals who understand fabric care requirements."
      },
      {
        question: "Do you provide stain removal?",
        answer: "Yes! Stain removal is included in our dry cleaning service. For tough stains, our experts use specialized treatments. Please inform us about any specific stains when placing your order."
      },
      {
        question: "What if my clothes get damaged?",
        answer: "While rare, if any item gets damaged during our process, we provide full compensation based on the item's declared value. We also have comprehensive insurance coverage for all orders."
      }
    ]
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const currentFAQs = faqCategories[activeCategory as keyof typeof faqCategories]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">Help You?</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to common questions, get support, or contact our team. 
            We're here to make your laundry experience seamless.
          </p>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Order</h3>
              <p className="text-gray-600 text-sm mb-4">Check your order status in real-time</p>
              {isAuthenticated ? (
                <Link href="/customer/orders">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    View Orders
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Login to Track
                  </Button>
                </Link>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Returns & Refunds</h3>
              <p className="text-gray-600 text-sm mb-4">100% satisfaction guarantee</p>
              <Link href="#refund-policy">
                <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Issues</h3>
              <p className="text-gray-600 text-sm mb-4">Secure payment support</p>
              <Link href="#faq">
                <Button size="sm" variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
                  Get Help
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Report Issue</h3>
              <p className="text-gray-600 text-sm mb-4">Something went wrong?</p>
              <Link href="#contact">
                <Button size="sm" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our most common questions or contact us for more help.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { id: 'general', label: 'General', icon: HelpCircle },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'payment', label: 'Payment', icon: CreditCard },
              { id: 'services', label: 'Services', icon: Sparkles }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenFAQ(0) }}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {currentFAQs.map((faq, index) => (
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Available 24/7 for your queries</p>
              <a href="tel:+919876543210" className="text-2xl font-bold text-teal-600 hover:text-teal-700">
                +91 98765 43210
              </a>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">We reply within 24 hours</p>
              <a href="mailto:support@laundrypro.com" className="text-lg font-bold text-blue-600 hover:text-blue-700">
                support@laundrypro.com
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Quick chat support</p>
              <a href="https://wa.me/919876543210" target="_blank" className="text-lg font-bold text-green-600 hover:text-green-700">
                Chat Now
              </a>
            </div>
          </div>

          {/* Office Info */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Head Office</h3>
                  <p className="text-gray-600">
                    LaundryPro Headquarters<br />
                    123, Business Park, Sector 62<br />
                    Noida, Uttar Pradesh - 201301
                  </p>
                  <div className="flex items-center space-x-2 mt-3 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy */}
      <section id="refund-policy" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Guarantee</h2>
              <p className="text-gray-600">Your satisfaction is our top priority</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
                <p className="text-gray-600 text-sm">Not satisfied? We'll redo your order for free.</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Refunds</h3>
                <p className="text-gray-600 text-sm">Full refund within 7 days if still not happy.</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Damage Protection</h3>
                <p className="text-gray-600 text-sm">Full compensation for any damaged items.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Our friendly support team is always ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="tel:+919876543210">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </Link>
            <Link href="https://wa.me/919876543210" target="_blank">
              <Button size="lg" className="bg-green-500 text-white hover:bg-green-600">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Chat
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
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
            <p>&copy; 2024 LaundryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
