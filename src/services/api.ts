const API_BASE_URL = 'http://localhost:8000/api';

interface LoginResponse {
  user: {
    id: number;
    username: string;
    role: string;
    student_id?: string;
    full_name?: string;
    email?: string;
  };
  access: string;
  refresh: string;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  professor: number;
  professor_name: string;
  duration_minutes: number;
  total_marks: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

interface Question {
  id: number;
  question_type: 'single_choice' | 'multiple_choice' | 'true_false' | 'long_answer';
  question_text: string;
  marks: number;
  order: number;
  choices?: Choice[];
}

interface Choice {
  id: number;
  choice_text: string;
  is_correct?: boolean;
}

interface StudentExam {
  id: number;
  student: number;
  student_name: string;
  exam: number;
  exam_title: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  started_at: string | null;
  submitted_at: string | null;
  score: number | null;
  answers?: Answer[];
}

interface Answer {
  id: number;
  question: number;
  selected_choices: number[];
  text_answer: string;
  marks_obtained: number | null;
}

interface SWOTQuestion {
  id: number;
  question_text: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  order: number;
}

interface SWOTAnswer {
  id: number;
  question: SWOTQuestion;
  answer_text: string;
  created_at: string;
}

interface SWOTAnalysis {
  id: number;
  student: number;
  student_name: string;
  created_at: string;
  completed_at: string | null;
  is_completed: boolean;
  answers: SWOTAnswer[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Auth endpoints
  async studentSignup(studentId: string, fullName: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/student/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        full_name: fullName,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const data = await response.json();
    this.setToken(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async professorLogin(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/professor/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  // Exam endpoints
  async getExams(): Promise<Exam[]> {
    const response = await fetch(`${API_BASE_URL}/exams/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exams');
    }

    return response.json();
  }

  async getExam(id: number): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exam');
    }

    return response.json();
  }

  async createExam(examData: any): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(examData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  }

  async updateExam(id: number, examData: any): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(examData),
    });

    if (!response.ok) {
      throw new Error('Failed to update exam');
    }

    return response.json();
  }

  async deleteExam(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete exam');
    }
  }

  async publishExam(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/publish/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to publish exam');
    }
  }

  async unpublishExam(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/unpublish/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to unpublish exam');
    }
  }

  // Student exam endpoints
  async getStudentExams(): Promise<StudentExam[]> {
    const response = await fetch(`${API_BASE_URL}/student-exams/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student exams');
    }

    return response.json();
  }

  async startExam(examId: number): Promise<StudentExam> {
    const response = await fetch(`${API_BASE_URL}/student-exams/start_exam/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ exam_id: examId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start exam');
    }

    return response.json();
  }

  async submitAnswer(studentExamId: number, questionId: number, selectedChoices: number[], textAnswer: string = ''): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/student-exams/${studentExamId}/submit_answer/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        question_id: questionId,
        selected_choices: selectedChoices,
        text_answer: textAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }
  }

  async submitExam(studentExamId: number): Promise<{ status: string; score: number }> {
    const response = await fetch(`${API_BASE_URL}/student-exams/${studentExamId}/submit_exam/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to submit exam');
    }

    return response.json();
  }

  async getStudentExam(id: number): Promise<StudentExam> {
    const response = await fetch(`${API_BASE_URL}/student-exams/${id}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student exam');
    }

    return response.json();
  }

  async getStudentExamDetails(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/student-exams/${id}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student exam details');
    }

    return response.json();
  }

  async getExamDetails(id: number): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exam details');
    }

    return response.json();
  }

  async updateStudentExamMarks(studentExamId: number, answers: { id: number; marks_obtained: number }[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/student-exams/${studentExamId}/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update marks');
    }
  }

  // SWOT Analysis endpoints
  async getSWOTQuestions(): Promise<SWOTQuestion[]> {
    const response = await fetch(`${API_BASE_URL}/swot/questions/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SWOT questions');
    }

    return response.json();
  }

  async submitSWOTAnalysis(answers: { question_id: number; answer_text: string }[]): Promise<SWOTAnalysis> {
    const response = await fetch(`${API_BASE_URL}/swot/analyses/submit/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit SWOT analysis');
    }

    return response.json();
  }

  async getMySWOTAnalyses(): Promise<SWOTAnalysis[]> {
    const response = await fetch(`${API_BASE_URL}/swot/analyses/my_analyses/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SWOT analyses');
    }

    return response.json();
  }

  async getAllSWOTAnalyses(): Promise<SWOTAnalysis[]> {
    const response = await fetch(`${API_BASE_URL}/swot/analyses/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all SWOT analyses');
    }

    return response.json();
  }

  // Message endpoints
  async getMessages(): Promise<StudentMessage[]> {
    const response = await fetch(`${API_BASE_URL}/messages/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async sendMessage(title: string, message: string, professorId?: number): Promise<StudentMessage> {
    const response = await fetch(`${API_BASE_URL}/messages/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        title,
        message,
        professor: professorId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    return response.json();
  }

  async markMessageRead(messageId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/mark_read/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }
  }

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/messages/unread_count/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get unread count');
    }

    const data = await response.json();
    return data.count;
  }

  // Stats endpoints
  async getStudentCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/auth/student-count/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get student count');
    }

    const data = await response.json();
    return data.count;
  }

  async getAllStudents(): Promise<StudentInfo[]> {
    const response = await fetch(`${API_BASE_URL}/auth/students/`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get students');
    }

    return response.json();
  }
}

interface StudentMessage {
  id: number;
  student: number;
  student_name: string;
  professor: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
}

interface StudentInfo {
  id: number;
  name: string;
  student_id: string;
  average: number | null;
  has_swot: boolean;
  exam_count: number;
}

export const api = new ApiService();
export type { Exam, Question, Choice, StudentExam, Answer, LoginResponse, SWOTQuestion, SWOTAnswer, SWOTAnalysis, StudentMessage, StudentInfo };
