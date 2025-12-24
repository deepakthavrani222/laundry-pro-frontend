'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Package2, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Sparkles,
  MessageSquare,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

// Map navigation items to permission modules
const navigation = [
  { name: 'Dashboard', href: '/center-admin/dashboard', icon: Home, module: null }, // Always visible
  { name: 'Orders', href: '/center-admin/orders', icon: ShoppingBag, module: 'orders' },
  { name: 'Services', href: '/center-admin/services', icon: Sparkles, module: 'services' },
  { name: 'Staff Management', href: '/center-admin/staff', icon: Users, module: 'staff' },
  { name: 'Inventory', href: '/center-admin/inventory', icon: Package2, module: 'inventory' },
  { name: 'Performance', href: '/center-admin/performance', icon: BarChart3, module: 'performance' },
  { name: 'Settings', href: '/center-admin/settings', icon: Settings, module: 'settings' },
]

interface CenterAdminSidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function CenterAdminSidebar({ collapsed: externalCollapsed, onCollapsedChange }: CenterAdminSidebarProps) {
  const pathname = usePathname()
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const { user } = useAuthStore()
  
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  
  const handleToggle = () => {
    const newValue = !collapsed
    if (onCollapsedChange) {
      onCollapsedChange(newValue)
    } else {
      setInternalCollapsed(newValue)
    }
  }

  // Check if user has view permission for a module
  const hasModuleAccess = (module: string | null) => {
    if (!module) return true // Dashboard is always visible
    // If no permissions object or empty, deny access (RBAC enforced)
    if (!user?.permissions || Object.keys(user.permissions).length === 0) {
      return false
    }
    return user.permissions[module]?.view === true
  }

  // Filter navigation based on permissions
  const visibleNavigation = navigation.filter(item => hasModuleAccess(item.module))

  return (
    <div className={cn(
      "hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 transition-all duration-300",
      collapsed ? "lg:w-16" : "lg:w-64"
    )}>
      <div className={cn(
        "flex flex-col bg-white border-r border-gray-200 pt-16 pb-4 overflow-y-auto transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Collapse Toggle Button */}
        <div className="px-2 mb-2">
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Center Admin</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {visibleNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                      !collapsed && 'mr-3'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
          
          {/* Center Stats - Only show when expanded */}
          {!collapsed && (
            <div className="px-4 mt-6 flex-shrink-0">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Today&apos;s Status</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Pending Orders</span>
                    <span className="font-medium text-orange-600">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="font-medium text-blue-600">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-medium text-green-600">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff Available</span>
                    <span className="font-medium text-purple-600">--</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
