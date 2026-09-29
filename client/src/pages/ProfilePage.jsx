import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  EyeOff, 
  LogOut, 
  Activity, 
  Clock, 
  Save, 
  Check, 
  KeyRound,
  Shield
} from 'lucide-react';
import { profileService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TopHeader from '../components/TopHeader.jsx';

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
        setName(res.data.user.name);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Unable to load security profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await profileService.updateProfile({ name });
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('trustguard_user', JSON.stringify(res.data));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <TopHeader title="Profile & Security" subtitle="Loading your profile credentials..." />
        <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800" />
      </div>
    );
  }

  const summary = profileData?.securitySummary || { totalScans: 0, threatsDetected: 0, privacyFindings: 0 };

  return (
    <div className="space-y-8 pb-16">
      <TopHeader
        title="Profile & Security Settings"
        subtitle="Manage your account, view security activity, and audit identity permissions"
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Main Account Details Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-sky-500/25">
              {profileData?.user?.name ? profileData.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>{profileData?.user?.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold uppercase">
                  {profileData?.user?.role || 'User'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{profileData?.user?.email}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Member since {new Date(profileData?.user?.created_at || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleUpdate} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-200"
              />
              <button
                type="submit"
                disabled={saving || name === profileData?.user?.name}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition disabled:opacity-40 flex items-center space-x-1.5"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? 'Saved' : saving ? 'Saving...' : 'Update'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Security Analytics Summary Cards */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security Lifecycle Metrics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Total Scans Performed</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{summary.totalScans}</p>
            <p className="text-[11px] text-slate-500 mt-1">Archived in Supabase</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Threats Identified</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-extrabold text-rose-400 font-mono">{summary.threatsDetected}</p>
            <p className="text-[11px] text-slate-500 mt-1">Phishing & malicious indicators</p>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Privacy Findings</span>
              <EyeOff className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-purple-400 font-mono">{summary.privacyFindings}</p>
            <p className="text-[11px] text-slate-500 mt-1">Exposed PII elements discovered</p>
          </div>
        </div>
      </div>

      {/* Security Audit Activity Log */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Account Security Audit Log</span>
          </h3>
          <span className="text-[10px] uppercase font-mono text-slate-500">Immutable Records</span>
        </div>

        <div className="space-y-2.5">
          {profileData?.recentSecurityEvents && profileData.recentSecurityEvents.length > 0 ? (
            profileData.recentSecurityEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    ev.event_type === 'LOGIN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    ev.event_type.includes('HIGH_RISK') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  }`}>
                    {ev.event_type}
                  </span>
                  <span className="text-slate-300 truncate max-w-md">{ev.description}</span>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">
                  {new Date(ev.created_at).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No audit records recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
