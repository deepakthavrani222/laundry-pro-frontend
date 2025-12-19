import { create } from 'zustand'

export type UserRole = 'customer' | 'admin' | 'branch_manager' | 'support_agent' | 'center_admin'

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: UserRole
  isActive: boolean
  isVIP?: boolean
  assignedBranch?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

// Simple store without persistence for now
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    console.log('🔥 Setting auth in store:', { user, token })
    
    // Also save to localStorage manually
    localStorage.setItem('laundry-auth', JSON.stringify({ user, token, isAuthenticated: true }))
    
    set({ user, token, isAuthenticated: true })
    
    // Verify the state was set
    setTimeout(() => {
      const currentState = get()
      console.log('🔥 Auth state after setting:', currentState)
      console.log('🔥 localStorage check:', localStorage.getItem('laundry-auth'))
    }, 100)
  },
  logout: () => {
    localStorage.removeItem('laundry-auth')
    set({ user: null, token: null, isAuthenticated: false })
  },
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),
}))

// Initialize from localStorage on app start
if (typeof window !== 'undefined') {
  const savedAuth = localStorage.getItem('laundry-auth')
  if (savedAuth) {
    try {
      const { user, token, isAuthenticated } = JSON.parse(savedAuth)
      console.log('🔥 Loading auth from localStorage:', { user, token, isAuthenticated })
      useAuthStore.setState({ user, token, isAuthenticated })
    } catch (error) {
      console.error('Error loading auth from localStorage:', error)
      localStorage.removeItem('laundry-auth')
    }
  }
}