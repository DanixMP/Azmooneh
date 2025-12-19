import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, Edit2, Save } from 'lucide-react';
import { api } from '../services/api';

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

interface ViewSubmissionModalProps {
  submissionId: number;
  onClose: () => void;
  onUpdate: () => void;
}

export function ViewSubmissionModal({ submissionId, onClose, onUpdate }: ViewSubmissionModalProps) {
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAnswer, setEditingAnswer] = useState<number | null>(null);
  const [editMarks, setEditMarks] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getStudentExamDetails(submissionId);
      setSubmission(data);
      
      // Load exam details to get questions
      const examData = await api.getExamDetails(data.exam);
      setExam(examData);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری جزئیات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMarks = async (answerId: number) => {
    setSaving(true);
    try {
      // Update marks for the answer
      await api.updateStudentExamMarks(submissionId, [{
        id: answerId,
        marks_obtained: parseFloat(editMarks)
      }]);
      
      setEditingAnswer(null);
      setEditMarks('');
      await loadSubmission();
      onUpdate();
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
    return submission?.answers.find(a => a.question === questionId);
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !submission || !exam) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-white mb-1">پاسخ‌های {submission.student_name}</h2>
                <p className="text-gray-400">{submission.exam_title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            {/* Score Summary */}
            <div className="mt-4 flex items-center gap-4">
              <div className="px-4 py-2 bg-slate-900/50 rounded-lg">
                <span className="text-gray-400 text-sm">نمره کل: </span>
                <span className="text-white font-medium">
                  {submission.score !== null ? submission.score : '-'} / {exam.total_marks}
                </span>
              </div>
              <div className="px-4 py-2 bg-slate-900/50 rounded-lg">
                <span className="text-gray-400 text-sm">وضعیت: </span>
                <span className="text-white">{submission.status === 'graded' ? 'نمره‌دهی شده' : 'در انتظار نمره‌دهی'}</span>
              </div>
            </div>
          </div>

          {/* Questions and Answers */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {exam.questions.map((question: Question, index: number) => {
              const answer = getAnswerForQuestion(question.id);
              const isCorrect = isCorrectChoice(question, answer);
              
              return (
                <div key={question.id} className="bg-slate-900/50 rounded-xl p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-purple-400 font-medium">سوال {index + 1}</span>
                        <span className="px-2 py-1 bg-slate-800 text-gray-400 rounded text-xs">
                          {getQuestionType(question.question_type)}
                        </span>
                        <span className="text-gray-400 text-sm">{question.marks} نمره</span>
                      </div>
                      <p className="text-white text-lg">{question.question_text}</p>
                    </div>
                    
                    {isCorrect !== null && (
                      <div className="mr-4">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
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
                            className={`p-3 rounded-lg border-2 ${
                              isSelected && isCorrectChoice
                                ? 'border-green-500 bg-green-500/10'
                                : isSelected && !isCorrectChoice
                                ? 'border-red-500 bg-red-500/10'
                                : isCorrectChoice
                                ? 'border-green-500/50 bg-green-500/5'
                                : 'border-slate-700 bg-slate-800/50'
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
                                  <span className="text-xs text-gray-400">(انتخاب دانشجو)</span>
                                )}
                                {isCorrectChoice && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
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
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
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
                            className="w-20 px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-white"
                            placeholder="0"
                          />
                          <span className="text-gray-400">/ {question.marks}</span>
                          <button
                            onClick={() => answer && handleSaveMarks(answer.id)}
                            disabled={saving}
                            className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAnswer(null);
                              setEditMarks('');
                            }}
                            className="p-1 bg-slate-600 hover:bg-slate-700 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
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
                              className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-purple-400" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
