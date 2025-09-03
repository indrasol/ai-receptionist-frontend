import { API_ENDPOINTS } from '../config/apiEndpoints'

export interface User {
  id: string
  email: string
  name?: string
  [key: string]: any
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
  error?: string
}

export interface SignupData {
  email: string
  password: string
  username: string
  first_name: string
  last_name: string
}

export interface SigninData {
  identifier: string
  password: string
}

export interface PasswordResetData {
  email: string
}

class AuthService {
  private token: string | null = null
  private refreshToken: string | null = null

  constructor() {
    // Initialize tokens from localStorage
    this.token = localStorage.getItem('auth_token')
    this.refreshToken = localStorage.getItem('refresh_token')
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    let data
    try {
      data = await response.json()
    } catch (e) {
      console.error('Failed to parse JSON response:', e)
      data = { error: 'Invalid JSON response from server' }
    }

    if (!response.ok) {
      // Include more detailed error information
      const errorMessage = data.detail || data.message || data.error || 
                          (data.errors ? JSON.stringify(data.errors) : '') ||
                          `HTTP ${response.status}: ${response.statusText}`
      
      throw new Error(errorMessage)
    }

    return data
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(signupData),
      })

      // Don't auto-login after signup - let user go to login page
      return {
        success: true,
        message: response.message || 'Account created successfully! Please sign in.',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      }
    }
  }

  async signin(signinData: SigninData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.AUTH.SIGNIN, {
        method: 'POST',
        body: JSON.stringify(signinData),
      })

      // Extract tokens from auth object
      const token = response.auth?.access_token
      const refreshToken = response.auth?.refresh_token
      
      if (token) {
        this.setToken(token)
      }
      
      if (refreshToken) {
        this.setRefreshToken(refreshToken)
      }

      // Extract user data from auth object
      const userData = response.auth?.user
      
      // Map backend user data to our User interface
      const user: User = {
        id: userData?.id || userData?.user_id,
        email: userData?.email,
        name: this.formatUserName(userData),
        ...userData // Include any additional fields
      }

      return {
        success: true,
        user,
        token,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signin failed',
      }
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const headers: HeadersInit = {}
      
      // Add refresh token header as required by API
      if (this.refreshToken) {
        headers['refresh-token'] = this.refreshToken
      }

      await this.makeRequest(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers,
      })

      this.removeTokens()

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error) {
      // Even if the API call fails, we should still clear the local tokens
      this.removeTokens()
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }
    }
  }

  async verifyToken(): Promise<AuthResponse> {
    if (!this.token) {
      return {
        success: false,
        error: 'No token available',
      }
    }

    try {
      const response = await this.makeRequest(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ token: this.token }),
      })

      return {
        success: true,
        user: response.user,
        message: response.message,
      }
    } catch (error) {
      // If token verification fails, remove the invalid token
      this.removeToken()
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token verification failed',
      }
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    if (!this.token) {
      return {
        success: false,
        error: 'No token available',
      }
    }

    try {
      const response = await this.makeRequest(API_ENDPOINTS.AUTH.ME, {
        method: 'GET',
      })

      // Map backend user data to our User interface  
      const userData = response.user || response
      
      const user: User = {
        id: userData?.id || userData?.user_id,
        email: userData?.email,
        name: this.formatUserName(userData),
        ...userData // Include any additional fields
      }

      return {
        success: true,
        user,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user',
      }
    }
  }

  async resetPassword(resetData: PasswordResetData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(resetData),
      })

      return {
        success: true,
        message: response.message || 'Password reset email sent',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }
    }
  }

  // Note: Token refresh endpoint not available on backend
  // Tokens will be cleared on 401 errors and user redirected to login

  private formatUserName(user: any): string {
    if (!user) return ''
    
    // Try different combinations to create a display name
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    
    if (user.name) {
      return user.name
    }
    
    if (user.username) {
      return user.username
    }
    
    if (user.first_name) {
      return user.first_name
    }
    
    // Fallback to email username part
    if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'User'
  }

  private setToken(token: string): void {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  private setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken
    localStorage.setItem('refresh_token', refreshToken)
  }

  // Keep backward compatibility
  private removeToken(): void {
    this.removeTokens()
  }

  getToken(): string | null {
    return this.token
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  // Public method to remove tokens (used by other services)
  removeTokens(): void {
    this.token = null
    this.refreshToken = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
}

export const authService = new AuthService()
