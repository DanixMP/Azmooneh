import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Brain, Zap } from 'lucide-react';
import { api, SWOTQuestion } from '../services/api';
import { SWOTSuccessModal } from './SWOTSuccessModal';
import { useAuth } from '../contexts/AuthContext';

interface SWOTAnalysisProps {
  onComplete: () => void;
  onViewResults?: (analysisId: number) => void;
}

export function SWOTAnalysis({ onComplete, onViewResults }: SWOTAnalysisProps) {
  const { student } = useAuth();
  const [questions, setQuestions] = useState<SWOTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedAnalysis, setSubmittedAnalysis] = useState<any>(null);

  // Pre-written answers for quick testing (only for user 403663934)
  const quickAnswers: { [key: string]: string } = {
    'strength': 'من در حل مسائل پیچیده مهارت دارم و می‌توانم به سرعت یاد بگیرم. همچنین در کار تیمی عملکرد خوبی دارم و مسئولیت‌پذیر هستم.',
    'weakness': 'گاهی اوقات در مدیریت زمان مشکل دارم و تمایل دارم کارها را به تعویق بیندازم. همچنین در برخی موارد اعتماد به نفس کافی ندارم.',
    'opportunity': 'فرصت‌های یادگیری آنلاین زیادی وجود دارد که می‌توانم از آنها استفاده کنم. همچنین می‌توانم در پروژه‌های جدید شرکت کنم و تجربه کسب کنم.',
    'threat': 'رقابت شدید در بازار کار و تغییرات سریع تکنولوژی می‌تواند چالش‌برانگیز باشد. همچنین فشار زمانی در تحصیل و کار می‌تواند استرس‌زا باشد.'
  };

  const fillQuickAnswers = () => {
    const newAnswers: { [key: number]: string } = {};
    questions.forEach(q => {
      newAnswers[q.id] = quickAnswers[q.category] || 'پاسخ نمونه برای تست سریع';
    });
    setAnswers(newAnswers);
    setError('');
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await api.getSWOTQuestions();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id] || answers[q.id].trim() === '');
    if (unanswered.length > 0) {
      setError(`لطفا به همه سوالات پاسخ دهید. ${unanswered.length} سوال بدون پاسخ باقی مانده است.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formattedAnswers = questions.map(q => ({
        question_id: q.id,
        answer_text: answers[q.id],
      }));

      const result = await api.submitSWOTAnalysis(formattedAnswers);
      setSubmittedAnalysis(result);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSubmitting(false);
    onComplete();
  };

  const handleViewDetails = () => {
    setShowSuccessModal(false);
    if (submittedAnalysis && onViewResults) {
      onViewResults(submittedAnalysis.id);
    } else {
      onComplete();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'text-green-400 bg-green-500/20';
      case 'weakness': return 'text-red-400 bg-red-500/20';
      case 'opportunity': return 'text-blue-400 bg-blue-500/20';
      case 'threat': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'strength': return 'نقاط قوت';
      case 'weakness': return 'نقاط ضعف';
      case 'opportunity': return 'فرصت‌ها';
      case 'threat': return 'تهدیدها';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">سوالی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Modal */}
      <SWOTSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onViewDetails={handleViewDetails}
        analysis={submittedAnalysis}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl text-white">تحلیل SWOT شخصی</h1>
          </div>
          {/* Quick Answer Button - Only for student ID 403663934 */}
          {student?.studentId === '403663934' && (
            <button
              onClick={fillQuickAnswers}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
              title="پر کردن سریع پاسخ‌ها برای تست"
            >
              <Zap className="w-4 h-4" />
              پاسخ سریع
            </button>
          )}
        </div>
        <p className="text-gray-400">
          به هر سوال با دقت پاسخ دهید. این تحلیل به شما کمک می‌کند نقاط قوت، ضعف، فرصت‌ها و تهدیدهای خود را بشناسید.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            سوال {currentIndex + 1} از {questions.length}
          </span>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-6"
        >
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${getCategoryColor(currentQuestion.category)}`}>
              {getCategoryLabel(currentQuestion.category)}
            </span>
            <h2 className="text-2xl text-white mb-2 break-words whitespace-normal leading-relaxed">
              {currentQuestion.question_text}
            </h2>
          </div>

          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none text-white resize-none"
            rows={6}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
          قبلی
        </button>

        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-purple-500 w-8'
                  : answers[questions[idx].id]
                  ? 'bg-green-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                در حال ارسال...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                ثبت تحلیل
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            بعدی
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
