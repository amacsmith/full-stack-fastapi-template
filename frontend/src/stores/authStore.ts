import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name?: string
  is_superuser?: boolean
  is_active?: boolean
}

interface AuthStore {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,

        // Actions
        login: (user, token) => {
          localStorage.setItem('access_token', token)
          set({ user, token, isAuthenticated: true })
        },

        logout: () => {
          localStorage.removeItem('access_token')
          set({ user: null, token: null, isAuthenticated: false })
        },

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        setToken: (token) => {
          localStorage.setItem('access_token', token)
          set({ token })
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
      }
    ),
    {
      name: 'AuthStore'
    }
  )
) 