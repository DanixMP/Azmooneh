import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { StudentExamsView } from './StudentExamsView';
import { SWOTAnalysis } from './SWOTAnalysis';
import { SWOTHistory } from './SWOTHistory';
import { Header } from './Header';
import { Footer } from './Footer';
import { api } from '../services/api';
import {
  Home,
  FileText,
  ClipboardList,
  Award,
  User,
  LogOut,
  Clock,
  CheckCircle,
  BookOpen,
  Menu,
  X,
  Brain,
} from 'lucide-react';

type MenuItem = 'dashboard' | 'active-exams' | 'swot' | 'results' | 'profile';

export function StudentDashboard() {
  const { student, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [swotView, setSWOTView] = useState<'new' | 'history'>('history');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageSending, setMessageSending] = useState(false);

  const menuItems = [
    { id: 'dashboard' as MenuItem, icon: Home, label: 'داشبورد', color: 'indigo' },
    { id: 'active-exams' as MenuItem, icon: FileText, label: 'آزمون‌های فعال', color: 'purple' },
    { id: 'swot' as MenuItem, icon: Brain, label: 'تحلیل SWOT', color: 'green' },
    { id: 'results' as MenuItem, icon: Award, label: 'نتایج و نمرات', color: 'pink' },
    { id: 'profile' as MenuItem, icon: User, label: 'پروفایل', color: 'blue' },
  ];

  const mockExams = [
    { id: 1, title: 'آزمون میان‌ترم ریاضی', date: '1403/09/25', time: '10:00', duration: '90 دقیقه', status: 'active' },
    { id: 2, title: 'آزمون فیزیک عمومی', date: '1403/09/28', time: '14:00', duration: '120 دقیقه', status: 'active' },
    { id: 3, title: 'کوییز برنامه‌نویسی', date: '1403/09/30', time: '09:00', duration: '45 دقیقه', status: 'upcoming' },
  ];

  const mockResults = [
    { id: 1, title: 'آزمون پایان‌ترم ریاضی', score: 18.5, total: 20, date: '1403/08/15' },
    { id: 2, title: 'آزمون فیزیک ۱', score: 16, total: 20, date: '1403/08/10' },
    { id: 3, title: 'کوییز شیمی', score: 19, total: 20, date: '1403/08/05' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col" dir="rtl">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton={true} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : '100%',
          width: 280
        }}
        className="fixed right-0 top-0 h-screen bg-slate-800/95 backdrop-blur-xl border-l border-slate-700/50 z-50 lg:translate-x-0"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              آزمونه
            </motion.h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          {student && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white">{student.firstName} {student.lastName}</p>
                  <p className="text-gray-400 text-sm">{student.studentId}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="lg:mr-[280px] p-8 pt-24 flex-1">

        <div className="max-w-7xl mx-auto">
          {/* Dashboard View */}
          {activeMenu === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* SWOT Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-indigo-600/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-12 mb-8 mt-8 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Brain className="w-16 h-16 text-purple-400" />
                    <h2 className="text-4xl text-white">تحلیل SWOT شخصی</h2>
                  </div>
                  <p className="text-gray-300 text-xl mb-8">
                    نقاط قوت، ضعف، فرصت‌ها و تهدیدهای خود را بشناسید و مسیر رشد خود را مشخص کنید
                  </p>
                  <button
                    onClick={() => {
                      setActiveMenu('swot');
                      setSWOTView('new');
                    }}
                    className="px-16 py-6 bg-gradient-to-l from-purple-600 to-pink-600 text-white text-2xl rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-medium"
                  >
                    شروع تحلیل SWOT
                  </button>
                </div>
              </motion.div>

              {/* Active Exams & Contact Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Exams - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl text-white flex items-center gap-3">
                        <FileText className="w-6 h-6 text-purple-400" />
                        آزمون‌های فعال
                      </h3>
                      <button
                        onClick={() => setActiveMenu('active-exams')}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        مشاهده همه ←
                      </button>
                    </div>
                    <div className="space-y-4">
                      <StudentExamsView />
                    </div>
                  </div>
                </div>

                {/* Contact Professor Box */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl text-white">پیام به استاد</h3>
                        <p className="text-gray-400 text-sm">سوال یا درخواست خود را ارسال کنید</p>
                      </div>
                    </div>
                    
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setMessageSending(true);
                        try {
                          await api.sendMessage(messageTitle, messageText);
                          alert('پیام شما با موفقیت ارسال شد');
                          setMessageTitle('');
                          setMessageText('');
                        } catch (err: any) {
                          alert('خطا در ارسال پیام: ' + err.message);
                        } finally {
                          setMessageSending(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">نام شما</label>
                        <input
                          type="text"
                          value={student?.full_name || ''}
                          disabled
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white opacity-75"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">عنوان پیام</label>
                        <input
                          type="text"
                          value={messageTitle}
                          onChange={(e) => setMessageTitle(e.target.value)}
                          placeholder="موضوع پیام خود را وارد کنید"
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">متن پیام</label>
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="پیام خود را اینجا بنویسید..."
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white resize-none"
                          rows={4}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={messageSending}
                        className="w-full px-4 py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {messageSending ? 'در حال ارسال...' : 'ارسال پیام'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Exams View */}
          {activeMenu === 'active-exams' && <StudentExamsView />}

          {/* SWOT Analysis View */}
          {activeMenu === 'swot' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {swotView === 'history' ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl text-white">تحلیل SWOT</h1>
                    <button
                      onClick={() => setSWOTView('new')}
                      className="px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      تحلیل جدید
                    </button>
                  </div>
                  <SWOTHistory />
                </div>
              ) : (
                <SWOTAnalysis
                  onComplete={() => {
                    setSWOTView('history');
                  }}
                />
              )}
            </motion.div>
          )}

          {/* Results View */}
          {activeMenu === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl text-white mb-8">نتایج و نمرات</h1>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-4 text-right text-gray-300">عنوان آزمون</th>
                        <th className="px-6 py-4 text-right text-gray-300">تاریخ</th>
                        <th className="px-6 py-4 text-right text-gray-300">نمره</th>
                        <th className="px-6 py-4 text-right text-gray-300">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockResults.map((result, index) => (
                        <motion.tr
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-white">{result.title}</td>
                          <td className="px-6 py-4 text-gray-400">{result.date}</td>
                          <td className="px-6 py-4">
                            <span className="text-green-400">{result.score} / {result.total}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                              قبول
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile View */}
          {activeMenu === 'profile' && student && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl text-white mb-8">پروفایل کاربری</h1>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-white mb-2">{student.firstName} {student.lastName}</h2>
                    <p className="text-gray-400">شماره دانشجویی: {student.studentId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">نام</p>
                    <p className="text-white text-xl">{student.firstName}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">نام خانوادگی</p>
                    <p className="text-white text-xl">{student.lastName}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">شماره دانشجویی</p>
                    <p className="text-white text-xl">{student.studentId}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <p className="text-gray-400 mb-2">وضعیت</p>
                    <span className="inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full">
                      فعال
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
