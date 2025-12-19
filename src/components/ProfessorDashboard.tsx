import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ProfessorExamsView } from './ProfessorExamsView';
import { SWOTSubmissionsView } from './SWOTSubmissionsView';
import { Header } from './Header';
import { Footer } from './Footer';
import { api, SWOTAnalysis, StudentMessage, StudentInfo } from '../services/api';
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Brain,
  Mail,
  Eye,
  MessageSquare,
} from 'lucide-react';

type MenuItem = 'dashboard' | 'exams' | 'swot' | 'students' | 'analytics' | 'settings';

export function ProfessorDashboard() {
  const { professor, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [swotAnalyses, setSWOTAnalyses] = useState<SWOTAnalysis[]>([]);
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    loadSWOTAnalyses();
    loadMessages();
    loadUnreadCount();
    loadStudentCount();
  }, []);

  const loadSWOTAnalyses = async () => {
    try {
      const data = await api.getAllSWOTAnalyses();
      setSWOTAnalyses(data);
    } catch (err) {
      console.error('Failed to load SWOT analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await api.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const loadStudentCount = async () => {
    try {
      const count = await api.getStudentCount();
      setStudentCount(count);
    } catch (err) {
      console.error('Failed to load student count:', err);
    }
  };

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await api.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleMarkRead = async (messageId: number) => {
    try {
      await api.markMessageRead(messageId);
      await loadMessages();
      await loadUnreadCount();
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const menuItems = [
    { id: 'dashboard' as MenuItem, icon: Home, label: 'داشبورد' },
    { id: 'exams' as MenuItem, icon: FileText, label: 'مدیریت آزمون‌ها' },
    { id: 'swot' as MenuItem, icon: Brain, label: 'تحلیل‌های SWOT' },
    { id: 'students' as MenuItem, icon: Users, label: 'دانشجویان' },
    { id: 'analytics' as MenuItem, icon: BarChart3, label: 'گزارشات و آمار' },
    { id: 'settings' as MenuItem, icon: Settings, label: 'تنظیمات' },
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
              className="text-2xl bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent"
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
          {professor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                  {professor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white">{professor.name}</p>
                  <p className="text-gray-400 text-sm">استاد</p>
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
                      ? 'bg-gradient-to-l from-purple-600 to-pink-600 text-white shadow-lg'
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
            transition={{ delay: 0.5 }}
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
              <h1 className="text-3xl text-white mb-2">خوش آمدید، {professor?.name}!</h1>
              <p className="text-gray-400 mb-8">مدیریت آزمون‌ها و نظارت بر عملکرد دانشجویان</p>

              {/* Stats - SWOT Focused */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 mb-1">تحلیل‌های SWOT</p>
                      <p className="text-4xl text-white mb-2">{loading ? '...' : swotAnalyses.length}</p>
                      <p className="text-purple-400 text-sm">دانشجو تحلیل انجام داده‌اند</p>
                    </div>
                    <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-9 h-9 text-purple-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 mb-1">کل دانشجویان</p>
                      <p className="text-4xl text-white mb-2">{loading ? '...' : studentCount}</p>
                      <p className="text-blue-400 text-sm">
                        {studentCount > 0 ? `${Math.round((swotAnalyses.length / studentCount) * 100)}% تحلیل انجام داده‌اند` : 'بدون دانشجو'}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-9 h-9 text-blue-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 mb-1">پیام‌های جدید</p>
                      <p className="text-4xl text-white mb-2">{unreadCount}</p>
                      <p className="text-green-400 text-sm">نیاز به پاسخ دارند</p>
                    </div>
                    <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Mail className="w-9 h-9 text-green-400" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* SWOT Results - 2 columns */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl text-white flex items-center gap-3">
                        <Brain className="w-6 h-6 text-purple-400" />
                        تحلیل‌های SWOT دانشجویان
                      </h3>
                      <button className="text-purple-400 hover:text-purple-300 text-sm">
                        مشاهده همه ←
                      </button>
                    </div>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                        </div>
                      ) : swotAnalyses.length === 0 ? (
                        <div className="text-center py-8">
                          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">هنوز تحلیل SWOT ثبت نشده است</p>
                        </div>
                      ) : (
                        <>
                          {swotAnalyses.slice(0, 4).map((analysis) => (
                            <div key={analysis.id} className="bg-slate-900/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900/70 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{analysis.student_name}</p>
                                  <p className="text-gray-400 text-sm">
                                    {new Date(analysis.created_at).toLocaleDateString('fa-IR')} • {analysis.answers.length} پاسخ
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setActiveMenu('swot')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </button>
                            </div>
                          ))}
                          {swotAnalyses.length > 4 && (
                            <button
                              onClick={() => setActiveMenu('swot')}
                              className="w-full py-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                            >
                              مشاهده همه ({swotAnalyses.length}) ←
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Messages - 1 column */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl text-white flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                        پیام‌های دانشجویان
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">{unreadCount} جدید</span>
                      )}
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">هنوز پیامی دریافت نشده است</p>
                        </div>
                      ) : (
                        messages.slice(0, 5).map((message) => (
                          <div 
                            key={message.id} 
                            className={`bg-slate-900/50 rounded-xl p-4 hover:bg-slate-900/70 transition-colors cursor-pointer ${!message.is_read ? 'border-r-4 border-green-500' : ''}`}
                            onClick={() => handleMarkRead(message.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-white font-medium">{message.student_name}</p>
                                <p className="text-gray-300 text-sm mt-1">{message.title}</p>
                              </div>
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-500 text-xs">{message.time_ago}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Exams Management View */}
          {activeMenu === 'exams' && <ProfessorExamsView />}

          {/* SWOT Submissions View */}
          {activeMenu === 'swot' && <SWOTSubmissionsView onBack={() => setActiveMenu('dashboard')} />}

          {/* Students View */}
          {activeMenu === 'students' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onAnimationComplete={() => {
                if (students.length === 0 && !studentsLoading) {
                  loadStudents();
                }
              }}
            >
              <h1 className="text-3xl text-white mb-8">دانشجویان</h1>
              
              {studentsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl text-white mb-4">هنوز دانشجویی ثبت نشده</h2>
                    <p className="text-gray-400">دانشجویان پس از ثبت‌نام نمایش داده می‌شوند</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900/50">
                        <tr>
                          <th className="px-6 py-4 text-right text-gray-300">نام و نام خانوادگی</th>
                          <th className="px-6 py-4 text-right text-gray-300">شماره دانشجویی</th>
                          <th className="px-6 py-4 text-right text-gray-300">تعداد آزمون</th>
                          <th className="px-6 py-4 text-right text-gray-300">میانگین</th>
                          <th className="px-6 py-4 text-right text-gray-300">SWOT</th>
                          <th className="px-6 py-4 text-right text-gray-300">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="px-6 py-4 text-white">{student.name}</td>
                            <td className="px-6 py-4 text-gray-400">{student.student_id}</td>
                            <td className="px-6 py-4 text-gray-400">{student.exam_count}</td>
                            <td className="px-6 py-4">
                              {student.average !== null ? (
                                <span className="text-green-400">{student.average}</span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {student.has_swot ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                  ✓ دارد
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                                  ندارد
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                                مشاهده جزئیات
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics & Settings placeholders */}
          {(activeMenu === 'analytics' || activeMenu === 'settings') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
                <h2 className="text-2xl text-white mb-4">
                  {activeMenu === 'analytics' ? 'گزارشات و آمار' : 'تنظیمات'}
                </h2>
                <p className="text-gray-400">این بخش به زودی راه‌اندازی خواهد شد</p>
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
