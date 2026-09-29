import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Eye, EyeOff, Sparkles, X } from 'lucide-react';

export default function RedactionComparison({
  originalContent,
  redactedData,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [highlightPii, setHighlightPii] = useState(true);

  const handleCopy = async () => {
    if (!redactedData?.redactedContent) return;
    try {
      await navigator.clipboard.writeText(redactedData.redactedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="rounded-2xl border border-sky-500/30 bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl transition-all animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Privacy Protection & PII Redaction</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-normal">
                {redactedData?.itemsRedactedCount || 0} sensitive item(s) masked
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Side-by-side comparison of original text and sanitized safe content.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition shadow-lg shadow-sky-600/20"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copied ? 'Copied Protected Content' : 'Copy Protected Content'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Side-by-side comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Original Content Column */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center space-x-1.5 text-rose-400">
              <Eye className="w-3.5 h-3.5" />
              <span>Original Content (Contains Sensitive PII)</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-950/50 text-slate-300 font-mono text-xs leading-relaxed min-h-[140px] max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text">
            {originalContent}
          </div>
        </div>

        {/* Protected Redacted Content Column */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Protected Content (Masked & Sanitized)</span>
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-emerald-300 font-mono text-xs leading-relaxed min-h-[140px] max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text">
            {redactedData?.redactedContent || 'No sensitive items detected to redact.'}
          </div>
        </div>
      </div>

      {/* Redacted Types Pill List */}
      {redactedData?.redactedTypes?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Protected types:</span>
          <div className="flex flex-wrap gap-1.5">
            {redactedData.redactedTypes.map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-400 border border-sky-800/50 text-[10px] font-mono uppercase"
              >
                [{type.toUpperCase()} REDACTED]
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
