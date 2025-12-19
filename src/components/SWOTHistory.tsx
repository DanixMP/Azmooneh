import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Calendar, Eye } from 'lucide-react';
import { api, SWOTAnalysis as SWOTAnalysisType } from '../services/api';
import { SWOTResults } from './SWOTResults';

export function SWOTHistory() {
  const [analyses, setAnalyses] = useState<SWOTAnalysisType[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SWOTAnalysisType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await api.getMySWOTAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div>
        <button
          onClick={() => setSelectedAnalysis(null)}
          className="mb-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          ← بازگشت به لیست
        </button>
        <SWOTResults analysis={selectedAnalysis} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Brain className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl text-white">تاریخچه تحلیل‌های SWOT</h1>
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
            <h2 className="text-2xl text-white mb-4">هنوز تحلیلی ثبت نشده</h2>
            <p className="text-gray-400">اولین تحلیل SWOT خود را انجام دهید</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white text-lg">
                      تحلیل SWOT #{analyses.length - index}
                    </span>
                  </div>
                  <p className="text-gray-400">
                    {new Date(analysis.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {analysis.answers.length} پاسخ ثبت شده
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAnalysis(analysis)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  مشاهده
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
