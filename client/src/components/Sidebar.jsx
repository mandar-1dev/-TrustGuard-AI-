import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  User, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan Threat', path: '/scan', icon: ScanSearch, badge: 'AI' },
    { name: 'Scan History', path: '/history', icon: History },
    { name: 'Profile & Security', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#090d16] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/80">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/20 text-white">
            <ShieldCheck className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center">
              TrustGuard <span className="text-sky-400 ml-1">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Security Guardian
            </span>
          </div>
        </div>

        {/* Quick Scan Action Button */}
        <div className="px-4 pt-5 pb-2">
          <NavLink
            to="/scan"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Analyze New Threat</span>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Section & Footer Status */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* System Status Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AI Shield Active</span>
          </span>
          <span className="font-mono text-emerald-400 text-[10px]">v1.0-LIVE</span>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800/60 flex items-center justify-center text-xs font-bold text-sky-400 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Security Analyst'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'analyst@trustguard.ai'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
