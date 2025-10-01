import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { authService } from "./authService";
import { receptionistService } from "./receptionistService";
import { supabase } from "@/lib/supabase";

async function authedFetch(url: string, options: RequestInit = {}) {
  // reuse receptionistService auth helper
  //@ts-ignore
  return receptionistService.makeRequest(url, options);
}

async function getAuthToken(): Promise<string | null> {
  // First try to get Supabase token
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return session.access_token;
  } catch (error) {
    console.warn('Failed to get Supabase session:', error);
  }
  
  // Fallback to legacy authService token
  return authService.getToken();
}

export const knowledgeService = {
  async uploadDocument(receptionistId: string, file: File) {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available. Please sign in again.');
      }

      const form = new FormData();
      form.append("file", file);
      form.append("receptionist_id", receptionistId);
      
      // For FormData, don't set Content-Type - let browser set it with boundary
      const response = await fetch(API_ENDPOINTS.KNOWLEDGE.DOC_UPLOAD, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          // No Content-Type header for FormData
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to upload document' };
    }
  },

  async scrapeUrl(receptionistId: string, url: string) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.URL_SCRAPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, receptionist_id: receptionistId }),
      });
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to scrape URL' };
    }
  },

  async processText(
    receptionistId: string,
    text: string,
    name: string,
    description: string,
    useAiEnhancement: boolean = true
  ) {
    try {
      const endpoint = useAiEnhancement 
        ? API_ENDPOINTS.KNOWLEDGE.TEXT_PROCESS 
        : API_ENDPOINTS.KNOWLEDGE.TEXT_PROCESS_SIMPLE;
      
      const data = await authedFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, name, description, receptionist_id: receptionistId }),
      });
      
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to process text' };
    }
  },

  async listChunks(receptionistId: string) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.LIST_CHUNKS(receptionistId));
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to load chunks' };
    }
  },

  async updateChunk(chunkId: string, updates: any) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.UPDATE_CHUNK(chunkId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update chunk' };
    }
  },

  async deleteChunk(chunkId: string) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.DELETE_CHUNK(chunkId), {
        method: "DELETE",
      });
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete chunk' };
    }
  },

  async batchToggleChunks(receptionistId: string, chunks: Array<{chunk_id: string, is_attached: boolean}>) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.BATCH_TOGGLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receptionist_id: receptionistId,
          chunks: chunks,
        }),
      });
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to batch toggle chunks' };
    }
  },
};
