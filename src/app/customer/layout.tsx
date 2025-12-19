'use client'

import { CustomerSidebar } from '@/components/layout/CustomerSidebar'
import { CustomerNavbar } from '@/components/layout/CustomerNavbar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 Customer layout check:', { 
      isAuthenticated, 
      user, 
      userRole: user?.role,
      roleType: typeof user?.role,
      roleComparison: user?.role === 'customer'
    })
    
    // Wait a bit for store to initialize
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
        console.log('🔥 Not authenticated, redirecting to login')
        router.push('/auth/login')
        return
      }
      
      if (user.role !== 'customer') {
        console.log('🔥 Wrong role:', user.role, 'Expected: customer', 'Match:', user.role === 'customer')
        router.push('/auth/login')
        return
      }
      
      console.log('🔥 Auth check passed, showing dashboard')
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-x-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}