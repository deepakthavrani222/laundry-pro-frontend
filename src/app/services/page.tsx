'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PublicHeader from '@/components/layout/PublicHeader'
import { 
  Shirt, 
  Sparkles, 
  Award, 
  Package, 
  Clock, 
  Truck,
  Phone,
  CheckCircle,
  Star,
  ArrowRight,
  Smartphone,
  WashingMachine,
  ShirtIcon,
  User
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState, useEffect, useRef } from 'react'

const services = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold',
    icon: Shirt,
    description: 'Regular washing and folding service for everyday clothes',
    price: 'Starting ₹25/item',
    features: ['Same day pickup', 'Eco-friendly detergents', 'Neatly folded'],
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-500'
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    icon: Sparkles,
    description: 'Professional dry cleaning for delicate and formal wear',
    price: 'Starting ₹60/item',
    features: ['Expert care', 'Stain removal', 'Premium finish'],
    color: 'purple',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-500'
  },
  {
    id: 'laundry',
    name: 'Laundry Service',
    icon: Package,
    description: 'Complete laundry service with wash, dry and iron',
    price: 'Starting ₹30/item',
    features: ['Full service', 'Quick turnaround', 'Quality assured'],
    color: 'green',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-500'
  },
  {
    id: 'shoe-cleaning',
    name: 'Shoe Cleaning',
    icon: Award,
    description: 'Professional shoe care and cleaning services',
    price: 'Starting ₹80/pair',
    features: ['Deep cleaning', 'Polish & shine', 'Odor removal'],
    color: 'orange',
    bgColor: 'bg-orange-50',
    iconBg: 'bg-orange-500'
  },
  {
    id: 'express',
    name: 'Express Service',
    icon: Clock,
    description: 'Same-day delivery for urgent laundry needs',
    price: 'Starting ₹45/item',
    features: ['4-6 hour delivery', 'Priority handling', 'Premium care'],
    color: 'red',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-500'
  }
]

// How We Work Steps with images
const howWeWorkSteps = [
  {
    id: 1,
    title: 'Schedule Pickup',
    subtitle: 'Book in seconds',
    description: 'Use our app or website to schedule a pickup at your convenient time. Simply select your preferred date and time slot, and we\'ll be there. You\'ll receive instant confirmation via SMS and email with all the details of your booking.',
    features: [
      'Easy online booking through app or website',
      'Choose from flexible time slots that suit your schedule',
      'Instant confirmation via SMS and email',
      'Track your booking status in real-time',
      'Reschedule anytime with just one click'
    ],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'We Collect',
    subtitle: 'Doorstep pickup',
    description: 'Our trained delivery partner arrives at your doorstep to collect your laundry. No need to step out or wait in long queues. We handle everything from your door with care and professionalism.',
    features: [
      'Free doorstep pickup at your convenience',
      'Trained and verified delivery professionals',
      'Careful handling of all garments',
      'Itemized receipt provided on collection',
      'Special care instructions noted'
    ],
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Expert Cleaning',
    subtitle: 'Premium care',
    description: 'Your clothes are cleaned with premium eco-friendly detergents and state-of-the-art machines by our trained experts. Each garment goes through quality inspection to ensure the best results.',
    features: [
      'Eco-friendly and skin-safe detergents',
      'Advanced washing and dry cleaning machines',
      'Stain treatment by expert technicians',
      'Quality inspection at every stage',
      'Special care for delicate fabrics'
    ],
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Delivery',
    subtitle: 'Fresh & folded',
    description: 'Your fresh, clean, and neatly folded clothes are delivered back to your doorstep right on time. We ensure your garments are packed carefully to maintain their freshness and quality.',
    features: [
      'On-time delivery guaranteed',
      'Neatly folded and packed with care',
      'Quality check before dispatch',
      'Contactless delivery available',
      '100% satisfaction guaranteed'
    ],
    image: '/images/del.jpg'
  }
]

// How We Work Component with Scroll Animation
function HowWeWorkSection() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      // Get the bounding rect of each step content
      stepsRef.current.forEach((step, index) => {
        if (step) {
          const rect = step.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          
          // Check if this step is in the middle portion of the viewport
          // Step is active when its top is above center and bottom is below center
          const stepCenter = rect.top + rect.height / 2
          const viewportCenter = viewportHeight / 2
          
          if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
            setActiveStep(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center py-16">
          <p className="text-teal-500 font-semibold mb-2">Simple & Easy</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How We Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting your laundry done has never been easier. Just 4 simple steps!
          </p>
        </div>

        {/* Sticky Scroll Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left - Sticky Image */}
          <div className="lg:w-1/2 lg:sticky lg:top-24 lg:h-[500px] flex items-center justify-center">
            <div className="relative w-full max-w-md h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {howWeWorkSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeStep === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with step number */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{step.id}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{step.title}</p>
                        <p className="text-gray-300 text-sm">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Step Indicators */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
                {howWeWorkSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-8 rounded-full transition-all duration-300 ${
                      activeStep === index ? 'bg-teal-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Scrollable Content */}
          <div ref={contentRef} className="lg:w-1/2 space-y-8 pb-16">
            {howWeWorkSteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => { stepsRef.current[index] = el }}
                className="min-h-[500px] flex items-center"
              >
                <div className="w-full py-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      activeStep === index ? 'bg-teal-500' : 'bg-gray-300'
                    } transition-colors duration-300`}>
                      <span className="text-xl font-bold text-white">{step.id}</span>
                    </div>
                    <div>
                      <p className="text-teal-500 font-medium text-sm uppercase tracking-wide">{step.subtitle}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{step.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">{step.description}</p>
                  
                  <ul className="space-y-4">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Cleaning<br />Services
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Professional laundry and dry cleaning services at your doorstep. 
              Quality care for all your garments.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link href="/customer/orders/new">
                  <Button size="lg" className="bg-gray-800 hover:bg-gray-900 text-white">
                    <Truck className="w-5 h-5 mr-2" />
                    Schedule Free Pickup
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login?redirect=/customer/orders/new">
                  <Button size="lg" className="bg-gray-800 hover:bg-gray-900 text-white">
                    <Truck className="w-5 h-5 mr-2" />
                    Schedule Free Pickup
                  </Button>
                </Link>
              )}
              <Link href="https://wa.me/919876543210" target="_blank">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Phone className="w-5 h-5 mr-2" />
                  Chat on Whatsapp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work - Sticky Scroll Section */}
      <HowWeWorkSection />

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-teal-500 font-semibold mb-2">What We Offer</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From everyday laundry to premium dry cleaning, we offer comprehensive 
              garment care solutions tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div 
                  key={service.id}
                  className={`${service.bgColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 ${service.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <p className="text-lg font-bold text-gray-800 mb-4">{service.price}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-teal-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isAuthenticated ? (
                    <Link href={`/customer/orders/new?service=${service.id}`}>
                      <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login?redirect=/customer/orders/new">
                      <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose LaundryPro?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Pickup & Delivery</h3>
              <p className="text-sm text-gray-600">Doorstep service at no extra cost</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24-48 Hour Delivery</h3>
              <p className="text-sm text-gray-600">Quick turnaround time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Quality Assured</h3>
              <p className="text-sm text-gray-600">Premium care for your clothes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Schedule your first pickup today and experience the convenience of professional laundry service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  <Truck className="w-5 h-5 mr-2" />
                  Book Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login?redirect=/customer/orders/new">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            )}
            <Link href="tel:+919876543210">
              <Button size="lg" className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-teal-600">
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
