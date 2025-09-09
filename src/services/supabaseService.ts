import * as XLSX from 'xlsx'

import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface LeadData {
  first_name: string
  last_name: string
  phone_number: string
  source?: string
  sheet_url?: string
  created_by_user_id?: string
  created_by_user_email?: string
}

export interface ProcessedLead {
  id: string  // Changed from number to string (UUID)
  first_name: string
  last_name: string
  phone_number: string
  source: string
  imported_at: string
  created_at: string
  created_by_user_id: string | null
  created_by_user_email: string | null
  vapi_call_id: string | null
  call_status: string
  call_summary: string | null
  call_recording_url: string | null
  call_transcript: string | null
  success_evaluation: string | null
  sheet_url: string | null
}

export interface UploadUrlResponse {
  message: string
  rows_count: number
  columns: string[]
  data: ProcessedLead[]
}

class SupabaseService {
  // Header mapping for flexible parsing
  private headerMappings = {
    firstName: ['first name', 'firstname', 'first_name', 'FirstName'],
    lastName: ['last name', 'lastname', 'last_name', 'LastName'],
    phone: ['customer phone numbers', 'lead phone number', 'phone', 'phone number', 'PhoneNumber', 'phone_number'],
  }

  private normalizeHeader = (header: string): string | null => {
    const normalized = header.toLowerCase().trim()
    for (const [key, aliases] of Object.entries(this.headerMappings)) {
      if (aliases.map(alias => alias.toLowerCase()).includes(normalized)) {
        return key
      }
    }
    return null
  }

  private normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // Format US phone numbers
    if (digits.length === 10) {
      return `+1${digits}`
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`
    }
    
    // For other formats, just add + if it doesn't exist
    return digits.startsWith('+') ? digits : `+${digits}`
  }

  private parseGoogleSheetsData = (jsonData: any[]): LeadData[] => {
    if (jsonData.length === 0) return []
    
    const headers = Object.keys(jsonData[0])
    const mapping: Record<string, string> = {}
    
    headers.forEach(header => {
      const normalized = this.normalizeHeader(header)
      if (normalized) {
        mapping[normalized] = header
      }
    })

    return jsonData.filter(row => {
      // Skip empty rows
      return Object.values(row).some(value => value && value.toString().trim())
    }).map((row) => ({
      first_name: row[mapping.firstName] || '',
      last_name: row[mapping.lastName] || '',
      phone_number: row[mapping.phone] ? this.normalizePhoneNumber(row[mapping.phone].toString()) : '',
      source: 'google_sheets'
    }))
  }

  private fetchGoogleSheetsData = async (sheetsUrl: string): Promise<any[]> => {
    // Convert Google Sheets edit URL to CSV export URL
    let csvUrl = sheetsUrl
    const sheetsMatch = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (sheetsMatch) {
      const sheetId = sheetsMatch[1]
      const gidMatch = sheetsUrl.match(/gid=([0-9]+)/)
      const gid = gidMatch ? gidMatch[1] : '0'
      csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    }
    
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data. Make sure the sheet is public (Anyone with the link can view).')
    }
    
    const csvText = await response.text()
    const workbook = XLSX.read(csvText, { type: 'string' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(worksheet)
  }

  async uploadUrl(sheetsUrl: string): Promise<UploadUrlResponse> {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }

      // Fetch and parse Google Sheets data
      const jsonData = await this.fetchGoogleSheetsData(sheetsUrl)
      const parsedLeads = this.parseGoogleSheetsData(jsonData)
      
      if (parsedLeads.length === 0) {
        throw new Error('No valid data found in the Google Sheet')
      }

      // Add metadata to leads
      const leadsWithMetadata = parsedLeads.map(lead => ({
        ...lead,
        sheet_url: sheetsUrl,
        created_by_user_id: user.id,
        created_by_user_email: user.email || null,
        call_status: 'pending',
        imported_at: new Date().toISOString(),
      }))

      // Insert leads into Supabase
      const { data: insertedLeads, error: insertError } = await supabaseAdmin
        .from('leads')
        .insert(leadsWithMetadata)
        .select('*')

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw new Error(`Failed to save leads to database: ${insertError.message}`)
      }

      if (!insertedLeads) {
        throw new Error('No data returned from database insert')
      }

      // Get the column names from the first lead
      const columns = parsedLeads.length > 0 ? ['FirstName', 'LastName', 'PhoneNumber'] : []

      return {
        message: `Google Sheets content processed and saved successfully. Found ${insertedLeads.length} valid rows.`,
        rows_count: insertedLeads.length,
        columns,
        data: insertedLeads.map(lead => ({
          id: lead.id,
          first_name: lead.first_name,
          last_name: lead.last_name,
          phone_number: lead.phone_number,
          source: lead.source,
          imported_at: lead.imported_at,
          created_at: lead.created_at,
          created_by_user_id: lead.created_by_user_id,
          created_by_user_email: lead.created_by_user_email,
          vapi_call_id: lead.vapi_call_id,
          call_status: lead.call_status,
          call_summary: lead.call_summary,
          call_recording_url: lead.call_recording_url,
          call_transcript: lead.call_transcript,
          success_evaluation: lead.success_evaluation,
          sheet_url: lead.sheet_url
        }))
      }
    } catch (error) {
      console.error('Upload URL error:', error)
      throw error
    }
  }

  async getLeads(): Promise<ProcessedLead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch leads: ${error.message}`)
    }

    return data || []
  }

  async updateCallStatus(leadId: string, status: string, summary?: string, transcript?: string, recordingUrl?: string, successEvaluation?: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({
        call_status: status,
        call_summary: summary || null,
        call_transcript: transcript || null,
        call_recording_url: recordingUrl || null,
        success_evaluation: successEvaluation || null
      })
      .eq('id', leadId)

    if (error) {
      throw new Error(`Failed to update call status: ${error.message}`)
    }
  }
}

export const supabaseService = new SupabaseService()
