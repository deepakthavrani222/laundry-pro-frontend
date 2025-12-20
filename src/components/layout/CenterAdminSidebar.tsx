'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCenterAdminStore } from '@/store/centerAdminStore'
import { 
  LayoutDashboard,
  Building2,
  Users,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  Tag,
  Truck
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/center-admin/dashboard',
    icon: LayoutDashboard,
    permission: 'analytics'
  },
  {
    name: 'Branches',
    href: '/center-admin/branches',
    icon: Building2,
    permission: 'branches'
  },
  {
    name: 'Logistics Partners',
    href: '/center-admin/logistics',
    icon: Truck,
    permission: 'branches'
  },
  {
    name: 'Users & Roles',
    href: '/center-admin/users',
    icon: Users,
    permission: 'users'
  },
  {
    name: 'Orders',
    href: '/center-admin/orders',
    icon: ShoppingBag,
    permission: 'orders'
  },
  {
    name: 'Finances',
    href: '/center-admin/finances',
    icon: DollarSign,
    permission: 'finances'
  },
  {
    name: 'Analytics & Growth',
    href: '/center-admin/analytics',
    icon: BarChart3,
    permission: 'analytics'
  },
  {
    name: 'Pricing & Policy',
    href: '/center-admin/pricing',
    icon: Tag,
    permission: 'settings'
  },
  {
    name: 'Financial Management',
    href: '/center-admin/financial',
    icon: DollarSign,
    permission: 'finances'
  },
  {
    name: 'Risk & Escalation',
    href: '/center-admin/risk',
    icon: Shield,
    permission: 'settings'
  },
  {
    name: 'Audit Logs',
    href: '/center-admin/audit',
    icon: FileText,
    permission: 'settings'
  },
  {
    name: 'Settings',
    href: '/center-admin/settings',
    icon: Settings,
    permission: 'settings'
  }
]

export default function CenterAdminSidebar() {
  const pathname = usePathname()
  const { admin, logout } = useCenterAdminStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/center-admin/auth/login'
  }

  const hasPermission = (permission: string) => {
    return admin?.permissions[permission as keyof typeof admin.permissions] || false
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75" />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Center Admin</h1>
                <p className="text-xs text-gray-500">LaundryPro</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Admin Info */}
        {!collapsed && admin && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {admin.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {admin.email}
                </p>
              </div>
            </div>
            
            {/* MFA Status */}
            <div className="mt-3 flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                admin.mfaEnabled ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
              <span className="text-xs text-gray-500">
                MFA {admin.mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (!hasPermission(item.permission)) return null
            
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${
                  collapsed ? 'mx-auto' : 'mr-3'
                } ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className={`group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className={`flex-shrink-0 w-5 h-5 ${
              collapsed ? '' : 'mr-3'
            } text-gray-400 group-hover:text-red-500`} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </div>
    </>
  )
}