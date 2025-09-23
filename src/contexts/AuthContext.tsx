import { AuthResponse, User, authService } from '@/services/authService'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (identifier: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<AuthResponse>
  signOut: () => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<AuthResponse>
  // OTP methods
  sendOTPForSignup: (email: string, organizationName: string, firstName: string, lastName: string) => Promise<AuthResponse>
  sendOTPForLogin: (email: string) => Promise<AuthResponse>
  verifyOTPAndSignup: (email: string, otp: string, organizationName: string, firstName: string, lastName: string) => Promise<AuthResponse>
  verifyOTPAndLogin: (email: string, otp: string) => Promise<AuthResponse>
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
      // First check Supabase auth state
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // User is authenticated with Supabase
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.first_name || 'User',
          organization_name: session.user.user_metadata?.organization_name,
          first_name: session.user.user_metadata?.first_name,
          last_name: session.user.user_metadata?.last_name
        }
        setUser(user)
      } else if (authService.isAuthenticated()) {
        // Fallback to legacy auth service
        const verifyResult = await authService.verifyToken()
        
        if (verifyResult.success) {
          const userResult = await authService.getCurrentUser()
          
          if (userResult.success && userResult.user) {
            setUser(userResult.user)
          } else {
            authService.removeTokens()
            setUser(null)
          }
        } else {
          authService.removeTokens()
          setUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.first_name || 'User',
            organization_name: session.user.user_metadata?.organization_name,
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name
          }
          setUser(user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
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
    
    try {
      // Sign out from Supabase only (no backend call needed)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.warn('Supabase sign out warning:', error.message)
        // Even if there's an error, we'll clear the local state
      }
      
      // Clear user state
      setUser(null)
      
      // Clear any legacy tokens if they exist (for backward compatibility)
      authService.removeTokens()
      
      setLoading(false)
      
      return {
        success: true,
        message: 'Signed out successfully'
      }
    } catch (error) {
      // Even if sign out fails, clear local state
      setUser(null)
      
      // Clear any legacy tokens if they exist (for backward compatibility)
      authService.removeTokens()
      
      setLoading(false)
      
      return {
        success: true, // Return success anyway since we cleared local state
        message: 'Signed out successfully'
      }
    }
  }

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword({ email })
  }

  // OTP-based authentication methods
  const sendOTPForSignup = async (email: string, organizationName: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    return authService.requestEmailOtp(email, organizationName, firstName, lastName)
  }

  const sendOTPForLogin = async (email: string): Promise<AuthResponse> => {
    return authService.requestEmailOtp(email)
  }

  const verifyOTPAndSignup = async (email: string, otp: string, organizationName: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    // For now backend just returns success; once backend creates user we can extend
    return authService.verifyEmailOtp(email, otp)
  }

  const verifyOTPAndLogin = async (email: string, otp: string): Promise<AuthResponse> => {
    return authService.verifyEmailOtp(email, otp)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendOTPForSignup,
    sendOTPForLogin,
    verifyOTPAndSignup,
    verifyOTPAndLogin,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
