import { Cloud, CloudOff, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs">
        <CloudOff className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-amber-300 font-medium">Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs">
      <Cloud className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-emerald-300 font-medium">Synced</span>
    </div>
  );
}
