import { API_ENDPOINTS } from '@/config/apiEndpoints';
import { authService } from './authService';
import { supabase } from '@/lib/supabase';

// Types based on the API response structure
export interface Assistant {
  display_name: string;
  age: string;
  gender: string;
  ethnicity?: string;
  tone?: string;
  accent?: string;
  personality?: string[];
  description: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  provider: string;
  country: string;
  country_code: string;
  status: string;
  description: string;
}

export interface AssistantsResponse {
  message: string;
  assistants: Assistant[];
  total_count: number;
}

export interface PhoneNumbersResponse {
  message: string;
  phone_numbers: PhoneNumber[];
  total_count: number;
}

export interface ReceptionistRecord {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  assistant_voice?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReceptionistsResponse {
  message: string;
  receptionists: ReceptionistRecord[];
  total_count: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ReceptionistService {
  public async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    // First try to get Supabase token
    let token: string | null = null;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token || null;
    } catch (error) {
      console.warn('Failed to get Supabase session:', error);
    }
    
    // Fallback to legacy authService token
    if (!token) {
      token = authService.getToken();
    }
    
    if (!token) {
      throw new Error('No authentication token available. Please sign in again.');
    }
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      data = { error: 'Invalid JSON response from server' };
    }

    if (!response.ok) {
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        // Token is expired or invalid, clear tokens and force re-authentication
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.warn('Failed to sign out from Supabase:', signOutError);
        }
        authService.removeTokens();
        
        // Provide a specific error message
        const errorMessage = 'Invalid or expired token. Please sign in again.';
        throw new Error(errorMessage);
      }

      const errorMessage = data.detail || data.message || data.error || 
                          (data.errors ? JSON.stringify(data.errors) : '') ||
                          `HTTP ${response.status}: ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    return data;
  }

  async getAssistants(): Promise<ApiResponse<AssistantsResponse>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.GET_ASSISTANTS);
      
      return {
        data,
        message: 'Successfully fetched assistants'
      };
    } catch (error) {
      console.error('Error fetching assistants:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch assistants'
      };
    }
  }

  async getPhoneNumbers(): Promise<ApiResponse<PhoneNumbersResponse>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.GET_PHONE_NUMBERS);
      
      return {
        data,
        message: 'Successfully fetched phone numbers'
      };
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch phone numbers'
      };
    }
  }

  async getReceptionists(): Promise<ApiResponse<ReceptionistsResponse>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.GET_RECEPTIONISTS);
      return { data, message: 'Successfully fetched receptionists' };
    } catch (error) {
      console.error('Error fetching receptionists:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch receptionists' };
    }
  }

  async getReceptionistById(id: string): Promise<ApiResponse<ReceptionistRecord>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.GET_BY_ID(id));
      return { data, message: 'Successfully fetched receptionist' };
    } catch (error) {
      console.error('Error fetching receptionist:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch receptionist' };
    }
  }

  async createReceptionist(payload: {
    name: string;
    description?: string;
    assistant_voice?: string;
    phone_number?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.CREATE, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return { data, message: 'Receptionist created' };
    } catch (error) {
      console.error('Error creating receptionist:', error);
      return { error: error instanceof Error ? error.message : 'Failed to create receptionist' };
    }
  }

  async deleteReceptionist(id: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.DELETE(id), {
        method: 'DELETE',
      });
      return { data, message: 'Receptionist deleted' };
    } catch (error) {
      console.error('Error deleting receptionist:', error);
      return { error: error instanceof Error ? error.message : 'Failed to delete receptionist' };
    }
  }

  async updateReceptionist(id: string, payload: any): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.RECEPTIONIST.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update receptionist' };
    }
  }

}

export const receptionistService = new ReceptionistService();
