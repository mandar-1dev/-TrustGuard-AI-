import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  EyeOff, 
  Activity, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Info,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { dashboardService } from '../services/api.js';
import TopHeader from '../components/TopHeader.jsx';
import RiskGauge from '../components/RiskGauge.jsx';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [statsData, actData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getActivity({ limit: 6 })
        ]);

        if (statsData.success) setStats(statsData.data);
        if (actData.success) setActivity(actData.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <TopHeader title="Dashboard" subtitle="Loading your security status..." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Scans', value: stats?.totalScans ?? 0, icon: Activity, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    { label: 'Threats Detected', value: stats?.threatsDetected ?? 0, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'High Risk Scans', value: stats?.highRiskScans ?? 0, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'Privacy Risks', value: stats?.privacyRisks ?? 0, icon: EyeOff, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Safe Scans', value: stats?.safeScans ?? 0, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <TopHeader
        title="Security Dashboard"
        subtitle="Real-time threat monitoring and privacy risk assessment"
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Top Banner: Security Score & Scan CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TrustGuard Security Score Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TrustGuard Security Score</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {stats?.securityScore >= 75 ? 'Strong Security Posture' : stats?.securityScore >= 50 ? 'Moderate Risk Detected' : 'Action Recommended'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated from your recent scan activity based on detected threats and sensitive data exposure levels.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>This score reflects analysis of content submitted through your account.</span>
            </div>
          </div>

          <div className="shrink-0">
            <RiskGauge
              score={stats?.securityScore ?? 85}
              threatLevel={stats?.securityScore >= 75 ? 'SAFE' : stats?.securityScore >= 50 ? 'MEDIUM' : 'HIGH'}
              size={150}
            />
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-sky-500/25">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <h3 className="text-base font-bold text-white">Scan Suspicious Content</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Paste an SMS, KYC notice, unknown email, or URL to identify phishing, malware, and privacy leaks.
            </p>
          </div>

          <Link
            to="/scan"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-600/20 transition"
          >
            <span>Launch AI Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <div key={i} className="glass-card p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{sc.label}</span>
                <div className={`p-1.5 rounded-lg ${sc.bg} ${sc.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">{sc.value}</p>
            </div>
          );
        })}
      </div>

      {/* Risk Trend Chart & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Risk Score Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Risk scores across your recent scans (0 = Safe, 100 = Critical)</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
              Recent Scans
            </span>
          </div>

          <div className="h-64 w-full">
            {stats?.riskTrend && stats.riskTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="scanIndex" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value} / 100`, 'Risk Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No recent scans available to graph. Run a scan to see risk trends.
              </div>
            )}
          </div>
        </div>

        {/* Security Audit Events List */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Security Events</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-500">Audit Trail</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1">
              {activity?.securityEvents && activity.securityEvents.length > 0 ? (
                activity.securityEvents.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        ev.event_type.includes('HIGH_RISK') ? 'text-rose-400' :
                        ev.event_type.includes('PRIVACY') ? 'text-amber-400' : 'text-sky-400'
                      }`}>
                        {ev.event_type}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300 text-xs truncate">
                      {ev.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No security events recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <Link
              to="/history"
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center justify-between"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Scans Table / Cards */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Threat Assessments</h3>
            <p className="text-xs text-slate-400">Latest digital content analyzed by TrustGuard AI</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>See all scans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {activity?.recentScans && activity.recentScans.length > 0 ? (
            activity.recentScans.slice(0, 4).map((scan) => {
              const isHigh = scan.threat_level === 'HIGH' || scan.threat_level === 'CRITICAL';
              const isMed = scan.threat_level === 'MEDIUM';

              return (
                <div
                  key={scan.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <span className="text-lg">
                      {isHigh ? '🔴' : isMed ? '🟠' : '🟢'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white truncate max-w-sm">
                          {scan.summary}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 uppercase font-mono">
                          {scan.input_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate max-w-xl">
                        {scan.input_content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-white">
                        {scan.risk_score}
                      </span>
                      <span className="text-slate-500 text-xs">/100</span>
                      <p className="text-[10px] text-slate-500">
                        {new Date(scan.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <Link
                      to={`/history?scanId=${scan.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No scans performed yet. Click "Launch AI Scanner" to analyze content!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
