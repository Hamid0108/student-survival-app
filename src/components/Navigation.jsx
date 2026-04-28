import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, BookOpen, Clock, Target, Brain, BarChart3, Calendar } from 'lucide-react';

export default function Navigation() {
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
    <>
      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex-col p-6 z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            StudySurvival
          </h1>
          <p className="text-xs text-slate-400 mt-1">Your Academic Command Center</p>
        </div>

        <div className="flex-1 space-y-2">
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
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Stay focused. You've got this! 💪</p>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          StudySurvival
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-800 border-b border-slate-700 p-4 space-y-2">
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
        </div>
      )}
    </>
  );
}
