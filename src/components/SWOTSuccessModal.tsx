import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, TrendingUp, Award, Eye, Sparkles } from 'lucide-react';

interface SWOTSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  analysis: {
    ai_analyzed: boolean;
    personality_type: string;
    overall_score: number;
    ai_summary: string;
  } | null;
}

export function SWOTSuccessModal({ isOpen, onClose, onViewDetails, analysis }: SWOTSuccessModalProps) {
  if (!isOpen || !analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 60) return 'from-blue-600 to-cyan-600';
    if (score >= 40) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'عالی';
    if (score >= 60) return 'خوب';
    if (score >= 40) return 'متوسط';
    return 'نیاز به بهبود';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container with Blur Box */}
            <div className="w-full max-w-xl bg-slate-900/75 backdrop-blur-xl rounded-3xl p-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
              >
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 border-b border-purple-500/30 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="p-2 sm:p-3 bg-purple-500/20 rounded-xl"
                    >
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg sm:text-2xl text-white font-bold">تحلیل شما آماده است!</h2>
                      <p className="text-purple-300 text-xs sm:text-sm">تحلیل شخصیت با هوش مصنوعی</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full mb-3 sm:mb-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl text-white mb-2">تحلیل SWOT شما با موفقیت ثبت شد</h3>
                  <p className="text-sm sm:text-base text-gray-400">هوش مصنوعی پاسخ‌های شما را تحلیل کرده است</p>
                </motion.div>

                {/* Personality Type */}
                {analysis.ai_analyzed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      <h4 className="text-base sm:text-lg text-white font-bold">نوع شخصیت شما</h4>
                    </div>
                    <p className="text-xl sm:text-2xl text-purple-300 font-bold">
                      {analysis.personality_type}
                    </p>
                  </motion.div>
                )}

                {/* Overall Score */}
                {analysis.ai_analyzed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                      <h4 className="text-base sm:text-lg text-white font-bold">امتیاز کلی</h4>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">ارزیابی شخصیت</span>
                          <span className={`text-sm font-bold ${getScoreColor(analysis.overall_score)}`}>
                            {getScoreLabel(analysis.overall_score)}
                          </span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.overall_score}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full bg-gradient-to-l ${getScoreGradient(analysis.overall_score)}`}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                          className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}
                        >
                          {analysis.overall_score}
                        </motion.div>
                        <div className="text-xs text-gray-500">از 100</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Summary */}
                {analysis.ai_analyzed && analysis.ai_summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      <h4 className="text-base sm:text-lg text-white font-bold">خلاصه تحلیل</h4>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                      {analysis.ai_summary}
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <button
                    onClick={onViewDetails}
                    className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium text-sm sm:text-base"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    مشاهده جزئیات کامل
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-sm sm:text-base"
                  >
                    بستن
                  </button>
                </motion.div>

                {/* Info Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-xs sm:text-sm text-gray-500"
                >
                  می‌توانید در هر زمان از بخش تاریخچه، نتایج کامل را مشاهده کنید
                </motion.div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
