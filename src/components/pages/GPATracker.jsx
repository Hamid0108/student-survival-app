import { Target } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import { useApp } from '../../contexts/AppContext';

export default function GPATracker() {
  const { gpa, setGpa, targetGpa, setTargetGpa } = useApp();
  const gpaGap = Math.max(0, targetGpa - gpa);
  const gpaPercentage = (gpa / 4) * 100;
  const targetPercentage = (targetGpa / 4) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-400" />
          GPA Tracker
        </h1>
        <p className="text-slate-400">Monitor and improve your academic performance</p>
      </div>

      {/* GPA Display Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg border border-blue-500/20">
          <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-2">Current GPA</p>
          <p className="text-6xl font-black text-white mb-4">{gpa.toFixed(2)}</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Progress to 4.0</span>
                <span>{gpaPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-blue-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-300 to-cyan-300 transition-all duration-500"
                  style={{ width: `${gpaPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 shadow-lg border border-purple-500/20">
          <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide mb-2">Target GPA</p>
          <p className="text-6xl font-black text-white mb-4">{targetGpa.toFixed(2)}</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-purple-100 mb-2">
                <span>Target Progress</span>
                <span>{targetPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-purple-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-300 to-pink-300 transition-all duration-500"
                  style={{ width: `${targetPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GPA Gap */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          title="GPA Gap"
          value={gpaGap.toFixed(2)}
          subtitle={gpaGap === 0 ? "🎯 Goal achieved!" : "points to reach goal"}
          color={gpaGap === 0 ? "emerald" : "pink"}
        />
        <StatsCard
          title="Scale"
          value="4.0"
          subtitle="Maximum GPA"
          color="cyan"
        />
        <StatsCard
          title="Status"
          value={gpa >= targetGpa ? "✓ On Track" : "In Progress"}
          color={gpa >= targetGpa ? "emerald" : "blue"}
        />
      </div>

      {/* Edit GPA */}
      <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Update GPA Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current GPA Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Current GPA</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-4 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <span className="absolute right-4 top-4 text-slate-400 text-lg">/4.0</span>
            </div>
          </div>

          {/* Target GPA Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Target GPA</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={targetGpa}
                onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-4 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <span className="absolute right-4 top-4 text-slate-400 text-lg">/4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* GPA Scale Reference */}
      <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">GPA Scale Reference</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { range: '3.9-4.0', grade: 'A+', description: 'Excellent' },
            { range: '3.7-3.8', grade: 'A', description: 'Excellent' },
            { range: '3.3-3.6', grade: 'A-', description: 'Very Good' },
            { range: '3.0-3.2', grade: 'B+', description: 'Good' },
            { range: '2.7-2.9', grade: 'B', description: 'Good' },
            { range: '2.3-2.6', grade: 'B-', description: 'Satisfactory' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-600/30 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-400">{item.range}</p>
                <p className="font-bold text-white">{item.grade}</p>
              </div>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}
