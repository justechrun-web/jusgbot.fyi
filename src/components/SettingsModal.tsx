import React, { useState } from 'react';
import { Key, ShieldCheck, Check, Sparkles, AlertCircle, X, ExternalLink, Cpu, RefreshCw } from 'lucide-react';
import { BRAIN_MODEL } from '../agentsData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  onSaveApiKey: (key: string) => void;
  serverStatus: {
    nvidiaKey: boolean;
    geminiKey: boolean;
  };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  customApiKey,
  onSaveApiKey,
  serverStatus,
}) => {
  const [keyInput, setKeyInput] = useState(customApiKey);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setTestResult({ success: true, message: 'Settings saved successfully.' });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid NVIDIA API Key to test.' });
      return;
    }

    setTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/health', {
        headers: { 'x-nvidia-api-key': keyInput.trim() },
      });
      const data = await res.json();

      const workingCount = (data.results || []).filter((r: any) => r.ok).length;
      if (workingCount > 0) {
        setTestResult({
          success: true,
          message: `NVIDIA NIM key verified! ${workingCount} endpoints responding successfully.`,
        });
      } else {
        setTestResult({
          success: false,
          message: 'Key returned 0 successful pings. Please verify permissions on build.nvidia.com.',
        });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Key test failed: ${err.message}` });
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#00e5ff] w-full max-w-lg rounded-none p-7 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#131b2e] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.2)]">
              <Key className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base uppercase tracking-tight font-sans">
                Model Provider & API Settings
              </h3>
              <p className="text-xs text-slate-400 font-sans font-normal">
                Manage inference credentials & circuit breaker options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-none hover:bg-[#131b2e] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Server status indicators */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-3.5 bg-[#131b2e] border border-[#1e293b] rounded-none">
            <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-widest">
              Server Key
            </div>
            <div className="text-xs font-extrabold text-white mt-1 flex items-center gap-1.5 uppercase tracking-wider">
              {serverStatus.nvidiaKey ? (
                <span className="text-[#10e070] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10e070]" /> Configured
                </span>
              ) : (
                <span className="text-[#ff6b4a] font-mono text-[11px]">Direct Fallback Active</span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-[#131b2e] border border-[#1e293b] rounded-none">
            <div className="text-[10px] text-slate-400 font-extrabold uppercase font-mono tracking-widest">
              Gemini Redundancy
            </div>
            <div className="text-xs font-extrabold text-[#00e5ff] mt-1 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> Active & Guarded
            </div>
          </div>
        </div>

        {/* Key input */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1">
              Custom API Key <span className="text-slate-400 font-mono font-normal">(nvapi-...)</span>
            </label>
            <a
              href="https://build.nvidia.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#00e5ff] hover:underline flex items-center gap-1 font-extrabold uppercase tracking-wider"
            >
              Get Free Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="nvapi-..."
            className="w-full px-4 py-3 rounded-none bg-[#131b2e] border border-[#1e293b] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] font-mono"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-normal">
            Obtain free inference credits on NVIDIA's developer catalog. If left blank, JusGBot automatically utilizes Google Gemini as the resilient orchestrator backend.
          </p>
        </div>

        {/* Test Result Notice */}
        {testResult && (
          <div
            className={`p-3.5 rounded-none text-xs flex items-start gap-3 border shadow-sm ${
              testResult.success
                ? 'bg-[#10e070]/10 border-[#10e070]/30 text-[#10e070]'
                : 'bg-[#ff6b4a]/10 border-[#ff6b4a]/30 text-[#ff6b4a]'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-[#10e070] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#ff6b4a] shrink-0 mt-0.5" />
            )}
            <div className="font-sans font-medium leading-relaxed">{testResult.message}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
          <button
            onClick={handleTestKey}
            disabled={testingKey || !keyInput.trim()}
            className="px-4 py-2.5 rounded-none bg-[#131b2e] hover:bg-[#1e293b] disabled:opacity-40 text-slate-200 text-xs font-extrabold uppercase tracking-wider border border-[#1e293b] hover:border-[#00e5ff] transition flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingKey ? 'animate-spin text-[#00e5ff]' : 'text-[#00e5ff]'}`} />
            {testingKey ? 'Testing Key...' : 'Validate Key'}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-none text-xs text-slate-400 hover:text-white font-extrabold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-none bg-[#00e5ff] hover:bg-[#33ebff] text-[#0a0e17] text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
            >
              <Check className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
