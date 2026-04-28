import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as supabaseService from '../services/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // Priorities state
  const [priorities, setPriorities] = useState(() => {
    const saved = localStorage.getItem('priorities');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'High', color: 'red', emoji: '🔥' },
      { id: '2', name: 'Medium', color: 'yellow', emoji: '⚡' },
      { id: '3', name: 'Low', color: 'blue', emoji: '💙' },
    ];
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            text: 'Finish assignment',
            done: false,
            priority: 'High',
            date: new Date().toISOString().split('T')[0],
            dueDate: null,
          },
          {
            id: '2',
            text: 'Study Math Chapter 5',
            done: false,
            priority: 'Medium',
            date: new Date().toISOString().split('T')[0],
            dueDate: null,
          },
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
    return saved
      ? JSON.parse(saved)
      : {
          workDuration: 25,
          breakDuration: 5,
          sessionsCompleted: 0,
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

  // Fetch data from Supabase on login
  useEffect(() => {
    if (user) {
      loadDataFromSupabase();
    }
  }, [user]);

  const loadDataFromSupabase = async () => {
    try {
      // Fetch all data from Supabase
      const [tasksData, prioritiesData, examsData, reviewsData, gpaData, pomodoroData] =
        await Promise.all([
          supabaseService.tasksService.fetchTasks(user.id),
          supabaseService.prioritiesService.fetchPriorities(user.id),
          supabaseService.examsService.fetchExams(user.id),
          supabaseService.reviewsService.fetchReviews(user.id),
          supabaseService.gpaService.fetchGPA(user.id),
          supabaseService.pomodoroService.fetchSettings(user.id),
        ]);

      // Only update state if we have data from Supabase
      if (tasksData.length > 0) {
        setTasks(tasksData);
        localStorage.setItem('tasks', JSON.stringify(tasksData));
      }

      if (prioritiesData.length > 0) {
        setPriorities(prioritiesData);
        localStorage.setItem('priorities', JSON.stringify(prioritiesData));
      }

      if (examsData.length > 0) {
        setExams(examsData);
        localStorage.setItem('exams', JSON.stringify(examsData));
      }

      if (reviewsData.length > 0) {
        setWeeklyReview(reviewsData);
        localStorage.setItem('weeklyReview', JSON.stringify(reviewsData));
      }

      if (gpaData) {
        setGpa(gpaData.current_gpa);
        setTargetGpa(gpaData.target_gpa);
        localStorage.setItem('gpa', gpaData.current_gpa.toString());
        localStorage.setItem('targetGpa', gpaData.target_gpa.toString());
      }

      if (pomodoroData) {
        setPomodoroSettings({
          workDuration: pomodoroData.work_duration,
          breakDuration: pomodoroData.break_duration,
          sessionsCompleted: pomodoroData.sessions_completed,
        });
        localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroData));
      }
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      // Keep using localStorage data if Supabase fails
    }
  };

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('priorities', JSON.stringify(priorities));
    // Sync to Supabase if logged in
    if (user && priorities.length > 0) {
      syncPrioritiesToSupabase(priorities);
    }
  }, [priorities, user]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Sync to Supabase if logged in
    if (user && tasks.length > 0) {
      syncTasksToSupabase(tasks);
    }
  }, [tasks, user]);

  useEffect(() => {
    localStorage.setItem('gpa', gpa.toString());
    if (user) {
      syncGPAToSupabase(gpa, targetGpa);
    }
  }, [gpa, user]);

  useEffect(() => {
    localStorage.setItem('targetGpa', targetGpa.toString());
    if (user) {
      syncGPAToSupabase(gpa, targetGpa);
    }
  }, [targetGpa, user]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroSettings));
    if (user) {
      syncPomodoroToSupabase(pomodoroSettings);
    }
  }, [pomodoroSettings, user]);

  useEffect(() => {
    localStorage.setItem('weeklyReview', JSON.stringify(weeklyReview));
  }, [weeklyReview]);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
    if (user && exams.length > 0) {
      syncExamsToSupabase(exams);
    }
  }, [exams, user]);

  // Background sync functions
  const syncTasksToSupabase = async (tasksToSync) => {
    if (!user) return;
    try {
      for (const task of tasksToSync) {
        // For new tasks (local IDs), insert them
        if (typeof task.id === 'number' || task.id.length < 36) {
          const newTask = await supabaseService.tasksService.addTask(user.id, task);
          // Replace local ID with server ID
          if (newTask) {
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...newTask } : t))
            );
          }
        }
      }
    } catch (error) {
      console.error('Error syncing tasks to Supabase:', error);
    }
  };

  const syncPrioritiesToSupabase = async (prioritiesToSync) => {
    if (!user) return;
    try {
      for (const priority of prioritiesToSync) {
        if (typeof priority.id === 'number' || priority.id.length < 36) {
          const newPriority = await supabaseService.prioritiesService.addPriority(
            user.id,
            priority
          );
          if (newPriority) {
            setPriorities((prev) =>
              prev.map((p) => (p.id === priority.id ? { ...newPriority } : p))
            );
          }
        }
      }
    } catch (error) {
      console.error('Error syncing priorities to Supabase:', error);
    }
  };

  const syncGPAToSupabase = async (currentGpa, targetGpaValue) => {
    if (!user) return;
    try {
      await supabaseService.gpaService.upsertGPA(user.id, {
        current_gpa: currentGpa,
        target_gpa: targetGpaValue,
      });
    } catch (error) {
      console.error('Error syncing GPA to Supabase:', error);
    }
  };

  const syncExamsToSupabase = async (examsToSync) => {
    if (!user) return;
    try {
      for (const exam of examsToSync) {
        if (typeof exam.id === 'number' || exam.id.length < 36) {
          const newExam = await supabaseService.examsService.addExam(user.id, exam);
          if (newExam) {
            setExams((prev) => prev.map((e) => (e.id === exam.id ? { ...newExam } : e)));
          }
        }
      }
    } catch (error) {
      console.error('Error syncing exams to Supabase:', error);
    }
  };

  const syncPomodoroToSupabase = async (settingsToSync) => {
    if (!user) return;
    try {
      await supabaseService.pomodoroService.upsertSettings(user.id, settingsToSync);
    } catch (error) {
      console.error('Error syncing pomodoro settings to Supabase:', error);
    }
  };

  // Task management functions
  const addTask = (taskText, priority = 'Medium', dueDate = null) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      done: false,
      priority,
      date: new Date().toISOString().split('T')[0],
      dueDate,
    };
    setTasks([...tasks, newTask]);

    // Sync to Supabase if logged in
    if (user) {
      supabaseService.tasksService
        .addTask(user.id, newTask)
        .then((result) => {
          if (result) {
            setTasks((prev) => prev.map((t) => (t.id === newTask.id ? result : t)));
          }
        })
        .catch((error) => console.error('Error adding task to Supabase:', error));
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, done: !task.done };
    setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.tasksService
        .updateTask(id, { done: !task.done }, user.id)
        .catch((error) => console.error('Error updating task in Supabase:', error));
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.tasksService
        .deleteTask(id, user.id)
        .catch((error) => console.error('Error deleting task from Supabase:', error));
    }
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.tasksService
        .updateTask(id, updates, user.id)
        .catch((error) => console.error('Error updating task in Supabase:', error));
    }
  };

  // Priority management functions
  const addPriority = (name, color, emoji = '⭐') => {
    const newPriority = { id: Date.now().toString(), name, color, emoji };
    setPriorities([...priorities, newPriority]);

    // Sync to Supabase if logged in
    if (user) {
      supabaseService.prioritiesService
        .addPriority(user.id, newPriority)
        .then((result) => {
          if (result) {
            setPriorities((prev) => prev.map((p) => (p.id === newPriority.id ? result : p)));
          }
        })
        .catch((error) => console.error('Error adding priority to Supabase:', error));
    }
  };

  const updatePriority = (id, updates) => {
    setPriorities(priorities.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.prioritiesService
        .updatePriority(id, updates, user.id)
        .catch((error) => console.error('Error updating priority in Supabase:', error));
    }
  };

  const deletePriority = (id) => {
    setPriorities(priorities.filter((p) => p.id !== id));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.prioritiesService
        .deletePriority(id, user.id)
        .catch((error) => console.error('Error deleting priority from Supabase:', error));
    }
  };

  // Exam management functions
  const addExam = (exam) => {
    const newExam = { id: Date.now().toString(), ...exam };
    setExams([...exams, newExam]);

    // Sync to Supabase if logged in
    if (user) {
      supabaseService.examsService
        .addExam(user.id, newExam)
        .then((result) => {
          if (result) {
            setExams((prev) => prev.map((e) => (e.id === newExam.id ? result : e)));
          }
        })
        .catch((error) => console.error('Error adding exam to Supabase:', error));
    }
  };

  const updateExam = (id, updates) => {
    setExams(exams.map((e) => (e.id === id ? { ...e, ...updates } : e)));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.examsService
        .updateExam(id, updates, user.id)
        .catch((error) => console.error('Error updating exam in Supabase:', error));
    }
  };

  const deleteExam = (id) => {
    setExams(exams.filter((e) => e.id !== id));

    // Sync to Supabase if logged in and has UUID id
    if (user && id.length > 10) {
      supabaseService.examsService
        .deleteExam(id, user.id)
        .catch((error) => console.error('Error deleting exam from Supabase:', error));
    }
  };

  // Weekly review functions
  const addWeeklyReview = (review) => {
    setWeeklyReview([
      ...weeklyReview,
      { id: Date.now().toString(), date: new Date().toISOString(), ...review },
    ]);

    // Sync to Supabase if logged in
    if (user) {
      supabaseService.reviewsService
        .addReview(user.id, review)
        .catch((error) => console.error('Error adding review to Supabase:', error));
    }
  };

  // Helper functions
  const getTasksByDate = (date) => {
    return tasks.filter((t) => t.date === date);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter((t) => t.priority === priority && !t.done);
  };

  const getCompletionStats = () => {
    const completed = tasks.filter((t) => t.done).length;
    const total = tasks.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
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
    getCompletionStats,
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
