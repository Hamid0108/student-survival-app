import { useState } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function WeeklyReview() {
  const { weeklyReview, addWeeklyReview, tasks, getCompletionStats } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    whatWentWell: '',
    improvements: '',
    nextWeekGoals: '',
    challenges: '',
    mood: '😊'
  });

  const stats = getCompletionStats();

  const handleSubmitReview = () => {
    if (!formData.whatWentWell || !formData.improvements || !formData.nextWeekGoals) {
      alert('Please fill in all fields');
      return;
    }
    addWeeklyReview(formData);
    setFormData({
      whatWentWell: '',
      improvements: '',
      nextWeekGoals: '',
      challenges: '',
      mood: '😊'
    });
    setShowForm(false);
  };

  const moods = ['😊', '😐', '😟', '🤗', '💪', '😴'];
  const thisWeekReviews = weeklyReview.filter(r => {
    const reviewDate = new Date(r.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return reviewDate > oneWeekAgo;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          Weekly Review
        </h1>
        <p className="text-slate-400">Reflect on your week and plan ahead</p>
      </div>

      {/* This Week Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <p className="text-sm text-slate-400 mb-2">This Week</p>
          <p className="text-3xl font-black text-white">{stats.completed}</p>
          <p className="text-sm text-slate-400 mt-1">tasks completed</p>
        </div>
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <p className="text-sm text-slate-400 mb-2">Completion Rate</p>
          <p className="text-3xl font-black text-white">{stats.percentage}%</p>
          <p className="text-sm text-slate-400 mt-1">of total tasks</p>
        </div>
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <p className="text-sm text-slate-400 mb-2">Active Tasks</p>
          <p className="text-3xl font-black text-white">{tasks.filter(t => !t.done).length}</p>
          <p className="text-sm text-slate-400 mt-1">still in progress</p>
        </div>
      </div>

      {/* Add Review Form */}
      {showForm ? (
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Create Weekly Review</h2>

          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              How are you feeling this week?
            </label>
            <div className="flex gap-2">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setFormData({ ...formData, mood })}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    formData.mood === mood
                      ? 'border-blue-500 bg-blue-500/20 scale-110'
                      : 'border-slate-600'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <textarea
            placeholder="What went well this week?"
            value={formData.whatWentWell}
            onChange={(e) => setFormData({ ...formData, whatWentWell: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
          />

          <textarea
            placeholder="What could you improve?"
            value={formData.improvements}
            onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
          />

          <textarea
            placeholder="Goals for next week"
            value={formData.nextWeekGoals}
            onChange={(e) => setFormData({ ...formData, nextWeekGoals: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
          />

          <textarea
            placeholder="Challenges faced (optional)"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-20 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Save Review
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
          Create Review
        </button>
      )}

      {/* Past Reviews */}
      {weeklyReview.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Your Reviews</h2>
          <div className="space-y-4">
            {[...weeklyReview].reverse().map(review => (
              <div
                key={review.id}
                className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-2xl mt-2">{review.mood}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">✓ What went well</h4>
                    <p className="text-sm text-slate-300">{review.whatWentWell}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">🎯 Improvements</h4>
                    <p className="text-sm text-slate-300">{review.improvements}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">📅 Next week goals</h4>
                  <p className="text-sm text-slate-300">{review.nextWeekGoals}</p>
                </div>

                {review.challenges && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">⚠️ Challenges</h4>
                    <p className="text-sm text-slate-300">{review.challenges}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {weeklyReview.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-700/50 border border-slate-600/50 rounded-2xl">
          <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 text-lg">No reviews yet</p>
          <p className="text-slate-500 text-sm">Reflect on your week to grow and improve</p>
        </div>
      )}
    </div>
  );
}
