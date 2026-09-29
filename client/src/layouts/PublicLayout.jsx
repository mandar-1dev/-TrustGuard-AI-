import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Shield, ExternalLink, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white cyber-grid">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center">
                TrustGuard <span className="text-sky-400 ml-1">AI</span>
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                Security & Privacy
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="/#features" className="hover:text-sky-400 transition">Features</a>
            <a href="/#how-it-works" className="hover:text-sky-400 transition">How It Works</a>
            <a href="/#architecture" className="hover:text-sky-400 transition">Security Model</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">TrustGuard AI</p>
              <p className="text-[11px] text-slate-400">
                Your AI Security & Privacy Guardian
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center max-w-md">
            <span className="text-slate-300 font-semibold">Trust & Safety Disclaimer: </span>
            AI-generated security assessments may be imperfect. Verify important information through trusted official channels.
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <span>Powered by Gemini & Supabase</span>
            <span className="text-slate-600">•</span>
            <Link to="/login" className="hover:text-slate-200 transition">Login</Link>
            <Link to="/register" className="hover:text-slate-200 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
