import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Priorities state
  const [priorities, setPriorities] = useState(() => {
    const saved = localStorage.getItem('priorities');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "High", color: "red", emoji: "🔥" },
      { id: 2, name: "Medium", color: "yellow", emoji: "⚡" },
      { id: 3, name: "Low", color: "blue", emoji: "💙" }
    ];
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Finish assignment", done: false, priority: "High", date: new Date().toISOString().split('T')[0], dueDate: null },
      { id: 2, text: "Study Math Chapter 5", done: false, priority: "Medium", date: new Date().toISOString().split('T')[0], dueDate: null },
    ];
  });

  // GPA state
  const [gpa, setGpa] = useState(() => {
    const saved = localStorage.getItem('gpa');
    return saved ? parseFloat(saved) : 1.75;
  });

  const [targetGpa, setTargetGpa] = useState(() => {
    const saved = localStorage.getItem('targetGpa');
    return saved ? parseFloat(saved) : 3.5;
  });

  // Pomodoro state
  const [pomodoroSettings, setPomodoroSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : {
      workDuration: 25,
      breakDuration: 5,
      sessionsCompleted: 0
    };
  });

  // Weekly review state
  const [weeklyReview, setWeeklyReview] = useState(() => {
    const saved = localStorage.getItem('weeklyReview');
    return saved ? JSON.parse(saved) : [];
  });

  // Exams state
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('exams');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('priorities', JSON.stringify(priorities));
  }, [priorities]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gpa', gpa.toString());
  }, [gpa]);

  useEffect(() => {
    localStorage.setItem('targetGpa', targetGpa.toString());
  }, [targetGpa]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroSettings));
  }, [pomodoroSettings]);

  useEffect(() => {
    localStorage.setItem('weeklyReview', JSON.stringify(weeklyReview));
  }, [weeklyReview]);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  // Task management functions
  const addTask = (taskText, priority = "Medium", dueDate = null) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskText,
        done: false,
        priority,
        date: new Date().toISOString().split('T')[0],
        dueDate
      }
    ]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Priority management functions
  const addPriority = (name, color, emoji = "⭐") => {
    setPriorities([...priorities, { id: Date.now(), name, color, emoji }]);
  };

  const updatePriority = (id, updates) => {
    setPriorities(priorities.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePriority = (id) => {
    setPriorities(priorities.filter(p => p.id !== id));
  };

  // Exam management functions
  const addExam = (exam) => {
    setExams([...exams, { id: Date.now(), ...exam }]);
  };

  const updateExam = (id, updates) => {
    setExams(exams.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  // Weekly review functions
  const addWeeklyReview = (review) => {
    setWeeklyReview([...weeklyReview, { id: Date.now(), date: new Date().toISOString(), ...review }]);
  };

  // Helper functions
  const getTasksByDate = (date) => {
    return tasks.filter(t => t.date === date);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(t => t.priority === priority && !t.done);
  };

  const getCompletionStats = () => {
    const completed = tasks.filter(t => t.done).length;
    const total = tasks.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const value = {
    // State
    priorities,
    tasks,
    gpa,
    setGpa,
    targetGpa,
    setTargetGpa,
    pomodoroSettings,
    setPomodoroSettings,
    weeklyReview,
    exams,

    // Functions
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    addPriority,
    updatePriority,
    deletePriority,
    addExam,
    updateExam,
    deleteExam,
    addWeeklyReview,
    getTasksByDate,
    getTasksByPriority,
    getCompletionStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
