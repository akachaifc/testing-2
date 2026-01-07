
import React, { useEffect, useState } from 'react';
import { HostingStats } from '../types';

const HostingDashboard: React.FC = () => {
  const [stats, setStats] = useState<HostingStats>({
    loadTime: 0,
    apiLatency: 0,
    memoryUsage: 'N/A',
    status: 'Healthy'
  });

  useEffect(() => {
    const startTime = performance.now();
    window.addEventListener('load', () => {
      const loadTime = Math.round(performance.now() - startTime);
      setStats(prev => ({ ...prev, loadTime }));
    });

    // Mock memory usage (since navigator.deviceMemory is limited)
    const mem = (window.performance as any).memory;
    if (mem) {
      const used = Math.round(mem.usedJSHeapSize / 1024 / 1024);
      setStats(prev => ({ ...prev, memoryUsage: `${used} MB` }));
    }
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Load Time" value={`${stats.loadTime}ms`} color="text-blue-600" />
      <StatCard label="Hosting Status" value={stats.status} color="text-emerald-600" />
      <StatCard label="Runtime" value="React 18" color="text-purple-600" />
      <StatCard label="Memory Used" value={stats.memoryUsage} color="text-orange-600" />
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);

export default HostingDashboard;
