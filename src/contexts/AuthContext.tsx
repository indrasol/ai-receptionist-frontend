import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, User, AuthResponse } from '@/services/authService'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (identifier: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<AuthResponse>
  signOut: () => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<AuthResponse>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on app load
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        // Verify token and get current user
        const verifyResult = await authService.verifyToken()
        
        if (verifyResult.success) {
          const userResult = await authService.getCurrentUser()
          
          if (userResult.success && userResult.user) {
            setUser(userResult.user)
          } else {
            // Failed to get user data, clear tokens
            authService.removeTokens()
            setUser(null)
          }
        } else {
          // Token is invalid, clear it
          authService.removeTokens()
          setUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const signIn = async (identifier: string, password: string): Promise<AuthResponse> => {
    setLoading(true)
    const result = await authService.signin({ identifier, password })
    
    if (result.success && result.user) {
      setUser(result.user)
    }
    
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, username: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    setLoading(true)
    const result = await authService.signup({ 
      email, 
      password, 
      username, 
      first_name: firstName, 
      last_name: lastName 
    })
    
    // Don't auto-login after signup - user should go to login page
    setLoading(false)
    return result
  }

  const signOut = async (): Promise<AuthResponse> => {
    setLoading(true)
    const result = await authService.logout()
    
    // Clear user regardless of API call success
    setUser(null)
    setLoading(false)
    
    return result
  }

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword({ email })
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
