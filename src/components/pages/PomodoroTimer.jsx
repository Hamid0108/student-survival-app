import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import { useApp } from '../../contexts/AppContext';

export default function PomodoroTimer() {
  const { pomodoroSettings, setPomodoroSettings } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(pomodoroSettings.sessionsCompleted);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playNotification();
      if (isWorkSession) {
        setSessionsCompleted(prev => prev + 1);
        setPomodoroSettings({ ...pomodoroSettings, sessionsCompleted: sessionsCompleted + 1 });
      }
      switchPhase();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkSession, sessionsCompleted, pomodoroSettings]);

  const switchPhase = () => {
    if (isWorkSession) {
      setTimeLeft(pomodoroSettings.breakDuration * 60);
      setIsWorkSession(false);
    } else {
      setTimeLeft(pomodoroSettings.workDuration * 60);
      setIsWorkSession(true);
    }
    setIsRunning(false);
  };

  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? pomodoroSettings.workDuration * 60 : pomodoroSettings.breakDuration * 60);
  };

  const handleSkip = () => {
    setTimeLeft(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-400" />
          Pomodoro Timer
        </h1>
        <p className="text-slate-400">Stay focused with the Pomodoro Technique</p>
      </div>

      {/* Main Timer Display */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Phase Indicator */}
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">
              {isWorkSession ? '🔥 Work Session' : '☕ Break Time'}
            </p>
            <h2 className="text-5xl font-black text-white mb-4">
              {formatTime(timeLeft)}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isWorkSession
                  ? 'bg-gradient-to-r from-red-500 to-orange-400'
                  : 'bg-gradient-to-r from-green-500 to-emerald-400'
              }`}
              style={{
                width: `${100 - (timeLeft / (isWorkSession ? pomodoroSettings.workDuration * 60 : pomodoroSettings.breakDuration * 60)) * 100}%`
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold px-8 py-4 rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>

            <button
              onClick={handleSkip}
              className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold px-8 py-4 rounded-xl transition-colors"
            >
              Skip Phase
            </button>
          </div>

          {/* Sessions Counter */}
          <div className="pt-4 border-t border-slate-600">
            <p className="text-sm text-slate-400 mb-2">Sessions Completed Today</p>
            <p className="text-4xl font-black text-emerald-400">{sessionsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          title="Work Duration"
          value={`${pomodoroSettings.workDuration}m`}
          color="red"
        />
        <StatsCard
          title="Break Duration"
          value={`${pomodoroSettings.breakDuration}m`}
          color="green"
        />
        <StatsCard
          title="Sessions Today"
          value={sessionsCompleted}
          color="blue"
        />
      </div>

      {/* Settings */}
      <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">⚙️ Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={pomodoroSettings.workDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setPomodoroSettings({ ...pomodoroSettings, workDuration: newDuration });
                if (isWorkSession) setTimeLeft(newDuration * 60);
              }}
              disabled={isRunning}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={pomodoroSettings.breakDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setPomodoroSettings({ ...pomodoroSettings, breakDuration: newDuration });
                if (!isWorkSession) setTimeLeft(newDuration * 60);
              }}
              disabled={isRunning}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
