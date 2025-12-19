import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Users } from 'lucide-react';
import { api, Exam } from '../services/api';
import { CreateExamModal } from './CreateExamModal';
import { StudentSubmissionsView } from './StudentSubmissionsView';

export function ProfessorExamsView() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [viewingSubmissions, setViewingSubmissions] = useState<{ examId: number; examTitle: string } | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getExams();
      setExams(data);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری آزمون‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (examId: number, isPublished: boolean) => {
    try {
      if (isPublished) {
        await api.unpublishExam(examId);
      } else {
        await api.publishExam(examId);
      }
      loadExams();
    } catch (err: any) {
      alert('خطا: ' + err.message);
    }
  };

  const handleDelete = async (examId: number) => {
    if (!confirm('آیا از حذف این آزمون اطمینان دارید؟')) return;

    try {
      await api.deleteExam(examId);
      loadExams();
    } catch (err: any) {
      alert('خطا: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show submissions view if selected
  if (viewingSubmissions) {
    return (
      <StudentSubmissionsView
        examId={viewingSubmissions.examId}
        examTitle={viewingSubmissions.examTitle}
        onBack={() => setViewingSubmissions(null)}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-white">مدیریت آزمون‌ها</h1>
        <button
          onClick={() => setShowCreateModal(!showCreateModal)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{showCreateModal ? 'بستن' : 'ایجاد آزمون جدید'}</span>
        </button>
      </div>

      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadExams();
          setShowCreateModal(false);
        }}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
            <h2 className="text-2xl text-white mb-4">هنوز آزمونی ایجاد نشده</h2>
            <p className="text-gray-400 mb-6">برای شروع، اولین آزمون خود را ایجاد کنید</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>ایجاد آزمون</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-gray-300">عنوان</th>
                  <th className="px-6 py-4 text-right text-gray-300">تعداد سوالات</th>
                  <th className="px-6 py-4 text-right text-gray-300">مدت زمان</th>
                  <th className="px-6 py-4 text-right text-gray-300">نمره کل</th>
                  <th className="px-6 py-4 text-right text-gray-300">وضعیت</th>
                  <th className="px-6 py-4 text-right text-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <motion.tr
                    key={exam.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{exam.title}</p>
                        {exam.description && (
                          <p className="text-gray-400 text-sm mt-1">{exam.description.substring(0, 50)}...</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{exam.questions?.length || 0}</td>
                    <td className="px-6 py-4 text-gray-400">{exam.duration_minutes} دقیقه</td>
                    <td className="px-6 py-4 text-gray-400">{exam.total_marks}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handlePublish(exam.id, exam.is_published)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                          exam.is_published
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        {exam.is_published ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            منتشر شده
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            پیش‌نویس
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingSubmissions({ examId: exam.id, examTitle: exam.title })}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                          title="مشاهده پاسخ‌های دانشجویان"
                        >
                          <Users className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          onClick={() => alert('مشاهده جزئیات - به زودی')}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => alert('ویرایش - به زودی')}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-purple-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
