'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  MapPin, 
  Shirt, 
  Sparkles, 
  Truck, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Headphones,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Users,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useHomepageStats } from '@/hooks/useStats'

// Hero Carousel Component
function HeroCarousel({ isAuthenticated, user }: { isAuthenticated: boolean, user: any }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: isAuthenticated ? `Welcome back, ${user?.name}!` : "Welcome to LaundryPro",
      subtitle: "India's #1 Laundry Service",
      description: isAuthenticated 
        ? "Ready to schedule your next laundry pickup? We're here to make your life easier!"
        : "Serving across 20+ Cities with over 20+ Outlets across the nation.",
      features: [
        { icon: Clock, text: "Schedule Collection Days" },
        { icon: Truck, text: "24-48 hours Delivery" },
        { icon: CreditCard, text: "Easy Payment Options" },
        { icon: Headphones, text: "Dedicated Customer Support" }
      ],
      image: "https://spinbee.in/wp-content/uploads/2025/07/slide.png",
      discount: "20%",
      primaryButton: isAuthenticated 
        ? { text: "Book New Order", icon: Truck, href: "/customer/orders/new" }
        : { text: "Schedule Free Pickup", icon: Truck, href: "/auth/register" },
      secondaryButton: { text: "Chat on WhatsApp", icon: Phone, href: "#" }
    },
    {
      id: 2,
      title: "Premium Dry Cleaning",
      subtitle: "Professional Care for Your Clothes",
      description: "Expert dry cleaning services with advanced technology and eco-friendly solutions.",
      features: [
        { icon: Shield, text: "100% Safe & Secure" },
        { icon: Sparkles, text: "Premium Quality Care" },
        { icon: Award, text: "Certified Professionals" },
        { icon: Star, text: "5-Star Rated Service" }
      ],
      image: "https://spinbee.in/wp-content/uploads/2025/07/women-slider.png",
      discount: "15%",
      primaryButton: isAuthenticated 
        ? { text: "Book Dry Cleaning", icon: Sparkles, href: "/customer/orders/new" }
        : { text: "Book Dry Cleaning", icon: Sparkles, href: "/auth/register" },
      secondaryButton: { text: "View Services", icon: ArrowRight, href: "#services" }
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto-slide functionality (disabled)
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     nextSlide()
  //   }, 5000) // Change slide every 5 seconds

  //   return () => clearInterval(timer)
  // }, [])

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slide Content */}
      <div className="grid lg:grid-cols-2 gap-4 items-center min-h-[580px] overflow-visible">
        {/* Left Content */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            {currentSlideData.subtitle}
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-5 leading-tight">
            {currentSlideData.title.split(' ').slice(0, 2).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              {currentSlideData.title.split(' ').slice(2).join(' ')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {currentSlideData.description}
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentSlideData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-lg p-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={currentSlideData.primaryButton.href}>
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                <currentSlideData.primaryButton.icon className="w-5 h-5 mr-2" />
                {currentSlideData.primaryButton.text}
              </Button>
            </Link>
            <Link href={currentSlideData.secondaryButton.href}>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <currentSlideData.secondaryButton.icon className="w-5 h-5 mr-2" />
                {currentSlideData.secondaryButton.text}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="relative animate-fade-in-right">
          {/* Spin Bee Style Discount Badge */}
          <div className={`absolute z-20 ${
            currentSlide === 1 ? 'top-4 right-4' : 'top-8 right-8'
          }`}>
            <div className="bg-white border-4 border-gray-800 rounded-full p-4 shadow-lg transform rotate-12">
              <div className="text-center">
                <div className="text-xs font-bold text-gray-800">GET UP TO</div>
                <div className="text-2xl font-bold text-orange-500">{currentSlideData.discount}</div>
                <div className="text-xs font-bold text-gray-800">DISCOUNT</div>
              </div>
            </div>
          </div>
          
          {/* Main Hero Image - Spin Bee Style */}
          <div className={`relative flex justify-center ${
            currentSlide === 1 ? 'h-auto items-start overflow-visible' : 'h-96 items-start overflow-visible'
          }`}>
            <img 
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className={`relative z-10 transition-all duration-500 ${
                currentSlide === 1 
                  ? 'w-auto max-w-none h-80 object-contain scale-[1.6] translate-y-16' // Second slide - moved further down
                  : 'w-auto max-w-none h-80 object-contain scale-[1.75]' // First slide - same size
              }`}
              onError={(e) => {
                console.log('❌ Image failed to load:', currentSlideData.image);
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
              onLoad={() => console.log('✅ Image loaded successfully:', currentSlideData.image)}
            />
          </div>
          
          {/* Decorative Stars - Spin Bee Style */}
          <div className="absolute top-16 left-8 animate-pulse">
            <Star className="w-8 h-8 text-teal-500 fill-teal-200" />
          </div>
          <div className="absolute bottom-20 right-12 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star className="w-6 h-6 text-green-500 fill-green-200" />
          </div>
        </div>
      </div>


    </div>
  )
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { stats, loading: statsLoading, error: statsError } = useHomepageStats()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">LaundryPro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-teal-500">Home</Link>
              <Link href="#services" className="text-gray-600 hover:text-teal-500">Services</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-teal-500">Pricing</Link>
              <Link href="#" className="text-gray-600 hover:text-teal-500">Help</Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.name}!</span>
                  <Link href="/customer/dashboard">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                      My Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Schedule Free Pickup
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-teal-500 rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-500 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-teal-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <HeroCarousel isAuthenticated={isAuthenticated} user={user} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-500 font-semibold mb-2">Right to Your Doorstep</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              We Collect, Clean, and Deliver Your<br />
              Laundry & Dry Cleaning
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At LaundryPro, we offer a seamless laundry and dry cleaning experience tailored 
              to your busy lifestyle. From pickup to delivery, every step is handled with 
              professionalism and care.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <CreditCard className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Online</h3>
                <p className="text-gray-600">Place your laundry request in just a few clicks.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <Truck className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pick Up</h3>
                <p className="text-gray-600">We collect your clothes right from your doorstep.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <Sparkles className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cleaning</h3>
                <p className="text-gray-600">Expert care with advanced cleaning technology.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Drop Off</h3>
                <p className="text-gray-600">Fresh, clean clothes delivered back to you on time.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span className="text-gray-700">Quick Pickup & Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span className="text-gray-700">Affordable Pricing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span className="text-gray-700">Eco-Friendly Cleaning Solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span className="text-gray-700">Real-Time Order Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span className="text-gray-700">Dedicated Customer Support</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">Join thousands of satisfied customers who trust us with their laundry needs.</p>
              <div className="flex gap-4">
                {isAuthenticated ? (
                  <Link href="/customer/orders/new">
                    <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                      <Truck className="w-5 h-5 mr-2" />
                      Book New Order
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/register">
                    <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                      <Truck className="w-5 h-5 mr-2" />
                      Schedule Free Pickup
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-500 font-semibold mb-2">Premium Laundry And Dry Clean Service in India</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Quality Cleaning with Great Savings!</h2>
            <p className="text-gray-600 max-w-4xl mx-auto">
              At LaundryPro, we take care of all your clothing needs — from everyday home wear to formal office attire — ensuring 
              each piece is cleaned with expert care. Our services go beyond garments, offering shoe cleaning, curtain cleaning, 
              carpet cleaning, and more to provide complete home care solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {stats ? `${stats.overview.totalCities}+` : '20+'}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Areas we Cover</h3>
              <p className="text-gray-600 mb-4">Locate your nearest LaundryPro store effortlessly.</p>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                Check Store
              </Button>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Shoe Cleaning</h3>
              <p className="text-gray-600 mb-4">Clean, fresh, and polished shoes every time.</p>
              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=shoe-cleaning">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Truck className="w-4 h-4 mr-2" />
                    Book Shoe Cleaning
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Truck className="w-4 h-4 mr-2" />
                    Schedule Now
                  </Button>
                </Link>
              )}
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Laundry</h3>
              <p className="text-gray-600 mb-4">Expert laundry service for perfectly washed and pressed garments.</p>
              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=laundry">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Truck className="w-4 h-4 mr-2" />
                    Book Laundry
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Truck className="w-4 h-4 mr-2" />
                    Schedule Now
                  </Button>
                </Link>
              )}
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dry Cleaning</h3>
              <p className="text-gray-600 mb-4">Expert dry cleaning to keep your clothes fresh and flawless.</p>
              {isAuthenticated ? (
                <Link href="/customer/orders/new?service=dry-cleaning">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Book Dry Cleaning
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white w-full group-hover:shadow-lg transition-all duration-300">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Schedule Now
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/customer/orders/new">
                  <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                    <Truck className="w-5 h-5 mr-2" />
                    Book New Order
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                    <Truck className="w-5 h-5 mr-2" />
                    Schedule Free Pickup
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 animate-pulse bg-white/20 rounded h-12 w-20 mx-auto"></div>
                  <div className="text-teal-100 animate-pulse bg-white/10 rounded h-4 w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : statsError ? (
            <div className="text-center text-white">
              <p className="text-lg mb-4">Unable to load latest statistics</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-teal-100">Happy Customers</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">20+</div>
                  <div className="text-teal-100">Cities Covered</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">1M+</div>
                  <div className="text-teal-100">Orders Completed</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">4.9</div>
                  <div className="text-teal-100">Average Rating</div>
                </div>
              </div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.totalCustomers.toLocaleString()}+
                </div>
                <div className="text-teal-100">Happy Customers</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.totalCities}+
                </div>
                <div className="text-teal-100">Cities Covered</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.completedOrders.toLocaleString()}+
                </div>
                <div className="text-teal-100">Orders Completed</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.averageRating}
                </div>
                <div className="text-teal-100">Average Rating</div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-500 font-semibold mb-2">Transparent Pricing</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Affordable Laundry & Dry Cleaning Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Quality service at competitive prices. No hidden charges, no surprises. 
              Choose the service that fits your needs and budget.
            </p>
          </div>

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
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Shirt/T-Shirt</span>
                  <span className="font-semibold text-blue-600">₹25</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Jeans/Trousers</span>
                  <span className="font-semibold text-blue-600">₹35</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Bedsheet (Single)</span>
                  <span className="font-semibold text-blue-600">₹40</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-700">Towel</span>
                  <span className="font-semibold text-blue-600">₹20</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">What's Included:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional washing</li>
                  <li>• Fabric softener treatment</li>
                  <li>• Neat folding & packaging</li>
                  <li>• 48-hour delivery</li>
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
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-gray-700">Formal Shirt</span>
                  <span className="font-semibold text-purple-600">₹60</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-gray-700">Suit (2-piece)</span>
                  <span className="font-semibold text-purple-600">₹250</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-gray-700">Saree (Silk)</span>
                  <span className="font-semibold text-purple-600">₹150</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-gray-700">Blazer/Jacket</span>
                  <span className="font-semibold text-purple-600">₹180</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium Features:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eco-friendly solvents</li>
                  <li>• Stain removal treatment</li>
                  <li>• Professional pressing</li>
                  <li>• Protective packaging</li>
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
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-700">Shirt (Express)</span>
                  <span className="font-semibold text-orange-600">₹45</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-700">Suit (Express)</span>
                  <span className="font-semibold text-orange-600">₹400</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-700">Jeans (Express)</span>
                  <span className="font-semibold text-orange-600">₹55</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-700">Express Charge</span>
                  <span className="font-semibold text-orange-600">+₹50</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Express Benefits:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Same-day pickup & delivery</li>
                  <li>• Priority processing</li>
                  <li>• Real-time tracking</li>
                  <li>• Quality guarantee</li>
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
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Additional Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Shoe Cleaning</h4>
                <p className="text-gray-600 text-sm mb-2">Professional shoe care</p>
                <p className="font-bold text-teal-600">₹80 - ₹150</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Curtain Cleaning</h4>
                <p className="text-gray-600 text-sm mb-2">Deep cleaning service</p>
                <p className="font-bold text-blue-600">₹200 - ₹500</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Carpet Cleaning</h4>
                <p className="text-gray-600 text-sm mb-2">Deep steam cleaning</p>
                <p className="font-bold text-purple-600">₹300 - ₹800</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Alterations</h4>
                <p className="text-gray-600 text-sm mb-2">Tailoring services</p>
                <p className="font-bold text-green-600">₹50 - ₹300</p>
              </div>
            </div>
          </div>

          {/* Pricing Features */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hidden Charges</h3>
              <p className="text-gray-600">Transparent pricing with no surprise fees. What you see is what you pay.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Payment</h3>
              <p className="text-gray-600">Pay online or cash on delivery. Multiple payment options available.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guaranteed or we'll redo your order for free.</p>
            </div>
          </div>

          {/* Bulk Discount Info */}
          <div className="mt-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Bulk Order Discounts</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">5%</div>
                <div className="text-teal-100">Orders above ₹500</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">10%</div>
                <div className="text-teal-100">Orders above ₹1000</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15%</div>
                <div className="text-teal-100">Orders above ₹2000</div>
              </div>
            </div>
            <p className="mt-4 text-teal-100">*Discounts applied automatically at checkout</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Experience Premium Care?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust LaundryPro for their laundry and dry cleaning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Book New Order
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
            )}
            <Link href="tel:+919876543210">
              <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50">
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LaundryPro</span>
              </div>
              <p className="text-gray-400 mb-4">Premium laundry and dry cleaning services at your doorstep across India.</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Wash & Fold</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Dry Cleaning</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Shoe Cleaning</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Curtain Cleaning</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@laundrypro.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Available in {stats ? `${stats.overview.totalCities}+` : '20+'} Cities</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LaundryPro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}