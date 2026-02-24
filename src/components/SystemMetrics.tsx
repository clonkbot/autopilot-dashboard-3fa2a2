import { useState, useEffect } from 'react';

interface MetricData {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'CPU', value: 34, max: 100, unit: '%', color: 'bg-cyan-400' },
    { label: 'Memory', value: 67, max: 100, unit: '%', color: 'bg-emerald-400' },
    { label: 'Disk I/O', value: 12, max: 100, unit: 'MB/s', color: 'bg-amber-400' },
    { label: 'Network', value: 45, max: 100, unit: 'Mbps', color: 'bg-violet-400' },
  ]);

  const [history, setHistory] = useState<number[]>(Array(20).fill(0).map(() => Math.random() * 60 + 20));

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(5, Math.min(95, m.value + (Math.random() - 0.5) * 15))
      })));

      setHistory(prev => [...prev.slice(1), Math.random() * 60 + 20]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-800/50 flex items-center gap-2 md:gap-3">
        <div className="w-1 md:w-1.5 h-4 md:h-5 bg-violet-400 rounded-full" />
        <h2 className="font-display text-sm md:text-base tracking-tight">SYSTEM METRICS</h2>
      </div>

      {/* Mini graph */}
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-800/30">
        <div className="h-16 md:h-20 flex items-end gap-0.5 md:gap-1">
          {history.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500/60 to-cyan-400/20 rounded-t transition-all duration-300"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] md:text-[10px] font-mono text-gray-600">
          <span>-20s</span>
          <span>NOW</span>
        </div>
      </div>

      {/* Metric bars */}
      <div className="p-4 md:p-5 space-y-3 md:space-y-4 flex-grow">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1 md:space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-xs font-mono text-gray-500">{metric.label}</span>
              <span className="text-[10px] md:text-xs font-mono text-gray-400">
                {Math.round(metric.value)}{metric.unit}
              </span>
            </div>
            <div className="h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${metric.color} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate status */}
      <div className="px-4 md:px-5 py-3 border-t border-gray-800/50 bg-gray-900/30">
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div>
            <div className="text-base md:text-lg font-mono font-bold text-white">12</div>
            <div className="text-[9px] md:text-[10px] font-mono text-gray-500">HOSTS</div>
          </div>
          <div>
            <div className="text-base md:text-lg font-mono font-bold text-emerald-400">98%</div>
            <div className="text-[9px] md:text-[10px] font-mono text-gray-500">HEALTH</div>
          </div>
          <div>
            <div className="text-base md:text-lg font-mono font-bold text-cyan-400">3ms</div>
            <div className="text-[9px] md:text-[10px] font-mono text-gray-500">LATENCY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
