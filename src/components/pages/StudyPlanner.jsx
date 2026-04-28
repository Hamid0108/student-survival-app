import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import TaskCard from '../shared/TaskCard';
import PrioritySelector from '../shared/PrioritySelector';
import { useApp } from '../../contexts/AppContext';

export default function StudyPlanner() {
  const { tasks, addTask, priorities } = useApp();
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(priorities[0]?.name || 'High');
  const [showPrioritySettings, setShowPrioritySettings] = useState(false);

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    addTask(newTaskText, selectedPriority);
    setNewTaskText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  const incompleteTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Study Planner
        </h1>
        <p className="text-slate-400">Manage your tasks and track your progress</p>
      </div>

      {/* Priority Management Section */}
      {showPrioritySettings && (
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
          <PrioritySelector showManagement={true} />
          <button
            onClick={() => setShowPrioritySettings(false)}
            className="mt-4 w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* Add Task Section */}
      <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Add New Task
          </h2>
          <button
            onClick={() => setShowPrioritySettings(!showPrioritySettings)}
            className="text-sm bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded transition-colors"
          >
            {showPrioritySettings ? 'Hide' : 'Manage'} Priorities
          </button>
        </div>

        <div className="space-y-3">
          {/* Priority Selector */}
          <PrioritySelector
            onSelect={setSelectedPriority}
            selectedPriority={selectedPriority}
          />

          {/* Task Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="What do you need to study?"
            />
            <button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Main Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Active Tasks ({incompleteTasks.length})
            </h2>
            {incompleteTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No active tasks!</p>
                <p className="text-slate-500 text-sm">Add a task above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incompleteTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Summary & Completed */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <p className="text-3xl font-black text-white">{tasks.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Progress</p>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {completedTasks.length}/{tasks.length} done
                </p>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                ✓ Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-2 rounded hover:bg-slate-600/30 transition-colors"
                  >
                    <p className="text-sm text-slate-500 line-through">{task.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
