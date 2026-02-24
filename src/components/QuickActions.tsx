import { useState } from 'react';

interface Action {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgHover: string;
}

const actions: Action[] = [
  { id: 'deploy', label: 'Deploy All', icon: '▲', color: 'text-cyan-400', bgHover: 'hover:bg-cyan-500/10' },
  { id: 'rollback', label: 'Rollback', icon: '↺', color: 'text-amber-400', bgHover: 'hover:bg-amber-500/10' },
  { id: 'scale', label: 'Scale Up', icon: '↑', color: 'text-emerald-400', bgHover: 'hover:bg-emerald-500/10' },
  { id: 'pause', label: 'Pause Queue', icon: '‖', color: 'text-gray-400', bgHover: 'hover:bg-gray-500/10' },
];

export function QuickActions() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleAction = (id: string) => {
    if (confirming === id) {
      setActiveAction(id);
      setConfirming(null);
      setTimeout(() => setActiveAction(null), 2000);
    } else {
      setConfirming(id);
      setTimeout(() => setConfirming(null), 3000);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-800/50 flex items-center gap-2 md:gap-3">
        <div className="w-1 md:w-1.5 h-4 md:h-5 bg-emerald-400 rounded-full" />
        <h2 className="font-display text-sm md:text-base tracking-tight">QUICK ACTIONS</h2>
      </div>

      <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex-grow">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={activeAction !== null}
            className={`
              w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3
              bg-gray-800/30 border border-gray-700/30 rounded-lg
              transition-all duration-200 group
              ${action.bgHover}
              hover:border-gray-600/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${confirming === action.id ? 'border-amber-500/50 bg-amber-500/5' : ''}
              ${activeAction === action.id ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
            `}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className={`text-base md:text-lg ${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </span>
              <span className="text-xs md:text-sm font-mono text-gray-300">
                {confirming === action.id ? 'Confirm?' :
                 activeAction === action.id ? 'Running...' :
                 action.label}
              </span>
            </div>

            <div className={`
              w-5 h-5 md:w-6 md:h-6 rounded border flex items-center justify-center
              transition-all duration-200
              ${confirming === action.id ? 'border-amber-500 bg-amber-500/20' :
                activeAction === action.id ? 'border-emerald-500 bg-emerald-500/20' :
                'border-gray-700 group-hover:border-gray-600'}
            `}>
              {activeAction === action.id ? (
                <div className="w-2 h-2 md:w-3 md:h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className={`w-2.5 h-2.5 md:w-3 md:h-3 ${confirming === action.id ? 'text-amber-400' : 'text-gray-600 group-hover:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Status indicator */}
      <div className="px-4 md:px-5 py-3 border-t border-gray-800/50 bg-gray-900/30">
        <div className="flex items-center justify-between text-[10px] md:text-xs font-mono">
          <span className="text-gray-500">AUTO-DEPLOY</span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">ENABLED</span>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
