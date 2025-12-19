import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { student, professor, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (student) {
    return <StudentDashboard />;
  }

  if (professor) {
    return <ProfessorDashboard />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}