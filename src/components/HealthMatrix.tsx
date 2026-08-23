import React, { useState, useEffect } from 'react';
import { HealthResponse, HealthCheckResult } from '../types';
import { AgentIcon } from './AgentIcon';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Key,
  ShieldCheck,
  Code2,
  Download,
  Info,
  Layers
} from 'lucide-react';

interface HealthMatrixProps {
  customApiKey?: string;
  onOpenSettings: () => void;
}

export const HealthMatrix: React.FC<HealthMatrixProps> = ({ customApiKey, onOpenSettings }) => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'issues'>('all');

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (customApiKey) {
        headers['x-nvidia-api-key'] = customApiKey;
      }

      const res = await fetch('/api/health', { headers });
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch /api/health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, [customApiKey]);

  const results = data?.results || [];
  const healthyCount = results.filter((r) => r.ok).length;
  const issuesCount = results.length - healthyCount;

  const filteredResults = results.filter((r) => {
    if (filter === 'healthy') return r.ok;
    if (filter === 'issues') return !r.ok;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-[#0f1523] p-7 rounded-none border border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-none text-[10px] font-mono font-extrabold uppercase bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 tracking-wider">
              ENDPOINT: GET /api/health
            </span>
            {data && (
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">
                PROBED: {new Date(data.checkedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans">
            NVIDIA NIM HEALTH & DIAGNOSTIC MATRIX
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed font-sans">
            Real-time ping probes across all 16 specialized model nodes and the routing brain to verify catalog availability, API credentials, and endpoint latency.
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setShowJson(!showJson)}
            className="px-4 py-2.5 rounded-none bg-[#131b2e] hover:bg-[#1e293b] text-slate-200 text-xs font-extrabold uppercase tracking-wider border border-[#1e293b] transition flex items-center gap-2 shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            {showJson ? 'Hide JSON' : 'Raw JSON'}
          </button>

          <button
            onClick={fetchHealth}
            disabled={loading}
            className="px-5 py-2.5 rounded-none bg-[#00e5ff] hover:bg-[#33ebff] disabled:opacity-50 text-[#0a0e17] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Probing Models...' : 'Run Diagnostics'}
          </button>
        </div>
      </div>

      {/* API Key Status Notice */}
      {data && !data.nvidiaKeyConfigured && (
        <div className="p-5 rounded-none bg-[#ff6b4a]/10 border-l-4 border-[#ff6b4a] border-y border-r border-[#ff6b4a]/30 text-white flex items-start justify-between gap-5 shadow-[0_0_15px_rgba(255,107,74,0.1)]">
          <div className="flex items-start gap-3.5">
            <Key className="w-5 h-5 text-[#ff6b4a] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#ff6b4a]">
                NVIDIA NIM API Key is not set in environment
              </p>
              <p className="text-slate-300 leading-relaxed font-sans">
                JusGBot is currently routing via server-side Google Gemini fallback, ensuring uninterrupted full conversational intelligence. To enable native direct NVIDIA NIM model inference, add your NVIDIA API key in settings.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-none bg-[#ff6b4a] hover:bg-[#ff856b] text-[#0a0e17] text-xs font-black uppercase tracking-wider shrink-0 transition shadow-sm"
          >
            Configure Key
          </button>
        </div>
      )}

      {/* Stats Summary Bar */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="p-5 rounded-none bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-slate-500 shadow-sm">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
              TOTAL ENDPOINTS
            </span>
            <div className="text-3xl font-black text-white mt-1.5 font-mono">{results.length}</div>
          </div>

          <div className="p-5 rounded-none bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#10e070] shadow-[0_0_12px_rgba(16,224,112,0.1)]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
              DIRECT NIM HEALTHY
            </span>
            <div className="text-3xl font-black text-[#10e070] mt-1.5 font-mono flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-[#10e070]" />
              {healthyCount}
            </div>
          </div>

          <div className="p-5 rounded-none bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#ff6b4a] shadow-[0_0_12px_rgba(255,107,74,0.1)]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
              FALLBACK / ATTENTION
            </span>
            <div className="text-3xl font-black text-[#ff6b4a] mt-1.5 font-mono flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-[#ff6b4a]" />
              {issuesCount}
            </div>
          </div>

          <div className="p-5 rounded-none bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#d946ef] shadow-[0_0_12px_rgba(217,70,239,0.1)]">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
              REDUNDANCY STATUS
            </span>
            <div className="text-xs font-black uppercase tracking-wider text-[#d946ef] mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d946ef]" />
              Gemini & Llama Guard
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#0f1523] p-1.5 rounded-none border border-[#1e293b] shadow-sm text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-none font-extrabold uppercase tracking-wider transition ${
              filter === 'all'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            All Models ({results.length})
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3.5 py-1.5 rounded-none font-extrabold uppercase tracking-wider transition ${
              filter === 'healthy'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            Healthy ({healthyCount})
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`px-3.5 py-1.5 rounded-none font-extrabold uppercase tracking-wider transition ${
              filter === 'issues'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            Fallback/Issues ({issuesCount})
          </button>
        </div>
      </div>

      {/* Raw JSON viewer */}
      {showJson && data && (
        <div className="p-5 rounded-none bg-[#0a0e17] border border-[#1e293b] font-mono text-xs text-[#00e5ff] overflow-x-auto max-h-96 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b] mb-3">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              RESPONSE PAYLOAD: /api/health
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
              className="text-[#d946ef] hover:underline text-[11px] font-extrabold uppercase tracking-wider"
            >
              Copy JSON
            </button>
          </div>
          <pre className="text-slate-200">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {/* Table / Cards with increased breathing room */}
      <div className="rounded-none border border-[#1e293b] bg-[#0f1523] overflow-hidden shadow-sm">
        <div className="divide-y divide-[#1e293b]">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="py-5 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-[#131b2e] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-none flex items-center justify-center border shadow-sm ${
                    item.ok
                      ? 'bg-[#10e070]/10 text-[#10e070] border-[#10e070]/40 shadow-[0_0_8px_rgba(16,224,112,0.2)]'
                      : 'bg-[#ff6b4a]/10 text-[#ff6b4a] border-[#ff6b4a]/40 shadow-[0_0_8px_rgba(255,107,74,0.2)]'
                  }`}
                >
                  <AgentIcon name={item.agent} className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-white text-base uppercase tracking-tight">
                      {item.agent}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-none bg-[#131b2e] text-[#00e5ff] font-mono font-bold uppercase border border-[#1e293b] tracking-wider">
                      NODE: {item.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-400">{item.model}</span>
                    {item.envKeyUsed && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#131b2e] text-[#d946ef] border border-[#1e293b] font-semibold tracking-wider">
                        KEY: {item.envKeyUsed}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 self-end sm:self-center">
                {item.latencyMs !== undefined && item.latencyMs > 0 && (
                  <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.latencyMs}ms
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3.5 py-1.5 rounded-none text-xs font-mono font-black uppercase flex items-center gap-2 border shadow-sm tracking-wider ${
                      item.ok
                        ? 'bg-[#10e070]/15 text-[#10e070] border-[#10e070]/50 shadow-[0_0_12px_rgba(16,224,112,0.25)]'
                        : 'bg-[#ff6b4a]/15 text-[#ff6b4a] border-[#ff6b4a]/50 shadow-[0_0_12px_rgba(255,107,74,0.25)]'
                    }`}
                  >
                    {item.ok ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#10e070]" />
                        200 OK
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-[#ff6b4a]" />
                        {item.status ? `HTTP ${item.status}` : 'FALLBACK ACTIVE'}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
