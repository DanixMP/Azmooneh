import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, BookOpen, CheckCircle, Award } from 'lucide-react';
import { api, Exam, StudentExam } from '../services/api';
import { TakeExamModal } from './TakeExamModal';

export function StudentExamsView() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [studentExams, setStudentExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [examsData, studentExamsData] = await Promise.all([
        api.getExams(),
        api.getStudentExams(),
      ]);
      setExams(examsData);
      setStudentExams(studentExamsData);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (examId: number) => {
    return studentExams.find((se) => se.exam === examId);
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowExamModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-white mb-8">آزمون‌های فعال</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
            <h2 className="text-2xl text-white mb-4">آزمونی در دسترس نیست</h2>
            <p className="text-gray-400">در حال حاضر آزمون فعالی وجود ندارد</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam, index) => {
            const status = getExamStatus(exam.id);
            const isCompleted = status?.status === 'submitted' || status?.status === 'graded';
            const isInProgress = status?.status === 'in_progress';

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">{exam.title}</h3>
                    {exam.description && (
                      <p className="text-gray-400 text-sm mb-4">{exam.description}</p>
                    )}
                  </div>
                  {isCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      تکمیل شده
                    </span>
                  )}
                  {isInProgress && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      در حال انجام
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>مدت زمان: {exam.duration_minutes} دقیقه</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>تعداد سوالات: {exam.questions?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>نمره کل: {exam.total_marks}</span>
                  </div>
                  {status?.score !== null && status?.score !== undefined && (
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>نمره شما: {status.score} از {exam.total_marks}</span>
                    </div>
                  )}
                </div>

                {isCompleted ? (
                  <button
                    onClick={() => alert('مشاهده نتایج - به زودی')}
                    className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                  >
                    مشاهده نتایج
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    {isInProgress ? 'ادامه آزمون' : 'شروع آزمون'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedExam && (
        <TakeExamModal
          exam={selectedExam}
          isOpen={showExamModal}
          onClose={() => {
            setShowExamModal(false);
            setSelectedExam(null);
          }}
          onSuccess={loadData}
        />
      )}
    </motion.div>
  );
}
