'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSuperAdminStore } from '@/store/superAdminStore'
import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar'
import SuperAdminHeader from '@/components/layout/SuperAdminHeader'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, admin, sidebarCollapsed } = useSuperAdminStore()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && !pathname.includes('/auth/')) {
      router.push('/superadmin/auth/login')
      return
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && pathname.includes('/auth/')) {
      router.push('/superadmin/dashboard')
      return
    }
  }, [isAuthenticated, pathname, router])

  // Show auth pages without layout
  if (pathname.includes('/auth/')) {
    return <>{children}</>
  }

  // Show loading or redirect for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SuperAdminSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Header */}
        <SuperAdminHeader />
        
        {/* Page Content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
