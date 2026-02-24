import { useState, useEffect } from 'react';
import { StatusPanel } from './components/StatusPanel';
import { AutomationQueue } from './components/AutomationQueue';
import { SystemMetrics } from './components/SystemMetrics';
import { DeploymentLog } from './components/DeploymentLog';
import { QuickActions } from './components/QuickActions';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'operational' | 'deploying' | 'maintenance'>('operational');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate status changes
    const statusCycle = setInterval(() => {
      const statuses: Array<'operational' | 'deploying' | 'maintenance'> = ['operational', 'deploying', 'maintenance'];
      setSystemStatus(statuses[Math.floor(Math.random() * 3)]);
    }, 8000);
    return () => clearInterval(statusCycle);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,200,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }} />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top status bar */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#0a0a0b]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                systemStatus === 'operational' ? 'bg-emerald-400' :
                systemStatus === 'deploying' ? 'bg-cyan-400' : 'bg-amber-400'
              }`}>
                <div className={`absolute inset-0 rounded-full animate-ping ${
                  systemStatus === 'operational' ? 'bg-emerald-400' :
                  systemStatus === 'deploying' ? 'bg-cyan-400' : 'bg-amber-400'
                } opacity-75`} />
              </div>
            </div>
            <h1 className="font-display text-lg md:text-xl tracking-tight">AUTOPILOT</h1>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono tracking-wider">v2.4.1</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">STATUS:</span>
              <span className={`uppercase tracking-wider ${
                systemStatus === 'operational' ? 'text-emerald-400' :
                systemStatus === 'deploying' ? 'text-cyan-400' : 'text-amber-400'
              }`}>
                {systemStatus}
              </span>
            </div>
            <div className="text-gray-400 hidden sm:block">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Top row - Status panels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 animate-fadeIn">
          <StatusPanel
            label="UPTIME"
            value="99.97%"
            trend="+0.02%"
            status="good"
          />
          <StatusPanel
            label="DEPLOYMENTS"
            value="847"
            trend="24h"
            status="neutral"
          />
          <StatusPanel
            label="ACTIVE HOSTS"
            value="12"
            trend="+2"
            status="good"
          />
          <StatusPanel
            label="QUEUE DEPTH"
            value="3"
            trend="-5"
            status="good"
          />
        </div>

        {/* Middle row - Main panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="lg:col-span-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <AutomationQueue />
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <QuickActions />
          </div>
        </div>

        {/* Bottom row - Metrics and logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <SystemMetrics />
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <DeploymentLog />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 md:mt-12 pb-4 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="border-t border-gray-800/30 pt-4 md:pt-6 flex justify-center">
            <p className="text-[10px] md:text-xs text-gray-600 font-mono tracking-wide">
              Requested by <span className="text-gray-500">@Quincy</span> · Built by <span className="text-gray-500">@clonkbot</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .font-display {
          font-family: 'Archivo Black', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default App;
