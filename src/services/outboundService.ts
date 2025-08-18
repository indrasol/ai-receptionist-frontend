import { API_ENDPOINTS } from '@/config'
import { authService } from './authService'

// Type definitions based on your API documentation
export interface Lead {
  id: number
  first_name: string
  last_name: string
  phone_number: string
  source: string
  sheet_url?: string
  filename?: string
  imported_at: string
  import_source: string
  created_by_user_id: string
  created_by_user_email: string
  vapi_call_id?: string | null
  call_status: string
  call_summary?: string | null
  call_recording_url?: string | null
  call_transcript?: string | null
  success_evaluation?: string | null
  created_at: string
  updated_at: string
}

export interface UploadUrlRequest {
  sheets_url: string
}

export interface UploadUrlResponse {
  message: string
  rows_count: number
  columns: string[]
  data: Array<{
    FirstName: string
    LastName: string
    PhoneNumber: string
    id: number
    source: string
    imported_at: string
    created_at: string
    created_by_user_id: string
    created_by_user_email: string
    vapi_call_id?: string | null
    call_status: string
    call_summary?: string | null
    call_recording_url?: string | null
    call_transcript?: string | null
    success_evaluation?: string | null
    sheet_url: string
  }>
}

export interface UploadExcelResponse {
  message: string
  rows_count: number
  columns: string[]
  data: Array<{
    FirstName: string
    LastName: string
    PhoneNumber: string
    id: number
    source: string
    imported_at: string
    created_at: string
    created_by_user_id: string
    created_by_user_email: string
    vapi_call_id?: string | null
    call_status: string
    call_summary?: string | null
    call_recording_url?: string | null
    call_transcript?: string | null
    success_evaluation?: string | null
    filename: string
  }>
}

export interface GetLeadByIdRequest {
  lead_id: number
}

export interface CallLeadsRequest {
  lead_ids: number[]
  voiceId: string
}

export interface CallResult {
  lead_id: number
  status: string
  customer_name: string
  phone_number: string
  vapi_response: {
    id: string
    assistantId: string
    phoneNumberId: string
    type: string
    createdAt: string
    updatedAt: string
    orgId: string
    cost: number
    customer: {
      name: string
      number: string
    }
    status: string
    phoneCallProvider: string
    phoneCallProviderId: string
    phoneCallTransport: string
    monitor: {
      listenUrl: string
      controlUrl: string
    }
    transport: {
      callSid: string
      provider: string
      accountSid: string
    }
  }
}

export interface CallLeadsResponse {
  message: string
  total_leads: number
  successful_calls: number
  failed_calls: number
  voice_used: string
  results: CallResult[]
}

export interface VoiceAssistant {
  display_name: string
  age: string
  gender: string
  ethnicity?: string
  tone?: string
  accent?: string
  personality: string[]
  description: string
}

export interface GetAssistantsResponse {
  message: string
  voices: VoiceAssistant[]
  total_count: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class OutboundService {
  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const token = authService.getToken()
    
    if (!token) {
      throw new Error('No authentication token available. Please sign in again.')
    }
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      //'Authorization': `${token}`,
      ...options.headers,
    }

    // Don't add Content-Type for FormData (multipart/form-data)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
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

  async uploadUrl(sheetsUrl: string): Promise<ApiResponse<UploadUrlResponse>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.UPLOAD_URL, {
        method: 'POST',
        body: JSON.stringify({ sheets_url: sheetsUrl }),
      })

      return {
        success: true,
        data: response,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload URL',
      }
    }
  }

  async uploadExcel(file: File): Promise<ApiResponse<UploadExcelResponse>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.UPLOAD_EXCEL, {
        method: 'POST',
        body: formData,
      })

      return {
        success: true,
        data: response,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload Excel file',
      }
    }
  }

  async getLeads(): Promise<ApiResponse<Lead[]>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.GET_LEADS, {
        method: 'GET',
      })

      return {
        success: true,
        data: Array.isArray(response) ? response : [],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leads',
      }
    }
  }

  async getLeadById(leadId: number): Promise<ApiResponse<Lead>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.GET_SUMMARY_BY_ID, {
        method: 'POST',
        body: JSON.stringify({ lead_id: leadId }),
      })

      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lead',
      }
    }
  }

  async callLeads(leadIds: number[], voiceId: string): Promise<ApiResponse<CallLeadsResponse>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.CALL_LEADS, {
        method: 'POST',
        body: JSON.stringify({ lead_ids: leadIds, voiceId }),
      })

      return {
        success: true,
        data: response,
        message: response.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate calls',
      }
    }
  }

  async getAssistants(): Promise<ApiResponse<GetAssistantsResponse>> {
    try {
      const response = await this.makeRequest(API_ENDPOINTS.OUTBOUND.GET_ASSISTANTS, {
        method: 'GET',
      })

      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch assistants',
      }
    }
  }
}

export const outboundService = new OutboundService()
