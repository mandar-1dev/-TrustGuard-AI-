import React from 'react';
import { Phone, Mail, MapPin, CreditCard, Key, Lock, User, FileText, ShieldAlert } from 'lucide-react';

const TYPE_CONFIG = {
  phone: { label: 'Phone Number', icon: Phone, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  email: { label: 'Email Address', icon: Mail, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
  address: { label: 'Physical Address', icon: MapPin, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
  financial: { label: 'Financial Info (Card/Bank)', icon: CreditCard, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  government_id: { label: 'Government ID / SSN', icon: FileText, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  api_key: { label: 'Secret API Key', icon: Key, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  password: { label: 'Plaintext Password', icon: Lock, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  personal_name: { label: 'Full Personal Name', icon: User, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  other: { label: 'Sensitive Data', icon: ShieldAlert, color: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' }
};

export default function PrivacyCard({ finding }) {
  const typeKey = (finding.type || finding.data_type || 'other').toLowerCase();
  const conf = TYPE_CONFIG[typeKey] || TYPE_CONFIG.other;
  const Icon = conf.icon;
  const severity = finding.severity?.toUpperCase() || 'MEDIUM';

  return (
    <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
      <div className={`p-2 rounded-lg ${conf.bg} border ${conf.border} shrink-0`}>
        <Icon className={`w-4 h-4 ${conf.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            {conf.label}
          </span>
          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
            severity === 'HIGH' || severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {severity}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400 truncate">
          {finding.description}
        </p>
      </div>
    </div>
  );
}
