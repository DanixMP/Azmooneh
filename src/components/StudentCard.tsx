import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, User, IdCard, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface StudentCardProps {
  onBack: () => void;
}

export function StudentCard({ onBack }: StudentCardProps) {
  const { loginStudent, registerStudent } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await loginStudent(studentId, password);
      if (!success) {
        setError('شماره دانشجویی یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      setError('خطا در ورود. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await registerStudent(fullName, studentId, password);
      if (!success) {
        setError('این شماره دانشجویی قبلا ثبت شده است.');
      }
    } catch (err) {
      setError('خطا در ثبت نام. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Header with back button */}
      <div className="bg-gradient-to-l from-indigo-600 to-purple-600 p-6 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت</span>
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl text-white">ورود دانشجو</h2>
            <p className="text-indigo-100 text-sm mt-1">به سامانه آزمون خوش آمدید</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-8">
        {/* Demo Credentials Info */}
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl"
        >
          <p className="text-indigo-300 text-sm text-center mb-2">اطلاعات ورود نمونه:</p>
          <p className="text-indigo-200 text-xs text-center">شماره دانشجویی: 401234567 یا 401234568</p>
        </motion.div> */}

        {/* Mode Toggle */}
        <div className="flex gap-3 mb-8 bg-slate-900/50 p-1.5 rounded-xl">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              mode === 'login'
                ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            ورود
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              mode === 'register'
                ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            ثبت نام
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Forms */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">شماره دانشجویی</label>
                <div className="relative">
                  <IdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pr-12 pl-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                    placeholder="مثال: 403663333"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">رمز عبور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                  disabled={loading}
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-5 h-5" />
                <span>{loading ? 'در حال ورود...' : 'ورود به سامانه'}</span>
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                  placeholder="نام کامل خود را وارد کنید"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">شماره دانشجویی</label>
                <div className="relative">
                  <IdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pr-12 pl-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                    placeholder="مثال:  403663333"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">رمز عبور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                <span>{loading ? 'در حال ثبت نام...' : 'ثبت نام'}</span>
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}