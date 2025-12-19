'use client'

import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminNavbar } from '@/components/layout/AdminNavbar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 Admin layout check:', { 
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
      
      if (user.role !== 'admin') {
        console.log('🔥 Wrong role for admin:', user.role)
        router.push('/auth/login')
        return
      }
      
      console.log('🔥 Admin auth check passed')
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-x-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}