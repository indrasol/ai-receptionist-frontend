import { API_ENDPOINTS } from '../config/apiEndpoints'
import { authService } from './authService'

// Type definitions based on the API documentation
export interface InboundCall {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  vapi_call_id: string
  call_status: string
  call_summary: string
  call_recording_url: string
  call_transcript: string
  success_evaluation: string
  call_type: string
  call_duration_seconds: number
  call_duration_formatted: string
  call_cost: number
  ended_reason: string
  customer_number: string
  phone_number_id: string
  created_at: string
  updated_at: string
  call_date: string
}

export interface DashboardStats {
  inbound_calls_total: number
  inbound_calls_today: number
  inbound_calls_yesterday: number
  inbound_calls_last_14_days: number
  outbound_calls_total: number
  outbound_calls_today: number
  outbound_calls_yesterday: number
  outbound_calls_last_14_days: number
  outbound_success_rate: number
  inbound_calls_change_percent: number
  outbound_calls_change_percent: number
  success_rate_change_percent: number
  outbound_calls_successful: number
  outbound_calls_completed: number
}

export interface TrendData {
  date: string
  inbound_calls: number
  outbound_calls: number
  total_calls: number
}

export interface Organization {
  id: string
  name: string
}

export interface DashboardMetadata {
  current_date: string
  yesterday_date: string
  fourteen_days_ago_date: string
  environment: string
}

export interface DashboardResponse {
  dashboard: DashboardStats
  trends: TrendData[]
  organization: Organization
  metadata: DashboardMetadata
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class InboundService {
  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const token = authService.getToken()
    
    if (!token) {
      throw new Error('No authentication token available. Please sign in again.')
    }
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
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
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        // Token is expired or invalid, clear tokens and force re-authentication
        authService.removeTokens()
        
        // Provide a specific error message
        const errorMessage = 'Invalid or expired token. Please sign in again.'
        throw new Error(errorMessage)
      }

      const errorMessage = data.detail || data.message || data.error || 
                          (data.errors ? JSON.stringify(data.errors) : '') ||
                          `HTTP ${response.status}: ${response.statusText}`
      
      throw new Error(errorMessage)
    }

    return data
  }

  async getCalls(receptionistId: string, page = 1, pageSize = 50): Promise<ApiResponse<InboundCall[]>> {
    try {
      const url = `${API_ENDPOINTS.INBOUND.GET_CALLS}?receptionist_id=${receptionistId}&page=${page}&page_size=${pageSize}`
      const response = await this.makeRequest(url, {
        method: 'GET',
      })

      return {
        success: true,
        data: Array.isArray(response) ? response : [],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inbound calls',
      }
    }
  }

  async getCallById(callId: string): Promise<ApiResponse<InboundCall>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.INBOUND.GET_CALL, {
        method: 'POST',
        body: JSON.stringify({ 'call_id': callId }),
      })

      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch call details',
      }
    }
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardResponse>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.INBOUND.DASHBOARD_STATS, {
        method: 'GET',
      })

      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard statistics',
      }
    }
  }
}

export const inboundService = new InboundService()
