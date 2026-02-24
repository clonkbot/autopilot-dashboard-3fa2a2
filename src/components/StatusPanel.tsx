interface StatusPanelProps {
  label: string;
  value: string;
  trend: string;
  status: 'good' | 'warning' | 'neutral';
}

export function StatusPanel({ label, value, trend, status }: StatusPanelProps) {
  const statusColor = {
    good: 'text-emerald-400',
    warning: 'text-amber-400',
    neutral: 'text-cyan-400'
  };

  const glowColor = {
    good: 'shadow-emerald-500/10',
    warning: 'shadow-amber-500/10',
    neutral: 'shadow-cyan-500/10'
  };

  return (
    <div className={`
      relative bg-gray-900/50 border border-gray-800/50 rounded-lg p-3 md:p-4
      hover:border-gray-700/50 transition-all duration-300
      hover:shadow-lg ${glowColor[status]}
      group
    `}>
      {/* Corner accent */}
      <div className={`
        absolute top-0 right-0 w-6 md:w-8 h-6 md:h-8
        border-t border-r rounded-tr-lg
        ${status === 'good' ? 'border-emerald-500/30' :
          status === 'warning' ? 'border-amber-500/30' : 'border-cyan-500/30'}
        group-hover:border-opacity-60 transition-all duration-300
      `} />

      <div className="space-y-1 md:space-y-2">
        <span className="text-[10px] md:text-xs font-mono text-gray-500 tracking-wider">{label}</span>
        <div className="flex items-baseline gap-1 md:gap-2">
          <span className="text-xl md:text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
            {value}
          </span>
          <span className={`text-[10px] md:text-xs font-mono ${statusColor[status]}`}>
            {trend}
          </span>
        </div>
      </div>

      {/* Subtle animated pulse indicator */}
      <div className={`
        absolute bottom-2 md:bottom-3 right-2 md:right-3 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full
        ${status === 'good' ? 'bg-emerald-400' :
          status === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}
        animate-pulse
      `} />
    </div>
  );
}
