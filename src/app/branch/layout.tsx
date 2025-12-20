'use client'

import { BranchSidebar } from '@/components/layout/BranchSidebar'
import { BranchNavbar } from '@/components/layout/BranchNavbar'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!_hasHydrated) {
      console.log('🔥 Waiting for hydration...')
      return
    }

    console.log('🔥 Branch layout check:', { 
      isAuthenticated, 
      user, 
      userRole: user?.role,
      _hasHydrated
    })
    
    if (!isAuthenticated || !user) {
      console.log('🔥 Not authenticated, redirecting to login')
      router.push('/auth/login')
      return
    }
    
    if (user.role !== 'branch_manager') {
      console.log('🔥 Wrong role for branch:', user.role)
      router.push('/auth/login')
      return
    }
    
    console.log('🔥 Branch auth check passed')
    setIsReady(true)
  }, [isAuthenticated, user, router, _hasHydrated])

  if (!_hasHydrated || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Branch Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BranchNavbar />
      <div className="flex">
        <BranchSidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 overflow-x-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}