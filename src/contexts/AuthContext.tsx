import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../services/api';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  username: string;
}

interface Professor {
  id: number;
  username: string;
  name: string;
}

interface AuthContextType {
  student: Student | null;
  professor: Professor | null;
  loading: boolean;
  loginStudent: (studentId: string, password: string) => Promise<boolean>;
  registerStudent: (fullName: string, studentId: string, password: string) => Promise<boolean>;
  loginProfessor: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const user = await api.getCurrentUser();
          if (user.role === 'student') {
            const [firstName, ...lastNameParts] = (user.full_name || '').split(' ');
            setStudent({
              id: user.id,
              firstName: firstName || '',
              lastName: lastNameParts.join(' ') || '',
              studentId: user.student_id || '',
              username: user.username,
            });
          } else if (user.role === 'professor') {
            setProfessor({
              id: user.id,
              username: user.username,
              name: user.username,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          api.clearToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginStudent = async (studentId: string, password: string): Promise<boolean> => {
    try {
      // Students login with their student_id as username
      const response = await api.studentLogin(studentId, password);
      
      if (response.user.role !== 'student') {
        throw new Error('Not a student account');
      }

      const [firstName, ...lastNameParts] = (response.user.full_name || '').split(' ');
      setStudent({
        id: response.user.id,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        studentId: response.user.student_id || studentId,
        username: response.user.username,
      });
      return true;
    } catch (error) {
      console.error('Student login failed:', error);
      return false;
    }
  };

  const registerStudent = async (fullName: string, studentId: string, password: string): Promise<boolean> => {
    try {
      const response = await api.studentSignup(studentId, fullName, password);
      
      const [firstName, ...lastNameParts] = fullName.split(' ');
      setStudent({
        id: response.user.id,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        studentId: response.user.student_id || studentId,
        username: response.user.username,
      });
      return true;
    } catch (error) {
      console.error('Student registration failed:', error);
      return false;
    }
  };

  const loginProfessor = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.professorLogin(username, password);
      
      if (response.user.role !== 'professor') {
        throw new Error('Not a professor account');
      }

      setProfessor({
        id: response.user.id,
        username: response.user.username,
        name: response.user.username,
      });
      return true;
    } catch (error) {
      console.error('Professor login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setStudent(null);
    setProfessor(null);
    api.clearToken();
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        professor,
        loading,
        loginStudent,
        registerStudent,
        loginProfessor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
