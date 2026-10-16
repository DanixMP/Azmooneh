import { motion } from 'motion/react';
import { Brain, TrendingUp, Target, Lightbulb, Briefcase, Award } from 'lucide-react';

interface AIPersonalityResultsProps {
  analysis: {
    ai_analyzed: boolean;
    personality_type: string;
    overall_score: number;
    ai_summary: string;
    ai_results: {
      traits: {
        confidence: number;
        self_awareness: number;
        growth_mindset: number;
        resilience: number;
        strategic_thinking: number;
      };
      key_strengths: string[];
      areas_for_improvement: string[];
      recommendations: string[];
      career_suggestions: string[];
    };
  };
}

export function AIPersonalityResults({ analysis }: AIPersonalityResultsProps) {
  if (!analysis.ai_analyzed || !analysis.ai_results) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center">
        <Brain className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">تحلیل هوش مصنوعی در دسترس نیست</p>
      </div>
    );
  }

  const { traits, key_strengths, areas_for_improvement, recommendations, career_suggestions } = analysis.ai_results;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-blue-400 bg-blue-500/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl text-white font-bold">{analysis.personality_type}</h2>
            <p className="text-purple-300">تحلیل شخصیت با هوش مصنوعی</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">امتیاز کلی</span>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                {analysis.overall_score}/100
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.overall_score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full ${getScoreBarColor(analysis.overall_score)}`}
              />
            </div>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {analysis.ai_summary}
        </p>
      </motion.div>

      {/* Personality Traits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl text-white font-bold">ویژگی‌های شخصیتی</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(traits).map(([trait, score], index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 capitalize">
                  {trait === 'confidence' && 'اعتماد به نفس'}
                  {trait === 'self_awareness' && 'خودآگاهی'}
                  {trait === 'growth_mindset' && 'ذهنیت رشد'}
                  {trait === 'resilience' && 'انعطاف‌پذیری'}
                  {trait === 'strategic_thinking' && 'تفکر استراتژیک'}
                </span>
                <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className={`h-full ${getScoreBarColor(score)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-xl text-white font-bold">نقاط قوت کلیدی</h3>
        </div>
        
        <ul className="space-y-3">
          {key_strengths.map((strength, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>{strength}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Areas for Improvement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl text-white font-bold">زمینه‌های قابل بهبود</h3>
        </div>
        
        <ul className="space-y-3">
          {areas_for_improvement.map((area, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
              <span>{area}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl text-white font-bold">توصیه‌های عملی</h3>
        </div>
        
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
              <span>{rec}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Career Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl text-white font-bold">مسیرهای شغلی پیشنهادی</h3>
        </div>
        
        <ul className="space-y-3">
          {career_suggestions.map((career, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>{career}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
