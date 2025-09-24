/// <reference types="vite/client" />
// Import environment configuration
import { getApiUrl, isDevelopment } from "./env";

// Get the appropriate base URL from the environment configuration
const API_BASE_URL = `${getApiUrl()}`;
// Log the API base URL being used
if (isDevelopment) {
  console.log(`Using API base URL: ${API_BASE_URL}`);
}


export const API_ENDPOINTS = {
    CONTACT: `${API_BASE_URL}/contact/`,
    AUTH: {
      SIGNUP: `${API_BASE_URL}/auth/signup`,
      SIGNIN: `${API_BASE_URL}/auth/signin`,
      LOGOUT: `${API_BASE_URL}/auth/logout`,
      VERIFY_TOKEN: `${API_BASE_URL}/auth/token/verify`,
      RESET_PASSWORD: `${API_BASE_URL}/auth/password/reset`,
      ME: `${API_BASE_URL}/auth/me`,
      // OTP signup/login flow (backend)
      OTP_REQUEST: `${API_BASE_URL}/auth/otp/request`,
      OTP_VERIFY: `${API_BASE_URL}/auth/otp/verify`,
    },
    OUTBOUND: {
      UPLOAD_URL: `${API_BASE_URL}/outbound/upload_url`,
      UPLOAD_EXCEL: `${API_BASE_URL}/outbound/upload_excel`,
      GET_LEADS: `${API_BASE_URL}/outbound/get_leads`,
      GET_SUMMARY_BY_ID: `${API_BASE_URL}/outbound/get_summary_by_lead_id`,
      CALL_LEADS: `${API_BASE_URL}/outbound/call_leads`,
      GET_ASSISTANTS: `${API_BASE_URL}/outbound/get_assistants`,
    },
    INBOUND: {
      GET_CALLS: `${API_BASE_URL}/inbound/get_calls`,
      GET_CALL: `${API_BASE_URL}/inbound/get_call`,
      DASHBOARD_STATS: `${API_BASE_URL}/inbound/dashboard/stats`,
    },
    RECEPTIONIST: {
      GET_ASSISTANTS: `${API_BASE_URL}/create_receptionist/get_assistants`,
      GET_PHONE_NUMBERS: `${API_BASE_URL}/create_receptionist/get_available_phoneNumber`,
      CREATE: `${API_BASE_URL}/create_receptionist/`,
      GET_RECEPTIONISTS: `${API_BASE_URL}/create_receptionist/get_receptionists`,
      DELETE: (id: string) => `${API_BASE_URL}/create_receptionist/${id}`,
      UPDATE: (id: string) => `${API_BASE_URL}/create_receptionist/${id}`,
    },
  };
  