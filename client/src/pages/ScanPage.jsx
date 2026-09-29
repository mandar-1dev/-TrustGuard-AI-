import React, { useState } from 'react';
import { 
  ScanSearch, 
  MessageSquare, 
  Mail, 
  Link as LinkIcon, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  EyeOff, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  Info,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { scanService, privacyService } from '../services/api.js';
import TopHeader from '../components/TopHeader.jsx';
import RiskGauge from '../components/RiskGauge.jsx';
import ThreatCard from '../components/ThreatCard.jsx';
import PrivacyCard from '../components/PrivacyCard.jsx';
import RedactionComparison from '../components/RedactionComparison.jsx';

export default function ScanPage() {
  const [inputType, setInputType] = useState('message');
  const [content, setContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  // Redaction state
  const [redactionData, setRedactionData] = useState(null);
  const [isRedacting, setIsRedacting] = useState(false);
  const [showRedactionModal, setShowRedactionModal] = useState(false);

  // Quick Preset Samples from Prompt #32
  const presets = [
    {
      title: 'Phishing KYC Alert (High Risk)',
      type: 'message',
      text: 'URGENT: Your bank account will be blocked today. Verify your KYC immediately using this link: https://chase-security-verify.net/login or account access will be terminated.'
    },
    {
      title: 'Safe Delivery Notice (Low Risk)',
      type: 'message',
      text: 'Your food delivery is arriving today between 7 PM and 8 PM. Track your courier in the official app.'
    },
    {
      title: 'Sensitive PII Exposure (Privacy Risk)',
      type: 'text',
      text: 'My name is Rahul Sharma. My phone number is 9876543210 and my email is rahul@example.com. My SSN is 123-45-6789.'
    }
  ];

  const handleApplyPreset = (p) => {
    setInputType(p.type);
    setContent(p.text);
    setError(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please paste or enter content to analyze.');
      return;
    }

    setError(null);
    setIsScanning(true);
    setScanResult(null);
    setRedactionData(null);
    setShowRedactionModal(false);

    // Multi-stage visual feedback for deep AI analysis
    setScanStage('Analyzing security indicators & phishing patterns...');
    const stageTimer = setTimeout(() => {
      setScanStage('Checking privacy risks & sensitive PII exposure...');
    }, 900);

    try {
      const response = await scanService.analyze({
        inputType,
        content: content.trim()
      });

      if (response.success && response.data) {
        setScanResult(response.data);
      } else {
        setError('Analysis returned unexpected response structure.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.error || 'Failed to complete threat analysis. Please try again.');
    } finally {
      clearTimeout(stageTimer);
      setIsScanning(false);
      setScanStage('');
    }
  };

  const handleProtectSensitive = async () => {
    if (!content) return;
    setIsRedacting(true);
    try {
      const res = await privacyService.redact({ content });
      if (res.success && res.data) {
        setRedactionData(res.data);
        setShowRedactionModal(true);
      }
    } catch (err) {
      console.error('Redaction failed:', err);
    } finally {
      setIsRedacting(false);
    }
  };

  const tabs = [
    { id: 'message', label: 'Message / SMS', icon: MessageSquare },
    { id: 'email', label: 'Email Content', icon: Mail },
    { id: 'url', label: 'URL / Link', icon: LinkIcon },
    { id: 'text', label: 'Raw Text', icon: FileText }
  ];

  return (
    <div className="space-y-8 pb-16">
      <TopHeader
        title="Analyze Digital Content"
        subtitle="AI threat detection, privacy risk assessment, and transparent risk explanations"
      />

      {/* Main Analysis Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {/* Preset Sample Quick Selectors */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Quick Test Cases:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-[11px] font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5"
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Type Tabs */}
        <div className="flex items-center space-x-2 pb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = inputType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInputType(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                  active
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleScan} className="space-y-4 mt-2">
          <div className="relative">
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a suspicious message, email, URL, or text here..."
              className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs sm:text-sm text-slate-200 placeholder-slate-600 transition font-mono resize-y leading-relaxed"
            />
            {content && (
              <button
                type="button"
                onClick={() => setContent('')}
                className="absolute top-3 right-3 text-xs text-slate-500 hover:text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-injection defense active. Analyzed content treated strictly as untrusted data.</span>
            </div>

            <button
              type="submit"
              disabled={isScanning || !content.trim()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-sky-600/30 transition disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scanning Animation State */}
        {isScanning && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-950/80 border border-sky-500/30 flex flex-col items-center justify-center space-y-3 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ScanSearch className="w-6 h-6 animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-white tracking-wide">
              {scanStage || 'Analyzing threat indicators...'}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Running calibrated security assessment & PII verification
            </p>
          </div>
        )}
      </div>

      {/* Redaction Feature Card (when triggered or findings present) */}
      {showRedactionModal && redactionData && (
        <RedactionComparison
          originalContent={content}
          redactedData={redactionData}
          onClose={() => setShowRedactionModal(false)}
        />
      )}

      {/* Scan Analysis Results Section */}
      {scanResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Score Gauge */}
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
              <RiskGauge
                score={scanResult.risk_score}
                threatLevel={scanResult.threat_level}
                size={170}
              />
            </div>

            {/* Assessment Summary & Actions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  Threat Assessment Summary
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400">
                  Input: {scanResult.input_type}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {scanResult.summary}
              </h3>

              {/* Action Buttons: Protect Sensitive Information button */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleProtectSensitive}
                  disabled={isRedacting}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>{isRedacting ? 'Protecting...' : 'Protect Sensitive Information'}</span>
                </button>
              </div>

              {/* AI Disclaimer */}
              <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>AI-generated security assessments may be imperfect. Verify important information through trusted official channels.</span>
              </p>
            </div>
          </div>

          {/* Threats & Privacy Findings Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threats Detected */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Threats Detected</span>
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                  {scanResult.threats?.length || 0} indicator(s)
                </span>
              </div>

              {scanResult.threats && scanResult.threats.length > 0 ? (
                <div className="space-y-3">
                  {scanResult.threats.map((threat, idx) => (
                    <ThreatCard key={idx} threat={threat} />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No high-risk security threats or phishing cues detected.
                </div>
              )}
            </div>

            {/* Privacy Findings */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-purple-400" />
                  <span>Privacy & PII Exposure</span>
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                  {scanResult.privacy_findings?.length || 0} item(s)
                </span>
              </div>

              {scanResult.privacy_findings && scanResult.privacy_findings.length > 0 ? (
                <div className="space-y-3">
                  {scanResult.privacy_findings.map((finding, idx) => (
                    <PrivacyCard key={idx} finding={finding} />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No sensitive personal information (PII) identified in this text.
                </div>
              )}
            </div>
          </div>

          {/* Why This Is Risky & Actionable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Why This Is Risky (AI Explanations) */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Why This Content Is Risky</span>
              </h4>

              <div className="space-y-2.5">
                {scanResult.ai_explanation && scanResult.ai_explanation.length > 0 ? (
                  scanResult.ai_explanation.map((reason, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-sky-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Standard communication patterns with minimal risk observable.</p>
                )}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended Actions</span>
              </h4>

              <div className="space-y-2.5">
                {scanResult.recommendations && scanResult.recommendations.length > 0 ? (
                  scanResult.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/70 border border-emerald-950/40">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {typeof rec === 'string' ? rec : rec.recommendation}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Practice standard operational cyber safety.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
