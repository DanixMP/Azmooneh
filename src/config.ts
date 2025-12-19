// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/accounts/login/`,
    register: `${API_URL}/api/accounts/register/`,
    refresh: `${API_URL}/api/accounts/token/refresh/`,
  },
  exams: `${API_URL}/api/exams/`,
  swot: `${API_URL}/api/swot/`,
  messages: `${API_URL}/api/messages/`,
};
