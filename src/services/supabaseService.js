import { supabase } from '../lib/supabase';

/**
 * Supabase service layer for database operations
 * Handles all CRUD operations for app data
 */

// ============ TASKS ============
export const tasksService = {
  async fetchTasks(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addTask(userId, task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          text: task.text,
          done: task.done || false,
          priority: task.priority,
          date: task.date,
          duedate: task.dueDate,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async updateTask(taskId, updates, userId) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteTask(taskId, userId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};

// ============ PRIORITIES ============
export const prioritiesService = {
  async fetchPriorities(userId) {
    const { data, error } = await supabase
      .from('priorities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addPriority(userId, priority) {
    const { data, error } = await supabase
      .from('priorities')
      .insert([
        {
          user_id: userId,
          name: priority.name,
          color: priority.color,
          emoji: priority.emoji,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async updatePriority(priorityId, updates, userId) {
    const { data, error } = await supabase
      .from('priorities')
      .update(updates)
      .eq('id', priorityId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deletePriority(priorityId, userId) {
    const { error } = await supabase
      .from('priorities')
      .delete()
      .eq('id', priorityId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};

// ============ GPA ============
export const gpaService = {
  async fetchGPA(userId) {
    try {
      const { data, error } = await supabase
        .from('gpa_records')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Log error but don't throw - return null to allow app to continue
        console.error('Error fetching GPA:', error);
        return null;
      }
      return data || null;
    } catch (err) {
      // Handle network or other errors gracefully
      console.error('Error fetching GPA:', err);
      return null;
    }
  },

  async upsertGPA(userId, gpaData) {
    try {
      const existing = await this.fetchGPA(userId);

      if (existing) {
        const { data, error } = await supabase
          .from('gpa_records')
          .update({
            current_gpa: gpaData.current_gpa,
            target_gpa: gpaData.target_gpa,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .eq('user_id', userId)
          .select();

        if (error) {
          console.error('Error updating GPA:', error);
          return null;
        }
        return data?.[0];
      } else {
        const { data, error } = await supabase
          .from('gpa_records')
          .insert([
            {
              user_id: userId,
              current_gpa: gpaData.current_gpa,
              target_gpa: gpaData.target_gpa,
            },
          ])
          .select();

        if (error) {
          console.error('Error inserting GPA:', error);
          return null;
        }
        return data?.[0];
      }
    } catch (err) {
      console.error('Error upserting GPA:', err);
      return null;
    }
  },
};

// ============ EXAMS ============
export const examsService = {
  async fetchExams(userId) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addExam(userId, exam) {
    const { data, error } = await supabase
      .from('exams')
      .insert([
        {
          user_id: userId,
          subject: exam.subject,
          date: exam.date,
          topics: exam.topics,
          completedTopics: exam.completedTopics || 0,
          description: exam.description,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async updateExam(examId, updates, userId) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', examId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteExam(examId, userId) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};

// ============ WEEKLY REVIEWS ============
export const reviewsService = {
  async fetchReviews(userId) {
    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addReview(userId, review) {
    const { data, error } = await supabase
      .from('weekly_reviews')
      .insert([
        {
          user_id: userId,
          date: review.date,
          whatWentWell: review.whatWentWell,
          improvements: review.improvements,
          nextWeekGoals: review.nextWeekGoals,
          challenges: review.challenges,
          mood: review.mood,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  },
};

// ============ POMODORO SETTINGS ============
export const pomodoroService = {
  async fetchSettings(userId) {
    const { data, error } = await supabase
      .from('pomodoro_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async upsertSettings(userId, settings) {
    const existing = await this.fetchSettings(userId);

    if (existing) {
      const { data, error } = await supabase
        .from('pomodoro_settings')
        .update({
          work_duration: settings.workDuration,
          break_duration: settings.breakDuration,
          sessions_completed: settings.sessionsCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      return data?.[0];
    } else {
      const { data, error } = await supabase
        .from('pomodoro_settings')
        .insert([
          {
            user_id: userId,
            work_duration: settings.workDuration || 25,
            break_duration: settings.breakDuration || 5,
            sessions_completed: settings.sessionsCompleted || 0,
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    }
  },
};

// ============ BATCH OPERATIONS (for data migration) ============
export const batchService = {
  async migrateTasks(userId, tasks) {
    if (!tasks.length) return [];

    const tasksToInsert = tasks.map(t => ({
      user_id: userId,
      text: t.text,
      done: t.done,
      priority: t.priority,
      date: t.date,
      duedate: t.dueDate,
      created_at: t.created_at || new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (error) throw error;
    return data || [];
  },

  async migratePriorities(userId, priorities) {
    if (!priorities.length) return [];

    const prioritiesToInsert = priorities.map(p => ({
      user_id: userId,
      name: p.name,
      color: p.color,
      emoji: p.emoji,
      created_at: p.created_at || new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('priorities')
      .insert(prioritiesToInsert)
      .select();

    if (error) throw error;
    return data || [];
  },
};
