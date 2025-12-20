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
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle
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

// Pricing Table Component with Category Tabs
function PricingTable({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [activeCategory, setActiveCategory] = useState('men')

  const categories = [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'household', label: 'Household' },
    { id: 'institutional', label: 'Institutional' },
    { id: 'others', label: 'Others' },
  ]

  const pricingData: Record<string, Array<{ garment: string; dryCleaning: number; steamPress: number; starch: number; alteration: number }>> = {
    men: [
      { garment: 'T Shirt', dryCleaning: 90, steamPress: 30, starch: 40, alteration: 2 },
      { garment: 'Jeans', dryCleaning: 120, steamPress: 40, starch: 50, alteration: 0 },
      { garment: 'Pants', dryCleaning: 90, steamPress: 30, starch: 40, alteration: 0 },
      { garment: 'Shirt', dryCleaning: 90, steamPress: 30, starch: 40, alteration: 0 },
      { garment: 'Coat', dryCleaning: 210, steamPress: 60, starch: 80, alteration: 0 },
      { garment: 'Jacket Half', dryCleaning: 130, steamPress: 40, starch: 50, alteration: 0 },
      { garment: 'Jacket', dryCleaning: 170, steamPress: 50, starch: 70, alteration: 0 },
      { garment: 'Blazer', dryCleaning: 210, steamPress: 60, starch: 80, alteration: 0 },
      { garment: 'Suit 2 Pcs', dryCleaning: 300, steamPress: 90, starch: 120, alteration: 0 },
      { garment: 'Suit 3 Pcs', dryCleaning: 380, steamPress: 110, starch: 150, alteration: 0 },
      { garment: 'Overcoat', dryCleaning: 320, steamPress: 100, starch: 100, alteration: 0 },
      { garment: 'Kurta', dryCleaning: 100, steamPress: 35, starch: 45, alteration: 0 },
      { garment: 'Sherwani', dryCleaning: 450, steamPress: 150, starch: 180, alteration: 0 },
    ],
    women: [
      { garment: 'Blouse', dryCleaning: 80, steamPress: 25, starch: 35, alteration: 0 },
      { garment: 'Saree (Cotton)', dryCleaning: 100, steamPress: 40, starch: 50, alteration: 0 },
      { garment: 'Saree (Silk)', dryCleaning: 150, steamPress: 60, starch: 70, alteration: 0 },
      { garment: 'Saree (Designer)', dryCleaning: 250, steamPress: 100, starch: 120, alteration: 0 },
      { garment: 'Salwar Suit', dryCleaning: 180, steamPress: 60, starch: 80, alteration: 0 },
      { garment: 'Lehenga', dryCleaning: 400, steamPress: 150, starch: 180, alteration: 0 },
      { garment: 'Dress', dryCleaning: 120, steamPress: 45, starch: 55, alteration: 0 },
      { garment: 'Gown', dryCleaning: 200, steamPress: 80, starch: 100, alteration: 0 },
      { garment: 'Kurti', dryCleaning: 90, steamPress: 30, starch: 40, alteration: 0 },
      { garment: 'Dupatta', dryCleaning: 60, steamPress: 25, starch: 30, alteration: 0 },
    ],
    kids: [
      { garment: 'T Shirt', dryCleaning: 60, steamPress: 20, starch: 25, alteration: 0 },
      { garment: 'Shirt', dryCleaning: 60, steamPress: 20, starch: 25, alteration: 0 },
      { garment: 'Pants', dryCleaning: 60, steamPress: 20, starch: 25, alteration: 0 },
      { garment: 'Jeans', dryCleaning: 80, steamPress: 25, starch: 30, alteration: 0 },
      { garment: 'Frock', dryCleaning: 90, steamPress: 30, starch: 35, alteration: 0 },
      { garment: 'Jacket', dryCleaning: 100, steamPress: 35, starch: 40, alteration: 0 },
      { garment: 'School Uniform', dryCleaning: 70, steamPress: 25, starch: 30, alteration: 0 },
    ],
    household: [
      { garment: 'Bedsheet (Single)', dryCleaning: 120, steamPress: 40, starch: 50, alteration: 0 },
      { garment: 'Bedsheet (Double)', dryCleaning: 180, steamPress: 60, starch: 70, alteration: 0 },
      { garment: 'Pillow Cover', dryCleaning: 40, steamPress: 15, starch: 20, alteration: 0 },
      { garment: 'Curtain (Small)', dryCleaning: 150, steamPress: 50, starch: 60, alteration: 0 },
      { garment: 'Curtain (Large)', dryCleaning: 250, steamPress: 80, starch: 100, alteration: 0 },
      { garment: 'Blanket (Single)', dryCleaning: 200, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Blanket (Double)', dryCleaning: 300, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Comforter', dryCleaning: 350, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Towel', dryCleaning: 50, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Table Cloth', dryCleaning: 100, steamPress: 35, starch: 45, alteration: 0 },
    ],
    institutional: [
      { garment: 'Hotel Bedsheet', dryCleaning: 100, steamPress: 35, starch: 45, alteration: 0 },
      { garment: 'Hotel Towel', dryCleaning: 40, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Restaurant Napkin', dryCleaning: 25, steamPress: 10, starch: 15, alteration: 0 },
      { garment: 'Table Cloth', dryCleaning: 80, steamPress: 30, starch: 40, alteration: 0 },
      { garment: 'Uniform', dryCleaning: 80, steamPress: 30, starch: 40, alteration: 0 },
      { garment: 'Apron', dryCleaning: 50, steamPress: 20, starch: 25, alteration: 0 },
    ],
    others: [
      { garment: 'Leather Jacket', dryCleaning: 500, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Woolen Sweater', dryCleaning: 150, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Tie', dryCleaning: 50, steamPress: 20, starch: 0, alteration: 0 },
      { garment: 'Scarf', dryCleaning: 60, steamPress: 25, starch: 0, alteration: 0 },
      { garment: 'Cap/Hat', dryCleaning: 80, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Bag (Small)', dryCleaning: 200, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Bag (Large)', dryCleaning: 350, steamPress: 0, starch: 0, alteration: 0 },
      { garment: 'Soft Toy', dryCleaning: 150, steamPress: 0, starch: 0, alteration: 0 },
    ],
  }

  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Pricing</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transparent pricing for all our services. Select a category to view detailed pricing.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Tabs - Left Side */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Table - Right Side */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b">Garment</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 border-b">Dry Cleaning</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 border-b">Steam Press</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 border-b">Starch</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 border-b">Alteration</th>
              </tr>
            </thead>
            <tbody>
              {pricingData[activeCategory]?.map((item, index) => (
                <tr 
                  key={index} 
                  className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 px-6 text-gray-800">{item.garment}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{item.dryCleaning > 0 ? `₹${item.dryCleaning}` : '-'}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{item.steamPress > 0 ? `₹${item.steamPress}` : '-'}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{item.starch > 0 ? `₹${item.starch}` : '-'}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{item.alteration > 0 ? `₹${item.alteration}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="text-center mt-8">
        <Link href={isAuthenticated ? "/customer/orders/new" : "/auth/register"}>
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8">
            <Truck className="w-5 h-5 mr-2" />
            Book Service Now
          </Button>
        </Link>
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
      <PublicHeader />

      {/* Hero Section with Video Background */}
      <section className="relative py-16 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/80 via-cyan-500/70 to-blue-500/80"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transparent <span className="text-yellow-300">Pricing</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Quality laundry and dry cleaning services at competitive prices. 
            No hidden charges, no surprises - just honest, affordable pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  <Truck className="w-5 h-5 mr-2" />
                  Book Service Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            )}
            <Link href="https://wa.me/919876543210" target="_blank">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Pricing Table with Category Tabs */}
          <PricingTable isAuthenticated={isAuthenticated} />

          {/* Disclaimer */}
          <p className="text-center text-gray-800 text-lg font-semibold mb-12">
            *Prices may vary based on fabric type, stains, and special requirements. Final pricing will be confirmed at pickup.
          </p>

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
              <Button size="lg" className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-teal-600">
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