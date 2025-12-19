// API Service - Centralized API configuration
import { API_URL } from '../config';

// Type definitions
export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  start_time: string;
  end_time: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  text: string;
  question_type: 'single' | 'multiple' | 'true_false' | 'descriptive';
  marks: number;
  choices?: Choice[];
}

export interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}

export interface StudentExam {
  id: number;
  exam: Exam;
  student: number;
  start_time: string;
  end_time: string | null;
  score: number | null;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
}

export interface SWOTQuestion {
  id: number;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  text: string;
}

export interface SWOTAnalysis {
  id: number;
  student: number;
  created_at: string;
  answers: SWOTAnswer[];
}

export interface SWOTAnswer {
  id: number;
  question: SWOTQuestion;
  answer: string;
}

export interface StudentMessage {
  id: number;
  student: number;
  professor: number;
  message: string;
  created_at: string;
}

export interface StudentInfo {
  id: number;
  username: string;
  full_name: string;
  student_id: string;
}

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

  // Authentication methods
  async professorLogin(username: string, password: string) {
    const response = await fetch(this.url('/api/auth/professor/login/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('token', data.access);
    return data;
  },

  async studentLogin(username: string, password: string) {
    const response = await fetch(this.url('/api/auth/student/login/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('token', data.access);
    return data;
  },

  async studentSignup(studentId: string, fullName: string, password: string) {
    const response = await fetch(this.url('/api/auth/student/signup/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, full_name: fullName, password }),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('token', data.access);
    return data;
  },

  async getCurrentUser() {
    const response = await this.get('/api/auth/me/');
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    return response.json();
  },

  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
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
