import { useState } from 'react';
import { Brain, Plus, X, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function ExamPrepSystem() {
  const { exams, addExam, updateExam, deleteExam } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    topics: '',
    description: ''
  });

  const handleAddExam = () => {
    if (!formData.subject || !formData.date) return;
    addExam({
      ...formData,
      topics: formData.topics.split(',').map(t => ({ name: t.trim(), studied: false })),
      completedTopics: 0
    });
    setFormData({ subject: '', date: '', topics: '', description: '' });
    setShowForm(false);
  };

  const toggleTopicStudied = (examId, topicIndex) => {
    const exam = exams.find(e => e.id === examId);
    const updatedTopics = [...exam.topics];
    updatedTopics[topicIndex].studied = !updatedTopics[topicIndex].studied;
    const completedTopics = updatedTopics.filter(t => t.studied).length;
    updateExam(examId, { topics: updatedTopics, completedTopics });
  };

  const upcomingExams = exams.filter(e => new Date(e.date) > new Date());
  const pastExams = exams.filter(e => new Date(e.date) <= new Date());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-400" />
          Exam Prep System
        </h1>
        <p className="text-slate-400">Plan and track your exam preparation</p>
      </div>

      {/* Add Exam Form */}
      {showForm ? (
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Create New Exam</h2>
          <input
            type="text"
            placeholder="Subject (e.g., Calculus, History)"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Topics to study (comma-separated)"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <textarea
            placeholder="Notes or description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddExam}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Exam
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Exam
        </button>
      )}

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Upcoming Exams</h2>
          <div className="space-y-4">
            {upcomingExams.map(exam => {
              const topicsCount = exam.topics?.length || 0;
              const completedTopics = exam.completedTopics || 0;
              const progressPercent = topicsCount > 0 ? (completedTopics / topicsCount) * 100 : 0;

              return (
                <div
                  key={exam.id}
                  className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exam.subject}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        📅 {new Date(exam.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {exam.description && (
                    <p className="text-sm text-slate-300">{exam.description}</p>
                  )}

                  {/* Progress Bar */}
                  {topicsCount > 0 && (
                    <div>
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Topics Covered</span>
                        <span>{completedTopics}/{topicsCount}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Topics Checklist */}
                  {exam.topics && exam.topics.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {exam.topics.map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleTopicStudied(exam.id, idx)}
                          className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-600/30 transition-colors text-left"
                        >
                          {topic.studied ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                          )}
                          <span
                            className={
                              topic.studied
                                ? 'text-slate-500 line-through'
                                : 'text-slate-200'
                            }
                          >
                            {topic.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Past Exams</h2>
          <div className="space-y-2">
            {pastExams.map(exam => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600/30"
              >
                <div>
                  <p className="font-bold text-white">{exam.subject}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {exams.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-700/50 border border-slate-600/50 rounded-2xl">
          <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 text-lg">No exams yet</p>
          <p className="text-slate-500 text-sm">Add your first exam to start preparing</p>
        </div>
      )}
    </div>
  );
}
