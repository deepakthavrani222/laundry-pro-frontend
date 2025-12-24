'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting login with:', formData.email)
      const response = await authAPI.login(formData)
      console.log('Login response:', response.data)
      
      // Backend returns { success: true, data: { token, user }, message }
      const { token, user } = response.data.data

      console.log('User object:', user)
      console.log('Token:', token)

      console.log('🔥 About to call setAuth...')
      setAuth(user, token)
      toast.success('Login successful!')

      // If there's a redirect URL, use it (for customers only)
      if (redirectUrl && user.role === 'customer') {
        console.log('🔥 Redirecting to:', redirectUrl)
        setTimeout(() => {
          router.push(redirectUrl)
        }, 100)
        return
      }

      // Otherwise, redirect based on user role
      const roleRoutes = {
        customer: '/', // Customers go to homepage
        admin: '/admin/dashboard',
        center_admin: '/center-admin/dashboard',  // center_admin = old branch_manager
        support_agent: '/support/dashboard',
        superadmin: '/superadmin/dashboard',
      }

      const redirectPath = roleRoutes[user.role as keyof typeof roleRoutes] || '/'
      console.log('🔥 Redirecting to:', redirectPath)
      
      // Small delay to ensure state is set, then redirect
      setTimeout(() => {
        router.push(redirectPath)
      }, 100)

      // Redirect will happen in the setTimeout above after state verification
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed'
      
      // Handle email verification requirement
      if (error.response?.data?.requiresEmailVerification) {
        toast.error('Please verify your email address before logging in')
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
        return
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-500 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-teal-400 rounded-full"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-800">LaundryPro</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-teal-600 hover:text-teal-500">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Production Accounts */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Login Accounts:</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div><strong>Customer:</strong> testcustomer@demo.com / password123</div>
            <div><strong>Admin:</strong> admin@laundrypro.com / admin123</div>
            <div><strong>Center Admin:</strong> branch@laundrypro.com / branch123</div>
            <div><strong>Support:</strong> support@laundrypro.com / support123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
