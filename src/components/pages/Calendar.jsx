import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useApp } from '../../contexts/AppContext';
import TaskCard from '../shared/TaskCard';

export default function CalendarPage() {
  const { tasks, exams, getTasksByDate, priorities } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const tasksOnDate = getTasksByDate(selectedDateStr);
  const examsOnDate = exams.filter(e => e.date === selectedDateStr);

  // Get dot indicators for calendar
  const getTileContent = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = getTasksByDate(dateStr);
    const dayExams = exams.filter(e => e.date === dateStr);

    if (dayTasks.length === 0 && dayExams.length === 0) return null;

    return (
      <div className="flex gap-1 flex-wrap justify-center pt-1">
        {dayTasks.length > 0 && (
          <span className="text-xs bg-blue-500 text-white rounded-full w-2 h-2" />
        )}
        {dayExams.length > 0 && (
          <span className="text-xs bg-red-500 text-white rounded-full w-2 h-2" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
          📅 Calendar
        </h1>
        <p className="text-slate-400">Visualize your schedule and upcoming tasks</p>
      </div>

      {/* Calendar Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-4 calendar-wrapper">
            <style>{`
              .react-calendar {
                background: transparent;
                border: none;
                font-family: inherit;
                color: white;
              }
              .react-calendar button {
                color: white;
                background: transparent;
              }
              .react-calendar button:hover {
                background: rgba(255, 255, 255, 0.1);
              }
              .react-calendar button.react-calendar__tile--active {
                background: rgb(59, 130, 246);
                color: white;
              }
              .react-calendar__month-view__weekdays {
                color: rgb(148, 163, 175);
                font-weight: bold;
                font-size: 0.875rem;
                margin-bottom: 1rem;
              }
              .react-calendar__month-view__weekdays abbr {
                text-decoration: none;
              }
              .react-calendar__navigation {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
              }
              .react-calendar__navigation button {
                font-size: 1rem;
                padding: 0.5rem;
              }
            `}</style>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileContent={({ date }) => getTileContent(date)}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Exams</span>
            </div>
          </div>
        </div>

        {/* Details for Selected Date */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Date Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/20">
            <p className="text-sm text-blue-100 mb-2">Selected Date</p>
            <h2 className="text-3xl font-black text-white">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
          </div>

          {/* Tasks for Selected Date */}
          {tasksOnDate.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Tasks ({tasksOnDate.length})</h3>
              <div className="space-y-3">
                {tasksOnDate.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6 text-center">
              <p className="text-slate-400">No tasks scheduled for this day</p>
            </div>
          )}

          {/* Exams for Selected Date */}
          {examsOnDate.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Exams ({examsOnDate.length})</h3>
              <div className="space-y-3">
                {examsOnDate.map(exam => (
                  <div
                    key={exam.id}
                    className="bg-red-600/20 border border-red-500/30 rounded-2xl p-4"
                  >
                    <h4 className="font-bold text-white text-lg">{exam.subject} Exam</h4>
                    {exam.description && (
                      <p className="text-sm text-slate-300 mt-2">{exam.description}</p>
                    )}
                    {exam.topics && exam.topics.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-400 mb-2">
                          Topics: {exam.completedTopics}/{exam.topics.length} studied
                        </p>
                        <div className="w-full h-2 bg-red-900/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                            style={{
                              width: `${exam.topics.length > 0 ? (exam.completedTopics / exam.topics.length) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats for Month */}
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Month Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Tasks This Month</p>
                <p className="text-2xl font-black text-white">
                  {tasks.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Scheduled Exams</p>
                <p className="text-2xl font-black text-white">
                  {exams.filter(e => {
                    const examDate = new Date(e.date);
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return (
                      examDate.getMonth() === currentMonth &&
                      examDate.getFullYear() === currentYear
                    );
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
