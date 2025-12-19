import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfessorCardProps {
  onBack: () => void;
}

export function ProfessorCard({ onBack }: ProfessorCardProps) {
  const { loginProfessor } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await loginProfessor(adminId, password);
      if (!success) {
        setError('نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      setError('خطا در ورود. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Header with back button */}
      <div className="bg-gradient-to-l from-purple-600 to-pink-600 p-6 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
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
            <h2 className="text-2xl text-white">پنل اساتید</h2>
            <p className="text-purple-100 text-sm mt-1">مدیریت آزمون‌ها و ارزیابی‌ها</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-8">
        {/* Demo Credentials Info */}
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
        >
          <p className="text-purple-300 text-sm text-center mb-2">اطلاعات ورود نمونه:</p>
          <p className="text-purple-200 text-xs text-center">نام کاربری: prof_test - رمز عبور: prof123</p>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <p className="text-gray-400">لطفا اطلاعات خود را وارد کنید</p>
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">شناسه استاد</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                  placeholder="نام کاربری یا شناسه استاد"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-slate-900/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800" />
                <span>مرا به خاطر بسپار</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                فراموشی رمز عبور
              </a>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-purple-600 to-pink-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'در حال ورود...' : 'ورود به پنل'}</span>
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>در صورت نداشتن دسترسی، با مدیر سیستم تماس بگیرید</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}