import { motion } from 'motion/react';
import { Brain, TrendingUp, AlertTriangle, Target, Shield } from 'lucide-react';
import { SWOTAnalysis } from '../services/api';

interface SWOTResultsProps {
  analysis: SWOTAnalysis;
}

export function SWOTResults({ analysis }: SWOTResultsProps) {
  const groupedAnswers = {
    strength: analysis.answers.filter(a => a.question.category === 'strength'),
    weakness: analysis.answers.filter(a => a.question.category === 'weakness'),
    opportunity: analysis.answers.filter(a => a.question.category === 'opportunity'),
    threat: analysis.answers.filter(a => a.question.category === 'threat'),
  };

  const categories = [
    {
      key: 'strength',
      title: 'نقاط قوت (Strengths)',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'rgba(34, 197, 94, 0.3)',
      borderColor: 'border-2 border-green-500/50',
    },
    {
      key: 'weakness',
      title: 'نقاط ضعف (Weaknesses)',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'border-2 border-red-500/50',
    },
    {
      key: 'opportunity',
      title: 'فرصت‌ها (Opportunities)',
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: 'border-2 border-blue-500/50',
    },
    {
      key: 'threat',
      title: 'تهدیدها (Threats)',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'rgba(249, 115, 22, 0.3)',
      borderColor: 'border-2 border-orange-500/50',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl text-white">نتایج تحلیل SWOT شما</h1>
        </div>
        <p className="text-gray-400">
          تاریخ: {new Date(analysis.created_at).toLocaleDateString('fa-IR')}
        </p>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          const answers = groupedAnswers[category.key as keyof typeof groupedAnswers];

          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ backgroundColor: category.bgColor }}
              className={`${category.borderColor} backdrop-blur-xl rounded-2xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-6 h-6 ${category.color}`} />
                <h2 className={`text-xl ${category.color}`}>{category.title}</h2>
              </div>

              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={answer.id} className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">
                      {answer.question.question_text}
                    </p>
                    <p className="text-white">{answer.answer_text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl text-purple-400 mb-4">💡 پیشنهادات برای استفاده از تحلیل SWOT</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• از نقاط قوت خود برای بهره‌برداری از فرصت‌ها استفاده کنید</li>
          <li>• روی بهبود نقاط ضعف خود تمرکز کنید</li>
          <li>• برنامه‌ای برای مقابله با تهدیدها تدوین کنید</li>
          <li>• این تحلیل را به صورت دوره‌ای تکرار کنید تا پیشرفت خود را ببینید</li>
        </ul>
      </motion.div>
    </div>
  );
}
