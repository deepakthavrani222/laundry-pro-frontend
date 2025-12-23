import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CenterAdmin {
  id: string
  name: string
  email: string
  role: string
  permissions: {
    branches: boolean
    users: boolean
    orders: boolean
    finances: boolean
    analytics: boolean
    settings: boolean
  }
  avatar?: string
  mfaEnabled: boolean
}

interface Session {
  sessionId: string
  location: {
    country: string
    city: string
  }
  isSuspicious: boolean
}

interface CenterAdminState {
  admin: CenterAdmin | null
  token: string | null
  session: Session | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  
  // Actions
  setAdmin: (admin: CenterAdmin) => void
  setToken: (token: string) => void
  setSession: (session: Session) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  logout: () => void
  clearAll: () => void
}

export const useCenterAdminStore = create<CenterAdminState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      session: null,
      isAuthenticated: false,
      sidebarCollapsed: false,

      setAdmin: (admin) => set({ 
        admin, 
        isAuthenticated: true 
      }),

      setToken: (token) => set({ token }),

      setSession: (session) => set({ session }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      logout: () => set({ 
        admin: null, 
        token: null, 
        session: null, 
        isAuthenticated: false 
      }),

      clearAll: () => set({ 
        admin: null, 
        token: null, 
        session: null, 
        isAuthenticated: false 
      })
    }),
    {
      name: 'center-admin-storage',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)