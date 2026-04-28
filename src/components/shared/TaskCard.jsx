import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function TaskCard({ task }) {
  const { toggleTask, deleteTask, priorities } = useApp();
  const priority = priorities.find(p => p.name === task.priority);

  const getTailwindColor = (color) => {
    const colorMap = {
      red: 'bg-red-500/10 text-red-500 border-red-500/20',
      yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      green: 'bg-green-500/10 text-green-500 border-green-500/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="group flex items-start gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600/30 hover:border-slate-500 rounded-xl transition-all duration-200 cursor-pointer">
      <button
        onClick={() => toggleTask(task.id)}
        className="mt-1 flex-shrink-0 transition-transform duration-200 hover:scale-110"
      >
        {task.done ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        ) : (
          <Circle className="w-6 h-6 text-slate-500 group-hover:text-slate-400" />
        )}
      </button>

      <div className="flex-1">
        <p className={`text-base font-medium transition-all ${
          task.done ? "text-slate-500 line-through" : "text-slate-100"
        }`}>
          {task.text}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {priority && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTailwindColor(priority.color)}`}>
              {priority.emoji} {priority.name}
            </span>
          )}
          {task.dueDate && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
