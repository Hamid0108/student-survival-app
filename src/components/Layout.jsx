import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, BookOpen, Clock, Target, Brain, BarChart3, Calendar } from 'lucide-react';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Zap, label: 'Dashboard', mobile: true },
    { path: '/planner', icon: BookOpen, label: 'Study Planner', mobile: true },
    { path: '/pomodoro', icon: Clock, label: 'Pomodoro', mobile: true },
    { path: '/gpa', icon: Target, label: 'GPA Tracker', mobile: true },
    { path: '/exam-prep', icon: Brain, label: 'Exam Prep', mobile: false },
    { path: '/weekly-review', icon: BarChart3, label: 'Weekly Review', mobile: false },
    { path: '/calendar', icon: Calendar, label: 'Calendar', mobile: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex-col p-6 flex-shrink-0">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-semibold text-slate-300">StudySurvival</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Stay focused. You've got this! 💪</p>
        </div>
      </aside>

      {/* Mobile Header + Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden relative flex items-center bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-4">
          <h1 className="text-lg font-black text-white flex items-center gap-2 flex-1">
            <Zap className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span>StudySurvival</span>
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-4 p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden bg-slate-800 border-b border-slate-700 p-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
