'use client'

import { SupportSidebar } from '@/components/layout/SupportSidebar'
import { SupportNavbar } from '@/components/layout/SupportNavbar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 Support layout check:', { 
      isAuthenticated, 
      user, 
      userRole: user?.role,
    })
    
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
        console.log('🔥 Not authenticated, redirecting to login')
        router.push('/auth/login')
        return
      }
      
      if (user.role !== 'support_agent') {
        console.log('🔥 Wrong role for support:', user.role)
        router.push('/auth/login')
        return
      }
      
      console.log('🔥 Support auth check passed')
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Support Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SupportNavbar />
      <div className="flex">
        <SupportSidebar />
        <main className="flex-1 lg:ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}