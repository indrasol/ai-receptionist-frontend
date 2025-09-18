import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, User, AuthResponse } from '@/services/authService'
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
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          data: {
            organization_name: organizationName,
            first_name: firstName,
            last_name: lastName,
            signup_flow: true
          }
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        message: 'OTP sent successfully! Please check your email.'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP'
      }
    }
  }

  const sendOTPForLogin = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false, // do NOT create a new user on login attempt
          data: {
            signup_flow: false
          }
        }
      })

      if (error) {
        // If the user doesn't exist yet, ask them to sign up first
        if (error.message?.includes('User not found') || error.code === 'otp_disabled' || error.message?.includes('Signups not allowed for otp')) {
          return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please sign up first.'
          }
        }

        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        message: 'OTP sent successfully! Please check your email.'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP'
      }
    }
  }

  const verifyOTPAndSignup = async (email: string, otp: string, organizationName: string, firstName: string, lastName: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (data.user) {
        // Update user metadata with organization and name info
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            organization_name: organizationName,
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
          }
        })

        if (updateError) {
          console.warn('Failed to update user metadata:', updateError)
        }

        // Create user object
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: `${firstName} ${lastName}`,
          organization_name: organizationName,
          first_name: firstName,
          last_name: lastName
        }

        setUser(user)

        return {
          success: true,
          user: user,
          message: 'Account created and verified successfully!'
        }
      }

      return {
        success: false,
        error: 'Verification failed'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed'
      }
    }
  }

  const verifyOTPAndLogin = async (email: string, otp: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      })

      if (error) {
        // Check if user doesn't exist
        if (error.message.includes('User not found') || error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please sign up first.'
          }
        }
        return {
          success: false,
          error: error.message
        }
      }

      if (data.user) {
        // Ensure the user has completed signup_flow (i.e., they actually signed up before)
        if (!data.user.user_metadata?.signup_flow) {
          // The user was created via login OTP without proper signup
          await supabase.auth.signOut() // ensure they are logged out immediately
          return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please sign up first.'
          }
        }

        // Create user object from Supabase user data
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.first_name || 'User',
          organization_name: data.user.user_metadata?.organization_name,
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name
        }

        setUser(user)

        return {
          success: true,
          user: user,
          message: 'Login successful!'
        }
      }

      return {
        success: false,
        error: 'Login verification failed'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed'
      }
    }
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
