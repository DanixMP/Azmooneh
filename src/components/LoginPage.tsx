import { useState } from 'react';
import { StudentCard } from './StudentCard';
import { ProfessorCard } from './ProfessorCard';
import { ConnectionTest } from './ConnectionTest';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Users } from 'lucide-react';

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<'student' | 'professor' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl mb-4 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            آزمونه
            
          </h1>
          <p className="text-gray-400">سامانه برگزاری آزمون و تست های دانشگاهی</p>
        </motion.div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {activeCard === null ? (
              <motion.div
                key="split-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl"
              >
                <div className="grid grid-cols-2 h-[600px]">
                  {/* Student Half */}
                  <motion.button
                    onClick={() => setActiveCard('student')}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-l border-slate-700/50 p-12 flex flex-col items-center justify-center group cursor-pointer transition-all"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500"
                    />
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-24 h-24 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm border border-indigo-400/30"
                    >
                      <Users className="w-12 h-12 text-indigo-400" />
                    </motion.div>
                    
                    <h2 className="text-3xl text-white mb-3 relative z-10">دانشجو</h2>
                    <p className="text-gray-400 text-center relative z-10 mb-6">
                      ورود و ثبت نام دانشجویان
                    </p>
                    
                    <div className="text-sm text-indigo-300 relative z-10">
                      کلیک کنید برای ورود ←
                    </div>
                  </motion.button>

                  {/* Professor Half */}
                  <motion.button
                    onClick={() => setActiveCard('professor')}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden bg-gradient-to-bl from-purple-600/20 to-pink-600/20 p-12 flex flex-col items-center justify-center group cursor-pointer transition-all"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-bl from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"
                    />
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-24 h-24 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm border border-purple-400/30"
                    >
                      <GraduationCap className="w-12 h-12 text-purple-400" />
                    </motion.div>
                    
                    <h2 className="text-3xl text-white mb-3 relative z-10">استاد</h2>
                    <p className="text-gray-400 text-center relative z-10 mb-6">
                      پنل مدیریت اساتید
                    </p>
                    
                    <div className="text-sm text-purple-300 relative z-10">
                      کلیک کنید برای ورود ←
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            ) : activeCard === 'student' ? (
              <motion.div
                key="student-form"
                initial={{ scale: 0.5, opacity: 0, originX: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0, originX: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <StudentCard onBack={() => setActiveCard(null)} />
              </motion.div>
            ) : (
              <motion.div
                key="professor-form"
                initial={{ scale: 0.5, opacity: 0, originX: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0, originX: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <ProfessorCard onBack={() => setActiveCard(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>سامانه آزمونه - مدیریت هوشمند آزمون‌های دانشگاهی</p>
        </motion.div>
      </div>

      {/* Connection Test - Remove this after testing */}
    </div>
  );
}