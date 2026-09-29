import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Search, 
  EyeOff, 
  FileSearch, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Database, 
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: ShieldAlert,
      title: 'AI Threat Detection',
      desc: 'Instantly identifies social engineering cues, zero-day phishing patterns, urgency manipulation, and credential harvesting links.',
      accent: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    },
    {
      icon: EyeOff,
      title: 'Privacy Protection & Redaction',
      desc: 'Discovers exposed Personally Identifiable Information (SSN, credit cards, phones, emails) and provides one-click token redaction.',
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      icon: FileSearch,
      title: 'Transparent AI Explanations',
      desc: 'Never wonder why something is dangerous. TrustGuard explains the exact psychological and digital indicators behind the score.',
      accent: 'border-sky-500/30 text-sky-400 bg-sky-500/10'
    },
    {
      icon: Activity,
      title: 'Security Dashboard',
      desc: 'Track your personal security score calculated from scan activity, analyze historical trends, and inspect security audit events.',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    },
    {
      icon: Database,
      title: 'Secure PostgreSQL History',
      desc: 'Encrypted persistence with Supabase PostgreSQL and Row-Level Security ensuring your analysis records remain 100% confidential.',
      accent: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    }
  ];

  const steps = [
    { step: '01', title: 'Submit Content', desc: 'Paste any suspicious SMS, phishing email, unverified URL, or raw text into the scanner.' },
    { step: '02', title: 'AI Analyzes Threats', desc: 'Gemini and security heuristics examine psychological urgency, deceptive domains, and fraud signals.' },
    { step: '03', title: 'Privacy Risks Detected', desc: 'Sensitive PII such as phone numbers, emails, government IDs, and banking details are cataloged.' },
    { step: '04', title: 'Transparent Explanation', desc: 'Receive a 0-100 risk score, calibrated severity rating, and point-by-point reasons WHY it is risky.' },
    { step: '05', title: 'Sanitize & Save Securely', desc: 'Redact PII with one click and archive the report securely in your encrypted Supabase vault.' }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-8 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Next-Generation AI Security & Privacy Guardian</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Detect threats. Protect your privacy.{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Make smarter digital decisions.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TrustGuard AI analyzes suspicious digital content using AI and provides transparent security and privacy risk assessments with instant PII redaction.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/scan"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-sky-600/30 transition transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Analyze a Threat</span>
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Interactive Preview Pill */}
        <div className="mt-12 p-3 max-w-md mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">Active Threat Engine</span>
          </div>
          <span className="font-mono text-sky-400">Gemini 1.5 + Supabase</span>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-powered protection for your digital world
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Engineered with zero-trust architecture, deep heuristic analysis, and calibrated AI risk modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${feat.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Step-by-Step Security</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              How TrustGuard AI Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              From raw suspicious input to an actionable, calibrated defense report in under 2 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
                <span className="font-mono text-xl font-black text-sky-500/40 mb-2 block">{st.step}</span>
                <h4 className="text-sm font-bold text-white mb-1">{st.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Architecture & Privacy Guarantee */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Privacy Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your security data belongs to you. Period.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              TrustGuard AI follows the principle of least privilege. All database records are strictly isolated with PostgreSQL Row Level Security (RLS) policies.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Backend-Only AI Execution:</strong> Your Gemini API key never touches the browser, preventing credential scraping.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Strict RLS & Authorization:</strong> Every database query validates <code className="text-sky-400 bg-slate-950 px-1 py-0.5 rounded">scan.user_id === authenticatedUser.id</code>.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">Anti-Prompt Injection Defense:</strong> System prompts enforce strict data isolation so malicious inputs cannot manipulate AI verdicts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl font-mono text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-500">
              <span>SECURITY_AUDIT_LOG</span>
              <span className="text-emerald-400">ENFORCED</span>
            </div>
            <p className="text-sky-400">// Cryptographic Isolation Guarantee</p>
            <p className="text-slate-400">SELECT * FROM scans WHERE user_id = auth.uid();</p>
            <p className="text-emerald-400">✓ bcrypt hash iterations: 10</p>
            <p className="text-emerald-400">✓ JWT signed with HS256 secret</p>
            <p className="text-emerald-400">✓ Rate limiting: 30 analysis req / min</p>
            <p className="text-emerald-400">✓ Sensitive PII auto-redaction supported</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-sky-950/60 to-slate-900 border border-sky-500/30 shadow-2xl space-y-5">
          <h2 className="text-3xl font-extrabold text-white">
            Start Protecting Yourself Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience the cybersecurity platform that explains the danger, safeguards your personal data, and keeps you one step ahead of digital threats.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 transition"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
