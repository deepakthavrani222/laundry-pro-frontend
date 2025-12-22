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
  Users,
  Headphones,
  Search,
  ArrowRight,
  Ticket,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <h4 className="text-lg font-semibold text-gray-800 pr-4">{question}</h4>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-teal-100' : 'bg-gray-100'}`}>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-teal-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
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
  const { isAuthenticated, user } = useAuthStore()
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
        answer: "We offer Wash & Fold, Dry Cleaning, Ironing, Steam Press, Starching, and Premium services for delicate fabrics. Each service is handled by trained professionals using quality products."
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

  const quickHelpCards = [
    {
      icon: Package,
      title: "Track Order",
      description: "Check real-time status of your laundry",
      link: isAuthenticated ? "/customer/orders" : "/auth/login",
      color: "bg-blue-500"
    },
    {
      icon: Ticket,
      title: "Raise Ticket",
      description: "Report an issue or get help",
      link: isAuthenticated ? "/customer/support/new" : "/auth/login",
      color: "bg-purple-500"
    },
    {
      icon: RefreshCw,
      title: "Request Refund",
      description: "Initiate refund for any order",
      link: isAuthenticated ? "/customer/support/new?category=payment" : "/auth/login",
      color: "bg-orange-500"
    },
    {
      icon: Headphones,
      title: "Live Support",
      description: "Chat with our support team",
      link: isAuthenticated ? "/customer/support" : "/auth/login",
      color: "bg-teal-500"
    }
  ]

  const categoryTabs = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'services', label: 'Services', icon: Sparkles }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <Headphones className="w-4 h-4" />
              <span>24/7 Customer Support Available</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How Can We <span className="text-cyan-200">Help You?</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Find answers to common questions, track your orders, or get in touch with our friendly support team.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-white/70 text-sm">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">&lt;2hr</div>
                <div className="text-white/70 text-sm">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-white/70 text-sm">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Quick Help Cards */}
      <section className="py-16 -mt-16 relative z-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickHelpCards.map((card, index) => (
              <Link key={index} href={card.link}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group cursor-pointer h-full flex flex-col">
                  <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 flex-grow">{card.description}</p>
                  <div className="flex items-center text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find Quick Answers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our most commonly asked questions to find the information you need.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id)
                  setOpenFAQ(0)
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === tab.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-4">
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
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our support team is always ready to assist you. Choose your preferred way to reach us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 text-center border border-teal-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-500 mb-4">Available 24/7 for urgent queries</p>
              <a href="tel:+911234567890" className="text-teal-600 font-semibold text-lg hover:text-teal-700">
                +91 123 456 7890
              </a>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-500 mb-4">We reply within 2 hours</p>
              <a href="mailto:support@laundrypro.com" className="text-purple-600 font-semibold text-lg hover:text-purple-700">
                support@laundrypro.com
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp</h3>
              <p className="text-gray-500 mb-4">Quick chat support</p>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold text-lg hover:text-green-700">
                Chat Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Promise</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                100% Satisfaction Guaranteed
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We stand behind our service quality. If you&apos;re not happy, we&apos;ll make it right.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Free Re-wash</h3>
                <p className="text-gray-400 text-sm">Not satisfied? We&apos;ll redo it for free</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Full Refund</h3>
                <p className="text-gray-400 text-sm">100% money back if still not happy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Damage Protection</h3>
                <p className="text-gray-400 text-sm">Full compensation for any damage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 to-cyan-500 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Premium Laundry?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of happy customers who trust LaundryPro for their laundry needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated ? (
                  <Link href="/customer/orders/new">
                    <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg">
                      Place New Order
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register">
                      <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LaundryPro</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm">© 2024 LaundryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
