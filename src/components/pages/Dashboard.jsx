import { Zap, Target, BookOpen, Clock } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import { useApp } from '../../contexts/AppContext';

export default function Dashboard() {
  const { tasks, gpa, targetGpa, getCompletionStats, priorities, exams } = useApp();
  const stats = getCompletionStats();
  const gpaGap = Math.max(0, targetGpa - gpa);
  const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400">Welcome back! Here's your academic overview</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Progress"
          icon={Zap}
          value={`${stats.percentage}%`}
          subtitle={`${stats.completed} of ${stats.total} tasks`}
          color="blue"
        />

        <StatsCard
          title="Current GPA"
          icon={Target}
          value={gpa.toFixed(2)}
          subtitle={gpaGap > 0 ? `${gpaGap.toFixed(2)} points to goal` : "🎯 Goal reached!"}
          color="purple"
        />

        <StatsCard
          title="Tasks Today"
          icon={BookOpen}
          value={tasks.filter(t => !t.done).length}
          subtitle={`${tasks.filter(t => t.done).length} completed`}
          color="emerald"
        />

        <StatsCard
          title="Upcoming Exams"
          icon={Clock}
          value={upcomingExams}
          subtitle={upcomingExams > 0 ? "Get studying!" : "No exams scheduled"}
          color="pink"
        />
      </div>

      {/* Quick Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Tasks</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-600/30 transition-colors">
                <span className={task.done ? "text-emerald-400 text-lg" : "text-slate-400 text-lg"}>
                  {task.done ? "✓" : "○"}
                </span>
                <span className={task.done ? "text-slate-500 line-through" : "text-slate-200"}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{tasks.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Completion Rate</p>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
              <p className="text-sm text-slate-300 mt-1">{stats.percentage}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Priority Levels</p>
              <p className="text-lg font-bold text-white mt-1">{priorities.length} custom priorities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 text-center">
        <p className="text-lg font-semibold text-white mb-2">
          {stats.percentage === 100 ? "🎉 Amazing! You crushed it today!" : stats.percentage >= 50 ? "⚡ Keep the momentum going!" : "💪 You've got this! One task at a time."}
        </p>
        <p className="text-sm text-slate-300">Success is built day by day. Stay focused and keep learning.</p>
      </div>
    </div>
  );
}
