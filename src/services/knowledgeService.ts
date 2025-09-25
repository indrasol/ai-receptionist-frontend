import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { receptionistService } from "./receptionistService";

async function authedFetch(url: string, options: RequestInit = {}) {
  // reuse receptionistService auth helper
  //@ts-ignore
  return receptionistService.makeRequest(url, options);
}

export const knowledgeService = {
  uploadDocument: (receptionistId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("receptionist_id", receptionistId);
    return authedFetch(API_ENDPOINTS.KNOWLEDGE.DOC_UPLOAD, {
      method: "POST",
      body: form,
    });
  },

  scrapeUrl: (receptionistId: string, url: string) =>
    authedFetch(API_ENDPOINTS.KNOWLEDGE.URL_SCRAPE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, receptionist_id: receptionistId }),
    }),

  processText: (
    receptionistId: string,
    text: string,
    name: string,
    description: string
  ) =>
    authedFetch(API_ENDPOINTS.KNOWLEDGE.TEXT_PROCESS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, name, description, receptionist_id: receptionistId }),
    }),

  async listChunks(receptionistId: string) {
    try {
      const data = await authedFetch(API_ENDPOINTS.KNOWLEDGE.LIST_CHUNKS(receptionistId));
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to load chunks' };
    }
  },
};
