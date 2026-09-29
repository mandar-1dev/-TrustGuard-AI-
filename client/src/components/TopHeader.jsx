import React from 'react';
import { Shield, Sparkles, Terminal, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function TopHeader({ title = 'Security Overview', subtitle = 'Real-time threat monitoring and privacy audit' }) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Real-time guard indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-medium">Supabase & Gemini Online</span>
        </div>

        {/* Security level badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">TrustGuard Pro</span>
        </div>
      </div>
    </header>
  );
}
