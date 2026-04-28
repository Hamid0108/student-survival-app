import { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function PrioritySelector({ onSelect, selectedPriority, showManagement = false }) {
  const { priorities, addPriority, updatePriority, deletePriority } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '', emoji: '⭐' });

  const colors = ['red', 'yellow', 'blue', 'green', 'purple', 'pink', 'indigo', 'cyan'];
  const emojis = ['🔥', '⚡', '💙', '💚', '💜', '💗', '⭐', '🎯', '📌', '✨'];

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.color) return;

    if (editingId) {
      updatePriority(editingId, formData);
      setEditingId(null);
    } else {
      addPriority(formData.name, formData.color, formData.emoji);
    }

    setFormData({ name: '', color: '', emoji: '⭐' });
    setShowForm(false);
  };

  const startEdit = (priority) => {
    setEditingId(priority.id);
    setFormData(priority);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deletePriority(id);
  };

  const getTailwindColor = (color) => {
    const colorMap = {
      red: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
      yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
      green: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20',
      pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div>
      {/* Priority Selector for Tasks */}
      {onSelect && (
        <div className="flex flex-wrap gap-2 mb-4">
          {priorities.map(priority => (
            <button
              key={priority.id}
              onClick={() => onSelect(priority.name)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                selectedPriority === priority.name
                  ? `border-${priority.color}-500 bg-${priority.color}-500/20 text-${priority.color}-300`
                  : `border-slate-600 text-slate-400 hover:border-slate-500`
              }`}
            >
              {priority.emoji} {priority.name}
            </button>
          ))}
        </div>
      )}

      {/* Priority Management */}
      {showManagement && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Manage Priorities</h3>
            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ name: '', color: '', emoji: '⭐' });
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Priority
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-3">
              <input
                type="text"
                placeholder="Priority name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <div>
                <label className="block text-sm text-slate-300 mb-2">Color</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-full h-10 rounded-lg border-2 ${
                        formData.color === color ? 'border-white' : 'border-transparent'
                      } bg-${color}-500/30`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Emoji</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-2xl p-2 rounded-lg border-2 ${
                        formData.emoji === emoji ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddOrUpdate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', color: '', emoji: '⭐' });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {priorities.map(priority => (
              <div
                key={priority.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getTailwindColor(priority.color)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{priority.emoji}</span>
                  <span className="font-medium">{priority.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(priority)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(priority.id)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
