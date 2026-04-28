import { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as supabaseService from '../services/supabaseService';

export default function MigrationDialog() {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && !migrated) {
      checkForMigration();
    }
  }, [user, migrated]);

  const checkForMigration = () => {
    // Check if there's localStorage data and if migration hasn't been done yet
    const hasMigrationBeenAsked = localStorage.getItem('migrationAsked');
    const hasLocalData = localStorage.getItem('tasks') || localStorage.getItem('priorities');

    if (hasLocalData && !hasMigrationBeenAsked) {
      setShowDialog(true);
    }
  };

  const handleMigrate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get all localStorage data
      const tasksData = JSON.parse(localStorage.getItem('tasks') || '[]');
      const prioritiesData = JSON.parse(localStorage.getItem('priorities') || '[]');

      // Batch migrate to Supabase
      if (tasksData.length > 0) {
        await supabaseService.batchService.migrateTasks(user.id, tasksData);
      }

      if (prioritiesData.length > 0) {
        await supabaseService.batchService.migratePriorities(user.id, prioritiesData);
      }

      localStorage.setItem('migrationAsked', 'true');
      setMigrated(true);
      setTimeout(() => setShowDialog(false), 1500);
    } catch (err) {
      setError(err.message || 'Migration failed. Please try again.');
      console.error('Migration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('migrationAsked', 'true');
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
        {migrated ? (
          // Success state
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Data Migrated!</h2>
            <p className="text-slate-300 text-sm">
              Your tasks and priorities have been synced to the cloud. ✨
            </p>
          </div>
        ) : (
          <>
            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Sync Your Data</h2>
                <p className="text-xs text-slate-400">Found local data to migrate</p>
              </div>
            </div>

            {/* Message */}
            <p className="text-slate-300 text-sm mb-4">
              We found your tasks and priorities saved locally. Would you like to sync them to
              the cloud so you can access them from any device?
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 font-medium text-sm transition-all"
              >
                Skip for Now
              </button>
              <button
                onClick={handleMigrate}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
