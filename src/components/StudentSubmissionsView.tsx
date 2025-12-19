import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, CheckCircle, Clock, XCircle, Edit2, Save, X as XIcon } from 'lucide-react';
import { api } from '../services/api';

interface StudentSubmission {
  id: number;
  student: number;
  student_name: string;
  exam: number;
  exam_title: string;
  status: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
}

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_type: string;
  question_text: string;
  marks: number;
  order: number;
  choices: Choice[];
}

interface Answer {
  id: number;
  question: number;
  selected_choices: number[];
  text_answer: string;
  marks_obtained: number | null;
}

interface SubmissionDetails {
  id: number;
  student_name: string;
  exam_title: string;
  status: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  answers: Answer[];
  exam: {
    questions: Question[];
  };
}

interface StudentSubmissionsViewProps {
  examId: number;
  examTitle: string;
  onBack: () => void;
}

export function StudentSubmissionsView({ examId, examTitle, onBack }: StudentSubmissionsViewProps) {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null);
  const [editMarks, setEditMarks] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [examId]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const allSubmissions = await api.getStudentExams();
      const filtered = allSubmissions.filter((sub: StudentSubmission) => sub.exam === examId);
      setSubmissions(filtered);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری پاسخ‌ها');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissionDetail = async (submissionId: number) => {
    setDetailLoading(true);
    try {
      const data = await api.getStudentExamDetails(submissionId);
      setSelectedSubmission(data);
      
      // Load exam details to get questions
      const examDetails = await api.getExamDetails(data.exam);
      setExamData(examDetails);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری جزئیات');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveMarks = async (answerId: number) => {
    if (!selectedSubmission) return;
    
    setSaving(true);
    try {
      await api.updateStudentExamMarks(selectedSubmission.id, [{
        id: answerId,
        marks_obtained: parseFloat(editMarks)
      }]);
      
      setEditingAnswer(null);
      setEditMarks('');
      await loadSubmissionDetail(selectedSubmission.id);
      await loadSubmissions();
    } catch (err: any) {
      alert('خطا در ذخیره نمره: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getQuestionType = (type: string) => {
    switch (type) {
      case 'single_choice':
        return 'تک گزینه‌ای';
      case 'multiple_choice':
        return 'چند گزینه‌ای';
      case 'true_false':
        return 'صحیح/غلط';
      case 'long_answer':
        return 'تشریحی';
      default:
        return type;
    }
  };

  const getAnswerForQuestion = (questionId: number) => {
    return selectedSubmission?.answers.find(a => a.question === questionId);
  };

  const isCorrectChoice = (question: Question, answer: Answer | undefined) => {
    if (!answer || !question.choices) return null;
    
    const correctChoices = question.choices.filter(c => c.is_correct).map(c => c.id);
    const selectedChoices = answer.selected_choices;
    
    if (question.question_type === 'single_choice' || question.question_type === 'true_false') {
      return selectedChoices.length > 0 && correctChoices.includes(selectedChoices[0]);
    } else if (question.question_type === 'multiple_choice') {
      return correctChoices.length === selectedChoices.length &&
             correctChoices.every(id => selectedChoices.includes(id));
    }
    
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'graded':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            تحویل داده شده
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            در حال انجام
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            شروع نشده
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show detail view if a submission is selected
  if (selectedSubmission && examData) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedSubmission(null);
              setExamData(null);
            }}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl text-white">پاسخ‌های {selectedSubmission.student_name}</h1>
            <p className="text-gray-400 mt-1">{selectedSubmission.exam_title}</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="mb-6 flex items-center gap-4">
          <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
            <span className="text-gray-400 text-sm">نمره کل: </span>
            <span className="text-white font-medium text-lg">
              {selectedSubmission.score !== null ? selectedSubmission.score : '-'} / {examData.total_marks}
            </span>
          </div>
          <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl">
            <span className="text-gray-400 text-sm">وضعیت: </span>
            <span className="text-white">{selectedSubmission.status === 'graded' ? 'نمره‌دهی شده' : 'در انتظار نمره‌دهی'}</span>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {examData.questions.map((question: Question, index: number) => {
            const answer = getAnswerForQuestion(question.id);
            const isCorrect = isCorrectChoice(question, answer);
            
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-purple-400 font-medium text-lg">سوال {index + 1}</span>
                      <span className="px-3 py-1 bg-slate-900/50 text-gray-400 rounded-lg text-sm">
                        {getQuestionType(question.question_type)}
                      </span>
                      <span className="text-gray-400 text-sm">{question.marks} نمره</span>
                    </div>
                    <p className="text-white text-lg">{question.question_text}</p>
                  </div>
                  
                  {isCorrect !== null && (
                    <div className="mr-4">
                      {isCorrect ? (
                        <CheckCircle className="w-7 h-7 text-green-400" />
                      ) : (
                        <XCircle className="w-7 h-7 text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Choices (for objective questions) */}
                {question.question_type !== 'long_answer' && question.choices && (
                  <div className="space-y-2 mb-4">
                    {question.choices.map((choice) => {
                      const isSelected = answer?.selected_choices.includes(choice.id);
                      const isCorrectChoice = choice.is_correct;
                      
                      return (
                        <div
                          key={choice.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected && isCorrectChoice
                              ? 'border-green-500 bg-green-500/10'
                              : isSelected && !isCorrectChoice
                              ? 'border-red-500 bg-red-500/10'
                              : isCorrectChoice
                              ? 'border-green-500/50 bg-green-500/5'
                              : 'border-slate-700 bg-slate-900/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`${
                              isSelected ? 'text-white font-medium' : 'text-gray-400'
                            }`}>
                              {choice.choice_text}
                            </span>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <span className="text-xs text-gray-400 bg-slate-800/50 px-2 py-1 rounded">(انتخاب دانشجو)</span>
                              )}
                              {isCorrectChoice && (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text Answer (for long answer questions) */}
                {question.question_type === 'long_answer' && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">پاسخ دانشجو:</p>
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                      <p className="text-white whitespace-pre-wrap">
                        {answer?.text_answer || 'پاسخی ثبت نشده است'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Marks Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">نمره دریافتی:</span>
                    {editingAnswer === answer?.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          max={question.marks}
                          value={editMarks}
                          onChange={(e) => setEditMarks(e.target.value)}
                          className="w-20 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                          placeholder="0"
                        />
                        <span className="text-gray-400">/ {question.marks}</span>
                        <button
                          onClick={() => answer && handleSaveMarks(answer.id)}
                          disabled={saving}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingAnswer(null);
                            setEditMarks('');
                          }}
                          className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <XIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-lg ${
                          answer?.marks_obtained !== null ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {answer?.marks_obtained !== null ? answer.marks_obtained : '-'}
                        </span>
                        <span className="text-gray-400">/ {question.marks}</span>
                        {question.question_type === 'long_answer' && answer && (
                          <button
                            onClick={() => {
                              setEditingAnswer(answer.id);
                              setEditMarks(answer.marks_obtained?.toString() || '');
                            }}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-purple-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

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
          <h1 className="text-3xl text-white">پاسخ‌های دانشجویان</h1>
          <p className="text-gray-400 mt-1">{examTitle}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12">
            <h2 className="text-2xl text-white mb-4">هنوز دانشجویی این آزمون را شروع نکرده</h2>
            <p className="text-gray-400">پاسخ‌ها پس از شروع آزمون توسط دانشجویان نمایش داده می‌شوند</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-gray-300">نام دانشجو</th>
                  <th className="px-6 py-4 text-right text-gray-300">زمان شروع</th>
                  <th className="px-6 py-4 text-right text-gray-300">زمان تحویل</th>
                  <th className="px-6 py-4 text-right text-gray-300">نمره</th>
                  <th className="px-6 py-4 text-right text-gray-300">وضعیت</th>
                  <th className="px-6 py-4 text-right text-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{submission.student_name}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {submission.started_at
                        ? new Date(submission.started_at).toLocaleString('fa-IR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleString('fa-IR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {submission.score !== null ? (
                        <span className="text-green-400 font-medium">{submission.score}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(submission.status)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => loadSubmissionDetail(submission.id)}
                        disabled={detailLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                        مشاهده جزئیات
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
