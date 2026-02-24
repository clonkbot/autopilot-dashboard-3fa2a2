import { useState, useEffect } from 'react';

interface QueueItem {
  id: string;
  task: string;
  target: string;
  status: 'running' | 'queued' | 'completed';
  progress: number;
}

const initialQueue: QueueItem[] = [
  { id: '001', task: 'Deploy', target: 'prod-api-v3', status: 'running', progress: 67 },
  { id: '002', task: 'Health Check', target: 'db-cluster-01', status: 'queued', progress: 0 },
  { id: '003', task: 'SSL Renewal', target: '*.autopilot.io', status: 'queued', progress: 0 },
];

export function AutomationQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prev => prev.map(item => {
        if (item.status === 'running' && item.progress < 100) {
          const newProgress = Math.min(100, item.progress + Math.random() * 8);
          return {
            ...item,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        if (item.status === 'queued' && prev.find(i => i.status === 'running')?.progress === 100) {
          return { ...item, status: 'running' as const };
        }
        return item;
      }));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'running':
        return (
          <div className="relative w-3 h-3 md:w-4 md:h-4">
            <div className="absolute inset-0 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      case 'completed':
        return (
          <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'queued':
        return <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-600 rounded-full" />;
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden h-full">
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 md:w-1.5 h-4 md:h-5 bg-cyan-400 rounded-full" />
          <h2 className="font-display text-sm md:text-base tracking-tight">AUTOMATION QUEUE</h2>
        </div>
        <span className="text-[10px] md:text-xs font-mono text-gray-500">{queue.length} TASKS</span>
      </div>

      <div className="divide-y divide-gray-800/30">
        {queue.map((item, index) => (
          <div
            key={item.id}
            className="px-4 md:px-5 py-3 md:py-4 hover:bg-gray-800/20 transition-colors duration-200"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3 md:gap-4">
              {/* Status icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(item.status)}
              </div>

              {/* Task info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs md:text-sm font-mono text-white truncate">{item.task}</span>
                  <span className="text-[10px] md:text-xs font-mono text-gray-500 bg-gray-800/50 px-1.5 md:px-2 py-0.5 rounded truncate hidden sm:inline">
                    {item.target}
                  </span>
                </div>

                {/* Progress bar */}
                {item.status === 'running' && (
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 ease-out"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Progress percentage */}
              <div className="flex-shrink-0 text-right">
                <span className={`text-xs md:text-sm font-mono ${
                  item.status === 'completed' ? 'text-emerald-400' :
                  item.status === 'running' ? 'text-cyan-400' : 'text-gray-600'
                }`}>
                  {item.status === 'completed' ? 'DONE' :
                   item.status === 'running' ? `${Math.round(item.progress)}%` : 'QUEUED'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Queue visualization */}
      <div className="px-4 md:px-5 py-3 border-t border-gray-800/50 bg-gray-900/30">
        <div className="flex items-center gap-1 md:gap-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 md:h-1.5 rounded-full ${
                i < 3 ? 'bg-cyan-400/60' : 'bg-gray-800'
              }`}
              style={{
                animation: i < 3 ? `pulse 2s ease-in-out ${i * 0.2}s infinite` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
