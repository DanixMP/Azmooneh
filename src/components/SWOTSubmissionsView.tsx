import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, Brain, Calendar, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { api, SWOTAnalysis } from '../services/api';

interface SWOTSubmissionsViewProps {
  onBack: () => void;
}

export function SWOTSubmissionsView({ onBack }: SWOTSubmissionsViewProps) {
  const [analyses, setAnalyses] = useState<SWOTAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<SWOTAnalysis | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAllSWOTAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری تحلیل‌ها');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = (analysis: SWOTAnalysis) => {
    const categories = {
      strength: 0,
      weakness: 0,
      opportunity: 0,
      threat: 0,
    };

    analysis.answers.forEach((answer) => {
      const category = answer.question.category as keyof typeof categories;
      if (category in categories) {
        categories[category]++;
      }
    });

    return categories;
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
    const colors: Record<string, string> = {
      strength: 'text-green-400 bg-green-500/20',
      weakness: 'text-red-400 bg-red-500/20',
      opportunity: 'text-blue-400 bg-blue-500/20',
      threat: 'text-orange-400 bg-orange-500/20',
    };
    return colors[category] || 'text-gray-400 bg-gray-500/20';
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

  const getCategoryColorDetail = (category: string) => {
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

  const groupAnswersByCategory = (analysis: SWOTAnalysis) => {
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // If an analysis is selected, show detail view
  if (selectedAnalysis) {
    const groupedAnswers = groupAnswersByCategory(selectedAnalysis);
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-6 mb-12 mt-2">
          <button
            onClick={() => setSelectedAnalysis(null)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl text-white mb-2">تحلیل SWOT - {selectedAnalysis.student_name}</h1>
              <p className="text-gray-400 text-lg">
                {new Date(selectedAnalysis.created_at).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {Object.entries(groupedAnswers).map(([category, answers]) => {
            const colors = getCategoryColorDetail(category);
            return (
              <div
                key={category}
                className={`px-4 py-3 rounded-xl ${colors.bg} border ${colors.border}`}
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

        {/* Content Grid */}
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
      </motion.div>
    );
  }

  // Show grid view
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl text-white">تحلیل‌های SWOT دانشجویان</h1>
          <p className="text-gray-400 mt-1">مشاهده و بررسی تحلیل‌های ارسال شده</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {analyses.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-4">هنوز تحلیل SWOT ثبت نشده</h2>
            <p className="text-gray-400">تحلیل‌ها پس از ارسال توسط دانشجویان نمایش داده می‌شوند</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis, index) => {
            const stats = getCategoryStats(analysis);
            return (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{analysis.student_name}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(analysis.created_at).toLocaleDateString('fa-IR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(stats).map(([category, count]) => (
                    <div
                      key={category}
                      className={`px-3 py-2 rounded-lg ${getCategoryColor(category)}`}
                    >
                      <div className="text-xs opacity-75">{getCategoryLabel(category)}</div>
                      <div className="text-lg font-medium">{count} پاسخ</div>
                    </div>
                  ))}
                </div>

                {/* Total Answers */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-gray-400 text-sm">
                    کل پاسخ‌ها: {analysis.answers.length}
                  </span>
                  <button
                    onClick={() => setSelectedAnalysis(analysis)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    مشاهده جزئیات
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
