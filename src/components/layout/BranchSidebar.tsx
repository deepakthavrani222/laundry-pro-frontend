'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Package2, 
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/branch/dashboard', icon: Home },
  { name: 'Orders', href: '/branch/orders', icon: ShoppingBag },
  { name: 'Staff Management', href: '/branch/staff', icon: Users },
  { name: 'Inventory', href: '/branch/inventory', icon: Package2 },
  { name: 'Performance', href: '/branch/performance', icon: BarChart3 },
  { name: 'Settings', href: '/branch/settings', icon: Settings },
]

export function BranchSidebar() {
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
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
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
          
          {/* Branch Stats */}
          <div className="px-4 mt-6 flex-shrink-0">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Today's Status</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Pending Orders</span>
                  <span className="font-medium text-orange-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span className="font-medium text-blue-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="font-medium text-green-600">24</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff Available</span>
                  <span className="font-medium text-purple-600">15/18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}