import { useState, useEffect } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'deploy' | 'health' | 'scale' | 'alert' | 'success';
  message: string;
}

const logMessages = [
  { type: 'deploy' as const, message: 'Deploying prod-api-v3 to cluster-east' },
  { type: 'health' as const, message: 'Health check passed: db-primary (3ms)' },
  { type: 'scale' as const, message: 'Auto-scaling: +2 instances web-tier' },
  { type: 'success' as const, message: 'SSL certificate renewed: *.autopilot.io' },
  { type: 'alert' as const, message: 'Warning: High memory usage on worker-04' },
  { type: 'deploy' as const, message: 'Rolling update: frontend-v2.4.1' },
  { type: 'health' as const, message: 'Health check passed: redis-cache (1ms)' },
  { type: 'success' as const, message: 'Deployment complete: api-gateway' },
];

export function DeploymentLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Initialize with some logs
    const initialLogs = logMessages.slice(0, 4).map((log, i) => ({
      ...log,
      id: i,
      timestamp: new Date(Date.now() - (4 - i) * 30000).toLocaleTimeString('en-US', { hour12: false }),
    }));
    setLogs(initialLogs);

    // Add new logs periodically
    let counter = 4;
    const interval = setInterval(() => {
      const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog: LogEntry = {
        ...randomLog,
        id: counter++,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };
      setLogs(prev => [...prev.slice(-7), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getTypeStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'deploy':
        return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
      case 'health':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'scale':
        return { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
      case 'alert':
        return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'success':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    }
  };

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'deploy': return '▲';
      case 'health': return '♥';
      case 'scale': return '↕';
      case 'alert': return '!';
      case 'success': return '✓';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 md:w-1.5 h-4 md:h-5 bg-amber-400 rounded-full" />
          <h2 className="font-display text-sm md:text-base tracking-tight">DEPLOYMENT LOG</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono text-gray-500">LIVE</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-gray-800/20">
          {logs.map((log, index) => {
            const styles = getTypeStyles(log.type);
            return (
              <div
                key={log.id}
                className={`
                  px-4 md:px-5 py-2.5 md:py-3 flex items-start gap-2 md:gap-3
                  hover:bg-gray-800/20 transition-colors duration-150
                  ${index === logs.length - 1 ? 'animate-slideIn' : ''}
                `}
              >
                {/* Type indicator */}
                <div className={`
                  flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded ${styles.bg} border ${styles.border}
                  flex items-center justify-center text-[10px] md:text-xs ${styles.color}
                `}>
                  {getTypeIcon(log.type)}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs md:text-sm font-mono text-gray-300 break-words">
                    {log.message}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="flex-shrink-0 text-[10px] md:text-xs font-mono text-gray-600 hidden sm:block">
                  {log.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log count */}
      <div className="px-4 md:px-5 py-3 border-t border-gray-800/50 bg-gray-900/30">
        <div className="flex items-center justify-between text-[10px] md:text-xs font-mono">
          <span className="text-gray-500">SHOWING {logs.length} ENTRIES</span>
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
            VIEW ALL
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
}
