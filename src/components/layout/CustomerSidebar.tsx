'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  ShoppingBag, 
  MapPin, 
  Bell, 
  User, 
  CreditCard,
  Star,
  HelpCircle,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
  { name: 'New Order', href: '/customer/orders/new', icon: Plus },
  { name: 'My Orders', href: '/customer/orders', icon: ShoppingBag },
  { name: 'Addresses', href: '/customer/addresses', icon: MapPin },
  { name: 'Notifications', href: '/customer/notifications', icon: Bell },
  { name: 'Profile', href: '/customer/profile', icon: User },
  { name: 'Payments', href: '/customer/payments', icon: CreditCard },
  { name: 'Reviews', href: '/customer/reviews', icon: Star },
  { name: 'Help & Support', href: '/customer/support', icon: HelpCircle },
]

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 pt-16 pb-4 overflow-y-auto">
        <div className="flex-1 flex flex-col min-h-0">
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Quick Actions */}
          <div className="px-4 mt-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Quick Order</h3>
              <p className="text-xs text-gray-600 mb-3">Schedule a pickup in just 2 clicks</p>
              <Link
                href="/customer/orders/new"
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all duration-200"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}