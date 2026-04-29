import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as supabaseService from '../services/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const hasLoadedFromSupabase = useRef(false);
  const lastSyncTimeRef = useRef({
    tasks: 0,
    priorities: 0,
    gpa: 0,
    exams: 0,
    pomodoro: 0,
  });

  // Helper to debounce syncs (prevent syncing the same data multiple times)
  const shouldSync = (key) => {
    const now = Date.now();
    const lastTime = lastSyncTimeRef.current[key] || 0;
    return now - lastTime > 2000; // Only sync if more than 2 seconds since last sync
  };

  const recordSync = (key) => {
    lastSyncTimeRef.current[key] = Date.now();
  };
  const [priorities, setPriorities] = useState(() => {
    const saved = localStorage.getItem('priorities');
    return saved ? JSON.parse(saved) : [];
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
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

  // Fetch data from Supabase on login, clear on logout
  useEffect(() => {
    if (user && !hasLoadedFromSupabase.current) {
      loadDataFromSupabase();
      hasLoadedFromSupabase.current = true;
    } else if (!user) {
      // Reset flag, sync timers, clear state, and clear localStorage when user logs out
      hasLoadedFromSupabase.current = false;
      lastSyncTimeRef.current = {
        tasks: 0,
        priorities: 0,
        gpa: 0,
        exams: 0,
        pomodoro: 0,
      };
      // Clear localStorage to prevent data leaking to next user
      localStorage.removeItem('tasks');
      localStorage.removeItem('priorities');
      localStorage.removeItem('gpa');
      localStorage.removeItem('targetGpa');
      localStorage.removeItem('pomodoroSettings');
      localStorage.removeItem('weeklyReview');
      localStorage.removeItem('exams');
      localStorage.removeItem('migrationAsked');

      setTasks([]);
      setPriorities([]);
      setGpa(1.75);
      setTargetGpa(3.5);
      setPomodoroSettings({
        workDuration: 25,
        breakDuration: 5,
        sessionsCompleted: 0,
      });
      setWeeklyReview([]);
      setExams([]);
    }
  }, [user]);

  const loadDataFromSupabase = async () => {
    // Capture the user at the time this function is called
    const currentUser = user;

    try {
      const [tasksData, prioritiesData, examsData, reviewsData, gpaData, pomodoroData] =
        await Promise.all([
          supabaseService.tasksService.fetchTasks(currentUser.id),
          supabaseService.prioritiesService.fetchPriorities(currentUser.id),
          supabaseService.examsService.fetchExams(currentUser.id),
          supabaseService.reviewsService.fetchReviews(currentUser.id),
          supabaseService.gpaService.fetchGPA(currentUser.id),
          supabaseService.pomodoroService.fetchSettings(currentUser.id),
        ]);

      // Ignore results if user has changed since the load started (stale data)
      if (user?.id !== currentUser.id) {
        return;
      }

      // Load from Supabase - always set to avoid stale data from previous user
      setTasks(tasksData);
      localStorage.setItem('tasks', JSON.stringify(tasksData));

      setPriorities(prioritiesData);
      localStorage.setItem('priorities', JSON.stringify(prioritiesData));

      // Create default priorities for new users with no priorities
      if (!prioritiesData || prioritiesData.length === 0) {
        const defaultPriorities = [
          { name: 'High', color: 'red', emoji: '🔥' },
          { name: 'Medium', color: 'yellow', emoji: '⚡' },
          { name: 'Low', color: 'blue', emoji: '💙' },
        ];

        // Add each default priority to Supabase
        for (const defaultPriority of defaultPriorities) {
          try {
            const newPriority = await supabaseService.prioritiesService.addPriority(user.id, defaultPriority);
            if (newPriority) {
              prioritiesData.push(newPriority);
            }
          } catch (error) {
            console.error('Error creating default priority:', error);
          }
        }

        setPriorities(prioritiesData);
        localStorage.setItem('priorities', JSON.stringify(prioritiesData));
      }

      if (examsData && examsData.length > 0) {
        setExams(examsData);
        localStorage.setItem('exams', JSON.stringify(examsData));
      }

      if (reviewsData && reviewsData.length > 0) {
        setWeeklyReview(reviewsData);
        localStorage.setItem('weeklyReview', JSON.stringify(reviewsData));
      }

      // Fetch GPA data - skip if fetch fails to prevent errors
      try {
        const gpaData = await supabaseService.gpaService.fetchGPA(currentUser.id);
        if (gpaData) {
          setGpa(gpaData.current_gpa);
          setTargetGpa(gpaData.target_gpa);
          localStorage.setItem('gpa', gpaData.current_gpa.toString());
          localStorage.setItem('targetGpa', gpaData.target_gpa.toString());
        }
      } catch (err) {
        console.error('GPA fetch failed, using default values:', err);
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
    }
  };

  // Persist to localStorage and sync to Supabase
  useEffect(() => {
    localStorage.setItem('priorities', JSON.stringify(priorities));
    if (user && hasLoadedFromSupabase.current && shouldSync('priorities')) {
      recordSync('priorities');
      syncPrioritiesToSupabase(priorities);
    }
  }, [priorities, user]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (user && hasLoadedFromSupabase.current && shouldSync('tasks')) {
      recordSync('tasks');
      syncTasksToSupabase(tasks);
    }
  }, [tasks, user]);

  useEffect(() => {
    localStorage.setItem('gpa', gpa.toString());
    if (user && hasLoadedFromSupabase.current && shouldSync('gpa')) {
      recordSync('gpa');
      syncGPAToSupabase(gpa, targetGpa);
    }
  }, [gpa, user]);

  useEffect(() => {
    localStorage.setItem('targetGpa', targetGpa.toString());
    if (user && hasLoadedFromSupabase.current && shouldSync('gpa')) {
      recordSync('gpa');
      syncGPAToSupabase(gpa, targetGpa);
    }
  }, [targetGpa, user]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroSettings));
    if (user && hasLoadedFromSupabase.current && shouldSync('pomodoro')) {
      recordSync('pomodoro');
      syncPomodoroToSupabase(pomodoroSettings);
    }
  }, [pomodoroSettings, user]);

  useEffect(() => {
    localStorage.setItem('weeklyReview', JSON.stringify(weeklyReview));
  }, [weeklyReview]);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
    if (user && hasLoadedFromSupabase.current && shouldSync('exams')) {
      recordSync('exams');
      syncExamsToSupabase(exams);
    }
  }, [exams, user]);

  // Sync functions - only sync new/modified items
  const syncTasksToSupabase = async (tasksToSync) => {
    if (!user) return;
    try {
      for (const task of tasksToSync) {
        // Only sync tasks with local IDs (not already in Supabase)
        if (typeof task.id === 'string' && task.id.length < 20) {
          const newTask = await supabaseService.tasksService.addTask(user.id, task);
          if (newTask) {
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? newTask : t))
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
        // Skip default priority IDs and only sync local (temporary) IDs
        if (typeof priority.id === 'string' && priority.id.length < 20 && !['1', '2', '3'].includes(priority.id)) {
          const newPriority = await supabaseService.prioritiesService.addPriority(
            user.id,
            priority
          );
          if (newPriority) {
            setPriorities((prev) =>
              prev.map((p) => (p.id === priority.id ? newPriority : p))
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
        if (typeof exam.id === 'string' && exam.id.length < 20) {
          const newExam = await supabaseService.examsService.addExam(user.id, exam);
          if (newExam) {
            setExams((prev) => prev.map((e) => (e.id === exam.id ? newExam : e)));
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
    // Note: Syncing to Supabase is handled by the useEffect that watches tasks changes
    // This prevents duplicate adds to Supabase
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, done: !task.done };
    setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));

    if (user && id.length > 20) {
      supabaseService.tasksService
        .updateTask(id, { done: !task.done }, user.id)
        .catch((error) => console.error('Error updating task in Supabase:', error));
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));

    if (user && id.length > 20) {
      supabaseService.tasksService
        .deleteTask(id, user.id)
        .catch((error) => console.error('Error deleting task from Supabase:', error));
    }
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    if (user && id.length > 20) {
      supabaseService.tasksService
        .updateTask(id, updates, user.id)
        .catch((error) => console.error('Error updating task in Supabase:', error));
    }
  };

  const addPriority = (name, color, emoji = '⭐') => {
    const newPriority = { id: Date.now().toString(), name, color, emoji };
    setPriorities([...priorities, newPriority]);

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

    if (user && id.length > 20) {
      supabaseService.prioritiesService
        .updatePriority(id, updates, user.id)
        .catch((error) => console.error('Error updating priority in Supabase:', error));
    }
  };

  const deletePriority = (id) => {
    setPriorities(priorities.filter((p) => p.id !== id));

    if (user && id.length > 20) {
      supabaseService.prioritiesService
        .deletePriority(id, user.id)
        .catch((error) => console.error('Error deleting priority from Supabase:', error));
    }
  };

  const addExam = (exam) => {
    const newExam = { id: Date.now().toString(), ...exam };
    setExams([...exams, newExam]);

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

    if (user && id.length > 20) {
      supabaseService.examsService
        .updateExam(id, updates, user.id)
        .catch((error) => console.error('Error updating exam in Supabase:', error));
    }
  };

  const deleteExam = (id) => {
    setExams(exams.filter((e) => e.id !== id));

    if (user && id.length > 20) {
      supabaseService.examsService
        .deleteExam(id, user.id)
        .catch((error) => console.error('Error deleting exam from Supabase:', error));
    }
  };

  const addWeeklyReview = (review) => {
    setWeeklyReview([
      ...weeklyReview,
      { id: Date.now().toString(), date: new Date().toISOString(), ...review },
    ]);

    if (user) {
      supabaseService.reviewsService
        .addReview(user.id, review)
        .catch((error) => console.error('Error adding review to Supabase:', error));
    }
  };

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
