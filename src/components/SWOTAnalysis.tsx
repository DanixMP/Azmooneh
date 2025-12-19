import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Brain } from 'lucide-react';
import { api, SWOTQuestion } from '../services/api';

interface SWOTAnalysisProps {
  onComplete: () => void;
}

export function SWOTAnalysis({ onComplete }: SWOTAnalysisProps) {
  const [questions, setQuestions] = useState<SWOTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

      await api.submitSWOTAnalysis(formattedAnswers);
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl text-white">تحلیل SWOT شخصی</h1>
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
            <h2 className="text-2xl text-white mb-2">
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
