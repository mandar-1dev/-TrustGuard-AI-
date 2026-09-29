import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

const SEVERITY_CONFIG = {
  CRITICAL: {
    icon: Flame,
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-800/60',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  HIGH: {
    icon: AlertCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-950/30',
    border: 'border-rose-900/40',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  MEDIUM: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-900/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  LOW: {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-900/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
};

export default function ThreatCard({ threat }) {
  const severity = threat.severity?.toUpperCase() || 'MEDIUM';
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.MEDIUM;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">
            {threat.type || threat.threat_type}
          </h4>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}>
          {severity}
        </span>
      </div>
      <p className="mt-2.5 text-xs text-slate-300 leading-relaxed pl-1">
        {threat.description}
      </p>
    </div>
  );
}
