import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  EyeOff, 
  Calendar, 
  FileText,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { scanService } from '../services/api.js';
import TopHeader from '../components/TopHeader.jsx';
import RiskGauge from '../components/RiskGauge.jsx';
import ThreatCard from '../components/ThreatCard.jsx';
import PrivacyCard from '../components/PrivacyCard.jsx';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [searchParams] = useSearchParams();
  const initialScanId = searchParams.get('scanId');

  useEffect(() => {
    loadScans();
  }, [filter]);

  const loadScans = async () => {
    try {
      setLoading(true);
      const res = await scanService.getScans({ filter, search: searchTerm });
      if (res.success && res.data) {
        setScans(res.data);
        if (initialScanId) {
          const match = res.data.find(s => s.id === initialScanId);
          if (match) setSelectedScan(match);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadScans();
  };

  const handleDelete = async (e, scanId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;

    setDeletingId(scanId);
    try {
      await scanService.deleteScan(scanId);
      setScans(prev => prev.filter(s => s.id !== scanId));
      if (selectedScan?.id === scanId) setSelectedScan(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete scan record.');
    } finally {
      setDeletingId(null);
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Scans' },
    { id: 'safe', label: 'Safe / Low' },
    { id: 'medium', label: 'Medium Risk' },
    { id: 'high', label: 'High Risk' }
  ];

  return (
    <div className="space-y-8 pb-16">
      <TopHeader
        title="Scan History & Reports"
        subtitle="Review past digital assessments, threat indicators, and privacy reports"
      />

      {/* Filter and Search Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                filter === f.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by summary or type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-200 placeholder-slate-600"
          />
        </form>
      </div>

      {/* Scans List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Scans Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || filter !== 'all'
              ? 'No scans match your current filter criteria.'
              : 'You have not submitted any scans yet. Run your first threat scan now.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => {
            const isHigh = scan.threat_level === 'HIGH' || scan.threat_level === 'CRITICAL';
            const isMed = scan.threat_level === 'MEDIUM';

            return (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className={`p-5 rounded-2xl bg-slate-900/60 border transition cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-sky-500/40 ${
                  selectedScan?.id === scan.id ? 'border-sky-500/80 bg-slate-900' : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="text-xl shrink-0 mt-0.5">
                    {isHigh ? '🔴' : isMed ? '🟠' : '🟢'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate max-w-md">
                        {scan.summary}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400">
                        {scan.input_type}
                      </span>
                      {scan.is_demo && (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {scan.input_content}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                      </span>
                      <span>Threats: {(scan.threats || []).length}</span>
                      <span>Privacy: {(scan.privacy_findings || []).length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-5 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <div className="font-mono text-base font-extrabold text-white">
                      {scan.risk_score}
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {scan.threat_level}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    disabled={deletingId === scan.id}
                    title="Delete Scan Record"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scan Detail Drawer / Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-slate-800 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-sky-400">
                  Scan Analysis Report
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedScan.summary}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Risk Gauge Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <RiskGauge
                  score={selectedScan.risk_score}
                  threatLevel={selectedScan.threat_level}
                  size={130}
                />
                <div className="space-y-2 flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Input Content ({selectedScan.input_type})</span>
                  <p className="text-xs text-slate-300 font-mono p-3 rounded-xl bg-slate-900/80 border border-slate-800 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {selectedScan.input_content}
                  </p>
                </div>
              </div>

              {/* Threats */}
              {selectedScan.threats && selectedScan.threats.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Threat Indicators Detected
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedScan.threats.map((t, idx) => (
                      <ThreatCard key={idx} threat={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Findings */}
              {selectedScan.privacy_findings && selectedScan.privacy_findings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Privacy Risks Detected
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedScan.privacy_findings.map((p, idx) => (
                      <PrivacyCard key={idx} finding={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Explanation */}
              {selectedScan.ai_explanation && selectedScan.ai_explanation.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Why This Is Risky
                  </h4>
                  <div className="space-y-2">
                    {selectedScan.ai_explanation.map((exp, i) => (
                      <div key={i} className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        • {exp}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
              <span className="text-[11px] text-slate-500 font-mono">
                Scan ID: {selectedScan.id}
              </span>
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
