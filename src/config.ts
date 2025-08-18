// Replace with your actual backend API URL
const API_BASE_URL_DEV = import.meta.env.VITE_DEV_API_URL || "http://localhost:8000";
const API_BASE_URL_PROD = import.meta.env.VITE_PROD_API_URL;


// const API_BASE_URL = API_BASE_URL_DEV
const API_BASE_URL = API_BASE_URL_PROD

export const API_ENDPOINTS = {
  CONTACT: `${API_BASE_URL}/contact/`,
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/token/verify`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/password/reset`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  OUTBOUND: {
    UPLOAD_URL: `${API_BASE_URL}/outbound/upload_url`,
    UPLOAD_EXCEL: `${API_BASE_URL}/outbound/upload_excel`,
    GET_LEADS: `${API_BASE_URL}/outbound/get_leads`,
    GET_SUMMARY_BY_ID: `${API_BASE_URL}/outbound/get_summary_by_lead_id`,
    CALL_LEADS: `${API_BASE_URL}/outbound/call_leads`,
    GET_ASSISTANTS: `${API_BASE_URL}/outbound/get_assistants`,
  },
};
