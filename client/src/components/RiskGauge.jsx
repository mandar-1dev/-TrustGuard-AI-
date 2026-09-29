import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldAlert as ShieldWarning, AlertTriangle } from 'lucide-react';

export default function RiskGauge({ score = 0, threatLevel = 'SAFE', size = 160 }) {
  // Score clamped between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine color scheme based on threat level / score
  let strokeColor = '#10b981'; // green / safe
  let bgColor = 'rgba(16, 185, 129, 0.15)';
  let textColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let Icon = ShieldCheck;

  if (normalizedScore >= 70 || threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
    strokeColor = '#f43f5e'; // red / danger
    bgColor = 'rgba(244, 63, 94, 0.15)';
    textColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = ShieldAlert;
  } else if (normalizedScore >= 35 || threatLevel === 'MEDIUM') {
    strokeColor = '#f59e0b'; // yellow/amber
    bgColor = 'rgba(245, 158, 11, 0.15)';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  }

  // Circular progress calculations
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc angle (270 degrees sweep for gauge effect)
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease'
            }}
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textColor} font-mono`}>
            {normalizedScore}
          </span>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
            Risk Score
          </span>
        </div>
      </div>

      {/* Threat Level Badge */}
      <div className="mt-3 flex items-center space-x-2">
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center space-x-1.5 ${badgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{threatLevel} RISK</span>
        </div>
      </div>
    </div>
  );
}
