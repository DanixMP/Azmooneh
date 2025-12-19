import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Question {
  question_type: 'single_choice' | 'multiple_choice' | 'true_false' | 'long_answer';
  question_text: string;
  marks: number;
  choices: { choice_text: string; is_correct: boolean }[];
}

const questionTypes = [
  { value: 'single_choice', label: 'تک گزینه‌ای' },
  { value: 'multiple_choice', label: 'چند گزینه‌ای' },
  { value: 'true_false', label: 'صحیح/غلط' },
  { value: 'long_answer', label: 'تشریحی' },
];

function CustomDropdown({ value, onChange, questionIndex }: { value: string; onChange: (value: string) => void; questionIndex: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedType = questionTypes.find((t) => t.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white flex items-center justify-between hover:border-slate-500 transition-colors"
      >
        <span>{selectedType?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}
            className="absolute z-10 w-full mt-1 bg-slate-900/70 border border-slate-600/50 rounded-lg shadow-2xl overflow-hidden"
          >
            {questionTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  onChange(type.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-right hover:bg-slate-700/80 transition-colors ${
                  value === type.value ? 'bg-purple-600/20 text-purple-300' : 'text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateExamModal({ isOpen, onClose, onSuccess }: CreateExamModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_type: 'single_choice',
        question_text: '',
        marks: 5,
        choices: [
          { choice_text: '', is_correct: false },
          { choice_text: '', is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addChoice = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].choices.push({ choice_text: '', is_correct: false });
    setQuestions(updated);
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, field: 'choice_text' | 'is_correct', value: any) => {
    const updated = [...questions];
    updated[questionIndex].choices[choiceIndex] = {
      ...updated[questionIndex].choices[choiceIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].choices = updated[questionIndex].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createExam({
        title,
        description,
        duration_minutes: durationMinutes,
        is_published: false,
        questions,
      });
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError('خطا در ایجاد آزمون: ' + (err.message || 'لطفا دوباره تلاش کنید'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDurationMinutes(60);
    setQuestions([]);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-x2 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white">ایجاد آزمون جدید</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form id="exam-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 mb-2">عنوان آزمون</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">توضیحات</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl text-white">سوالات</h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن سوال
                    </button>
                  </div>

                  <div className="space-y-4 pb-6">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-white">سوال {qIndex + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <CustomDropdown
                            value={question.question_type}
                            onChange={(value) => updateQuestion(qIndex, 'question_type', value)}
                            questionIndex={qIndex}
                          />

                          <input
                            type="text"
                            value={question.question_text}
                            onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                            placeholder="متن سوال"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                            required
                          />

                          <input
                            type="number"
                            value={question.marks}
                            onChange={(e) => updateQuestion(qIndex, 'marks', Number(e.target.value))}
                            placeholder="نمره"
                            className="w-32 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                            min="0"
                            step="0.5"
                            required
                          />

                          {question.question_type !== 'long_answer' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">گزینه‌ها</span>
                                <button
                                  type="button"
                                  onClick={() => addChoice(qIndex)}
                                  className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                  + افزودن گزینه
                                </button>
                              </div>
                              {question.choices.map((choice, cIndex) => (
                                <div key={cIndex} className="flex items-center gap-2">
                                  <input
                                    type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                                    name={`correct-${qIndex}`}
                                    checked={choice.is_correct}
                                    onChange={(e) => {
                                      if (question.question_type === 'single_choice' || question.question_type === 'true_false') {
                                        const updated = [...questions];
                                        updated[qIndex].choices.forEach((c, i) => {
                                          c.is_correct = i === cIndex;
                                        });
                                        setQuestions(updated);
                                      } else {
                                        updateChoice(qIndex, cIndex, 'is_correct', e.target.checked);
                                      }
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <input
                                    type="text"
                                    value={choice.choice_text}
                                    onChange={(e) => updateChoice(qIndex, cIndex, 'choice_text', e.target.value)}
                                    placeholder={`گزینه ${cIndex + 1}`}
                                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                                    required
                                  />
                                  {question.choices.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeChoice(qIndex, cIndex)}
                                      className="p-1 hover:bg-slate-700 rounded"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading || questions.length === 0}
                  className="px-6 py-2 bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'در حال ایجاد...' : 'ایجاد آزمون'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
