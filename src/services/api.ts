// API Service - Centralized API configuration
import { API_URL } from '../config';

// Base API configuration
export const api = {
  baseURL: API_URL,
  
  // Helper to build full URL
  url(path: string): string {
    return `${this.baseURL}${path}`;
  },
  
  // Helper for fetch with default options
  async fetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(this.url(path), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    return response;
  },
  
  // Convenience methods
  async get(path: string, options: RequestInit = {}) {
    return this.fetch(path, { ...options, method: 'GET' });
  },
  
  async post(path: string, data?: any, options: RequestInit = {}) {
    return this.fetch(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  async put(path: string, data?: any, options: RequestInit = {}) {
    return this.fetch(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  async delete(path: string, options: RequestInit = {}) {
    return this.fetch(path, { ...options, method: 'DELETE' });
  },
};

// API Endpoints
export const endpoints = {
  auth: {
    professorLogin: '/api/auth/professor/login/',
    studentLogin: '/api/auth/student/login/',
    studentSignup: '/api/auth/student/signup/',
    tokenRefresh: '/api/token/refresh/',
  },
  exams: {
    list: '/api/exams/',
    create: '/api/exams/',
    detail: (id: number) => `/api/exams/${id}/`,
    studentExams: '/api/student-exams/',
    startExam: (id: number) => `/api/student-exams/${id}/start_exam/`,
    submitAnswer: (id: number) => `/api/student-exams/${id}/submit_answer/`,
    submitExam: (id: number) => `/api/student-exams/${id}/submit_exam/`,
  },
  swot: {
    questions: '/api/swot/questions/',
    submissions: '/api/swot/submissions/',
    detail: (id: number) => `/api/swot/submissions/${id}/`,
  },
  messages: {
    list: '/api/messages/',
    send: '/api/messages/',
    detail: (id: number) => `/api/messages/${id}/`,
  },
};

export default api;
