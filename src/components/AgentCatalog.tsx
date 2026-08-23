import React, { useState } from 'react';
import { AGENTS, BRAIN_MODEL } from '../agentsData';
import { AgentConfig } from '../types';
import { AgentIcon } from './AgentIcon';
import { Search, Play, Check, Copy, Sparkles, Terminal, ArrowRight, Loader2, Bot, Layers } from 'lucide-react';

interface AgentCatalogProps {
  onSelectForChat: (agentId: string, prompt?: string) => void;
  customApiKey?: string;
}

export const AgentCatalog: React.FC<AgentCatalogProps> = ({ onSelectForChat, customApiKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTestAgent, setActiveTestAgent] = useState<AgentConfig | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Creation', 'Technical', 'Analysis', 'Strategy', 'Support'];

  const filteredAgents = AGENTS.filter((agent) => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyModel = (model: string, id: string) => {
    navigator.clipboard.writeText(model);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunSingleTest = async () => {
    if (!activeTestAgent || !testInput.trim()) return;
    setIsTesting(true);
    setTestOutput(null);

    try {
      const res = await fetch('/api/test-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeTestAgent.id,
          message: testInput,
          customApiKey,
        }),
      });

      const data = await res.json();
      setTestOutput(data.output || data.error || 'No output received');
    } catch (err: any) {
      setTestOutput(`Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-[#0f1523] p-7 rounded-none border border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-none text-[10px] font-extrabold uppercase font-mono bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 tracking-wider">
              16 COGNITIVE NODES
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-extrabold">
              BRAIN: {BRAIN_MODEL}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans">
            SPECIALIST AGENT ROSTER
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed font-sans font-normal">
            Every user dispatch is evaluated by the routing brain and distributed concurrently to these 16 tailored model nodes with latency tracking and fallback synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#00e5ff] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent, model, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-none bg-[#131b2e] border border-[#1e293b] text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-none text-xs font-extrabold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'bg-[#0f1523] text-slate-300 hover:text-white hover:bg-[#131b2e] border border-[#1e293b]'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto font-mono uppercase tracking-widest text-[10px] font-extrabold hidden sm:inline">
          SHOWING {filteredAgents.length} OF {AGENTS.length} NODES
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            id={`agent-card-${agent.id}`}
            className="group rounded-none bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#1e293b] hover:border-l-[#00e5ff] p-6 transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-[#131b2e] border border-[#1e293b] flex items-center justify-center text-[#00e5ff] group-hover:border-[#00e5ff]/50 transition-colors shadow-sm">
                    <AgentIcon name={agent.name} className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base uppercase tracking-tight leading-tight group-hover:text-[#00e5ff] transition-colors">
                      {agent.name}
                    </h3>
                    <span className="text-[10px] font-extrabold text-[#d946ef] uppercase tracking-widest font-mono">
                      {agent.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyModel(agent.model, agent.id)}
                  className="p-1.5 rounded-none bg-[#131b2e] hover:bg-[#1e293b] border border-[#1e293b] text-slate-400 hover:text-white transition shadow-sm"
                  title="Copy Model String"
                >
                  {copiedId === agent.id ? (
                    <Check className="w-3.5 h-3.5 text-[#10e070]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans font-normal">
                {agent.desc}
              </p>

              {/* Model Tag */}
              <div className="mb-4 p-2.5 bg-[#131b2e] border border-[#1e293b] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00e5ff] truncate max-w-[200px]" title={agent.model}>
                    {agent.model}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-none bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 font-mono font-extrabold uppercase tracking-wider">
                    NIM
                  </span>
                </div>
                {agent.envKey && (
                  <div className="text-[10px] font-mono text-[#d946ef] flex items-center justify-between border-t border-[#1e293b]/60 pt-1">
                    <span className="text-slate-400 font-extrabold uppercase text-[9px]">KEY:</span>
                    <span className="truncate max-w-[200px]" title={agent.envKey}>{agent.envKey}</span>
                  </div>
                )}
              </div>

              {/* System prompt summary */}
              <div className="p-3 bg-[#131b2e] border border-[#1e293b] mb-5">
                <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                  SYSTEM PROMPT DIRECTIVE:
                </div>
                <p className="text-[11px] text-slate-300 italic line-clamp-2">
                  "{agent.prompt}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-[#1e293b]">
              <button
                onClick={() => {
                  setActiveTestAgent(agent);
                  setTestInput(agent.samplePrompt);
                  setTestOutput(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-none text-xs font-extrabold uppercase tracking-wider bg-[#131b2e] hover:bg-[#1e293b] text-slate-200 border border-[#1e293b] hover:border-[#00e5ff] transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-[#00e5ff]" />
                Quick Probe
              </button>

              <button
                onClick={() => onSelectForChat(agent.id, agent.samplePrompt)}
                className="py-2.5 px-4 rounded-none text-xs font-extrabold uppercase tracking-wider bg-[#00e5ff] hover:bg-[#33ebff] text-[#0a0e17] transition flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                title="Launch in Chat Orchestrator"
              >
                Dispatch
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Test Modal / Drawer */}
      {activeTestAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1523] border-2 border-[#00e5ff] w-full max-w-2xl rounded-none p-7 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none bg-[#131b2e] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                  <AgentIcon name={activeTestAgent.name} className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg uppercase tracking-tight font-sans">
                    PROBE NODE: {activeTestAgent.name}
                  </h3>
                  <p className="text-xs font-mono text-[#00e5ff]">{activeTestAgent.model}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTestAgent(null)}
                className="p-1.5 text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2 font-mono">
                  DIRECT PROBE PROMPT
                </label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-none bg-[#131b2e] border border-[#1e293b] text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]"
                  placeholder="Enter a test prompt for this specialist..."
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTestInput(activeTestAgent.samplePrompt)}
                  className="text-xs text-[#d946ef] hover:underline flex items-center gap-1 font-extrabold uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample Prompt
                </button>

                <button
                  onClick={handleRunSingleTest}
                  disabled={isTesting || !testInput.trim()}
                  className="px-5 py-2.5 rounded-none bg-[#00e5ff] hover:bg-[#33ebff] disabled:opacity-40 text-[#0a0e17] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                >
                  {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  {isTesting ? 'Running Inference...' : 'Execute Model Probe'}
                </button>
              </div>

              {testOutput && (
                <div className="mt-4 p-4 rounded-none bg-[#0a0e17] border border-[#1e293b] max-h-60 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-[#1e293b] pb-1 uppercase tracking-widest font-extrabold">
                    <span className="text-[#00e5ff]">Response Output</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(testOutput)}
                      className="text-[#d946ef] hover:underline"
                    >
                      Copy Output
                    </button>
                  </div>
                  {testOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
