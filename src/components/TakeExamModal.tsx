import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle } from 'lucide-react';
import { api, Exam, Question, StudentExam } from '../services/api';

interface TakeExamModalProps {
  exam: Exam;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TakeExamModal({ exam, isOpen, onClose, onSuccess }: TakeExamModalProps) {
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [answers, setAnswers] = useState<Record<number, { selectedChoices: number[]; textAnswer: string }>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isOpen && exam) {
      startExam();
    }
  }, [isOpen, exam]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const startExam = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.startExam(exam.id);
      setStudentExam(response);
      setTimeLeft(exam.duration_minutes * 60);
    } catch (err: any) {
      setError(err.message || 'خطا در شروع آزمون');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, selectedChoices: number[], textAnswer: string = '') => {
    setAnswers({
      ...answers,
      [questionId]: { selectedChoices, textAnswer },
    });
  };

  const handleSubmit = async () => {
    if (!studentExam) return;

    setSubmitting(true);
    setError('');

    try {
      // Submit all answers
      for (const [questionId, answer] of Object.entries(answers)) {
        await api.submitAnswer(
          studentExam.id,
          Number(questionId),
          answer.selectedChoices,
          answer.textAnswer
        );
      }

      // Submit exam
      await api.submitExam(studentExam.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال آزمون');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center"
            >
              <div className="text-white text-xl mb-4">در حال بارگذاری آزمون...</div>
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-2xl text-white">{exam.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{exam.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className={`text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Question Progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-400 text-sm">
                  سوال {currentQuestionIndex + 1} از {exam.questions?.length || 0}
                </div>
                <div className="flex gap-2">
                  {exam.questions?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-purple-600 text-white'
                          : answers[exam.questions![index].id]
                          ? 'bg-green-600/30 text-green-400 hover:bg-green-600/50'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Question */}
              {exam.questions && exam.questions[currentQuestionIndex] && (() => {
                const question = exam.questions[currentQuestionIndex];
                return (
                <div key={question.id} className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-white text-lg">
                      {currentQuestionIndex + 1}. {question.question_text}
                    </h3>
                    <span className="text-purple-400 text-sm">{question.marks} نمره</span>
                  </div>

                  {question.question_type === 'long_answer' ? (
                    <textarea
                      value={answers[question.id]?.textAnswer || ''}
                      onChange={(e) => handleAnswerChange(question.id, [], e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      rows={5}
                      placeholder="پاسخ خود را بنویسید..."
                    />
                  ) : (
                    <div className="space-y-2">
                      {question.choices?.map((choice) => (
                        <label
                          key={choice.id}
                          className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                            name={`question-${question.id}`}
                            checked={answers[question.id]?.selectedChoices?.includes(choice.id) || false}
                            onChange={(e) => {
                              const currentAnswers = answers[question.id]?.selectedChoices || [];
                              let newAnswers: number[];

                              if (question.question_type === 'multiple_choice') {
                                if (e.target.checked) {
                                  newAnswers = [...currentAnswers, choice.id];
                                } else {
                                  newAnswers = currentAnswers.filter((id) => id !== choice.id);
                                }
                              } else {
                                newAnswers = [choice.id];
                              }

                              handleAnswerChange(question.id, newAnswers);
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-white">{choice.choice_text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
              })()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  سوال قبل
                </button>
                <div className="text-gray-400 text-sm">
                  {Object.keys(answers).length} از {exam.questions?.length || 0} پاسخ داده شده
                </div>
                <button
                  onClick={() => setCurrentQuestionIndex(Math.min((exam.questions?.length || 1) - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === (exam.questions?.length || 1) - 1}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  سوال بعد
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800">
              <div className="text-gray-400 text-sm">
                {Object.keys(answers).length} از {exam.questions?.length || 0} سوال پاسخ داده شده
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{submitting ? 'در حال ارسال...' : 'ارسال آزمون'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
