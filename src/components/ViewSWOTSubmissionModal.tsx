import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { api, SWOTAnalysis } from '../services/api';

interface ViewSWOTSubmissionModalProps {
  analysisId: number;
  onClose: () => void;
}

export function ViewSWOTSubmissionModal({ analysisId, onClose }: ViewSWOTSubmissionModalProps) {
  const [analysis, setAnalysis] = useState<SWOTAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const allAnalyses = await api.getAllSWOTAnalyses();
      const found = allAnalyses.find((a: SWOTAnalysis) => a.id === analysisId);
      if (found) {
        setAnalysis(found);
      } else {
        setError('تحلیل یافت نشد');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری جزئیات');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <TrendingUp className="w-5 h-5" />;
      case 'weakness':
        return <TrendingDown className="w-5 h-5" />;
      case 'opportunity':
        return <Target className="w-5 h-5" />;
      case 'threat':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      strength: 'نقاط قوت',
      weakness: 'نقاط ضعف',
      opportunity: 'فرصت‌ها',
      threat: 'تهدیدها',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      strength: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
      },
      weakness: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
      },
      opportunity: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
      },
      threat: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
      },
    };
    return colors[category] || { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' };
  };

  const groupAnswersByCategory = () => {
    if (!analysis) return {};

    const grouped: Record<string, typeof analysis.answers> = {
      strength: [],
      weakness: [],
      opportunity: [],
      threat: [],
    };

    analysis.answers.forEach((answer) => {
      const category = answer.question.category;
      if (category in grouped) {
        grouped[category].push(answer);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md">
          <p className="text-red-400">{error || 'خطا در بارگذاری اطلاعات'}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg">
            بستن
          </button>
        </div>
      </div>
    );
  }

  const groupedAnswers = groupAnswersByCategory();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-white mb-1">تحلیل SWOT - {analysis.student_name}</h2>
                  <p className="text-gray-400">
                    {new Date(analysis.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Object.entries(groupedAnswers).map(([category, answers]) => {
                const colors = getCategoryColor(category);
                return (
                  <div
                    key={category}
                    className={`px-4 py-3 rounded-lg ${colors.bg} border ${colors.border}`}
                  >
                    <div className={`flex items-center gap-2 ${colors.text} mb-1`}>
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
                    </div>
                    <div className="text-white text-xl font-medium">{answers.length} پاسخ</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl text-white">نقاط قوت</h3>
                </div>
                <div className="space-y-3">
                  {groupedAnswers.strength?.length > 0 ? (
                    groupedAnswers.strength.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-400 text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-2">{answer.question.question_text}</p>
                            <p className="text-white">{answer.answer_text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">پاسخی ثبت نشده</p>
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl text-white">نقاط ضعف</h3>
                </div>
                <div className="space-y-3">
                  {groupedAnswers.weakness?.length > 0 ? (
                    groupedAnswers.weakness.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-400 text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-2">{answer.question.question_text}</p>
                            <p className="text-white">{answer.answer_text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">پاسخی ثبت نشده</p>
                  )}
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl text-white">فرصت‌ها</h3>
                </div>
                <div className="space-y-3">
                  {groupedAnswers.opportunity?.length > 0 ? (
                    groupedAnswers.opportunity.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-400 text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-2">{answer.question.question_text}</p>
                            <p className="text-white">{answer.answer_text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">پاسخی ثبت نشده</p>
                  )}
                </div>
              </div>

              {/* Threats */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl text-white">تهدیدها</h3>
                </div>
                <div className="space-y-3">
                  {groupedAnswers.threat?.length > 0 ? (
                    groupedAnswers.threat.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-orange-400 text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm mb-2">{answer.question.question_text}</p>
                            <p className="text-white">{answer.answer_text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">پاسخی ثبت نشده</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
