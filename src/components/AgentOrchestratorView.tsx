import React, { useState } from 'react';
import { BRAIN_MODEL, AGENTS } from '../agentsData';
import { AgentIcon } from './AgentIcon';
import {
  Cpu,
  ArrowDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle,
  Network,
  RotateCw,
  GitBranch
} from 'lucide-react';

export const AgentOrchestratorView: React.FC = () => {
  const [simQuery, setSimQuery] = useState(
    'I want to build a real-time multiplayer coding interview app. Give me architecture and marketing ideas.'
  );
  const [simStep, setSimStep] = useState<number>(0);
  const [simActiveAgents, setSimActiveAgents] = useState<string[]>(['coder', 'project_planner', 'marketing_strategist']);

  const sampleSimQueries = [
    {
      label: 'Coding & Architecture',
      query: 'Write an asynchronous worker queue in TypeScript with exponential backoff.',
      agents: ['coder', 'tech_support']
    },
    {
      label: 'Business & Finance Plan',
      query: 'Given $100k ARR and 15% churn, how do I model runway and growth marketing?',
      agents: ['data_analyst', 'finance_explainer', 'marketing_strategist']
    },
    {
      label: 'Content & Translation',
      query: 'Draft a press release for our AI launch and translate into French and German.',
      agents: ['writer', 'editor', 'translator']
    }
  ];

  const handleRunSim = (query: string, agents: string[]) => {
    setSimQuery(query);
    setSimActiveAgents(agents);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 600);
    setTimeout(() => setSimStep(3), 1300);
    setTimeout(() => setSimStep(4), 2100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0f1523] p-7 rounded-none border border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="px-2.5 py-0.5 rounded-none text-[10px] font-extrabold uppercase font-mono bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 tracking-wider">
            COGNITIVE PIPELINE
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-extrabold">
            ARCHITECTURE SPECIFICATION
          </span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans">
          JUSGBOT MULTI-AGENT ORCHESTRATION FLOW
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl mt-1.5 leading-relaxed font-sans font-normal">
          Visualizing the cognitive flow from natural language ingestion, classification routing via Llama 3.3, parallel dispatch across 16 specialized model nodes, to final synthesis.
        </p>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="bg-[#0f1523] p-7 rounded-none border border-[#1e293b] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white font-mono">
            <Zap className="w-4 h-4 text-[#00e5ff]" />
            INTERACTIVE PIPELINE SIMULATOR
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sampleSimQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleRunSim(sample.query, sample.agents)}
                className="px-3.5 py-1.5 rounded-none text-xs font-extrabold uppercase tracking-wider bg-[#131b2e] hover:bg-[#1e293b] hover:border-[#d946ef] text-slate-200 border border-[#1e293b] transition shadow-sm"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5">
          <input
            type="text"
            value={simQuery}
            onChange={(e) => setSimQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-none bg-[#131b2e] border border-[#1e293b] text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]"
            placeholder="Type any prompt to trace pipeline routing..."
          />
          <button
            onClick={() => handleRunSim(simQuery, ['researcher', 'writer', 'coder'])}
            className="px-6 py-3 rounded-none bg-[#00e5ff] hover:bg-[#33ebff] text-[#0a0e17] text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <Play className="w-3.5 h-3.5" />
            Trace Flow
          </button>
        </div>
      </div>

      {/* Architecture Stages Diagram */}
      <div className="relative space-y-6">
        {/* Stage 1: Input Ingestion */}
        <div
          className={`p-7 rounded-none border transition-all shadow-sm ${
            simStep >= 1
              ? 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.1)]'
              : 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#1e293b]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#131b2e] border border-[#1e293b] flex items-center justify-center text-[#00e5ff] shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-[#00e5ff] uppercase tracking-widest">
                  STAGE 01
                </span>
                <h3 className="font-extrabold text-white text-base uppercase tracking-tight font-sans">
                  User Request Ingestion
                </h3>
                <p className="text-xs text-slate-300 font-sans font-normal mt-0.5">
                  Accepts natural language user query and normalizes intent constraints.
                </p>
              </div>
            </div>
            {simStep >= 1 && (
              <span className="px-3 py-1 rounded-none text-[10px] bg-[#10e070]/15 text-[#10e070] border border-[#10e070]/40 font-mono font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-[0_0_8px_rgba(16,224,112,0.15)]">
                <CheckCircle className="w-3.5 h-3.5" /> Received
              </span>
            )}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${simStep >= 2 ? 'text-[#00e5ff] animate-bounce drop-shadow-[0_0_8px_#00e5ff]' : 'text-slate-600'}`} />
        </div>

        {/* Stage 2: Routing Brain */}
        <div
          className={`p-7 rounded-none border transition-all shadow-sm ${
            simStep >= 2
              ? 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.1)]'
              : 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#1e293b]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#131b2e] border border-[#1e293b] flex items-center justify-center text-[#00e5ff] shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                  STAGE 02
                </span>
                <h3 className="font-extrabold text-white text-base uppercase tracking-tight flex items-center gap-2.5 flex-wrap font-sans">
                  Classification Routing Brain
                  <span className="text-[10px] px-2.5 py-0.5 rounded-none bg-[#131b2e] text-[#00e5ff] font-mono font-extrabold border border-[#1e293b]">
                    {BRAIN_MODEL}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-sans font-normal mt-0.5">
                  Evaluates query semantics against 16 agent descriptors and produces a JSON routing plan.
                </p>
              </div>
            </div>
            {simStep >= 2 && (
              <span className="px-3 py-1 rounded-none text-[10px] bg-[#10e070]/15 text-[#10e070] border border-[#10e070]/40 font-mono font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-[0_0_8px_rgba(16,224,112,0.15)]">
                <CheckCircle className="w-3.5 h-3.5" /> Routed to {simActiveAgents.length} Nodes
              </span>
            )}
          </div>

          {simStep >= 2 && (
            <div className="mt-4 p-3.5 bg-[#131b2e] border border-[#1e293b] text-xs font-mono text-slate-200 flex items-center gap-2.5 flex-wrap">
              <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                Target Dispatches:
              </span>
              {simActiveAgents.map((id) => (
                <span key={id} className="px-2.5 py-1 rounded-none bg-[#0f1523] border border-[#00e5ff]/40 text-[#00e5ff] font-extrabold uppercase tracking-wider">
                  {id}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${simStep >= 3 ? 'text-[#00e5ff] animate-bounce drop-shadow-[0_0_8px_#00e5ff]' : 'text-slate-600'}`} />
        </div>

        {/* Stage 3: Concurrent Dispatch */}
        <div
          className={`p-7 rounded-none border transition-all shadow-sm ${
            simStep >= 3
              ? 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.1)]'
              : 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#1e293b]'
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#131b2e] border border-[#1e293b] flex items-center justify-center text-[#d946ef] shadow-sm">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-[#d946ef] uppercase tracking-widest">
                  STAGE 03
                </span>
                <h3 className="font-extrabold text-white text-base uppercase tracking-tight font-sans">
                  Concurrent Specialist Dispatch & Circuit Breaker
                </h3>
                <p className="text-xs text-slate-300 font-sans font-normal mt-0.5">
                  Parallel execution with automatic fallback retry to Gemini if endpoint encounters catalog drift.
                </p>
              </div>
            </div>
            {simStep >= 3 && (
              <span className="px-3 py-1 rounded-none text-[10px] bg-[#10e070]/15 text-[#10e070] border border-[#10e070]/40 font-mono font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-[0_0_8px_rgba(16,224,112,0.15)]">
                <CheckCircle className="w-3.5 h-3.5" /> Parallel Complete
              </span>
            )}
          </div>

          {/* Grid of active agents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {simActiveAgents.map((id) => {
              const ag = AGENTS.find((a) => a.id === id) || AGENTS[0];
              return (
                <div
                  key={id}
                  className="p-4 bg-[#131b2e] border border-[#1e293b] flex items-center gap-3.5"
                >
                  <div className="w-9 h-9 rounded-none bg-[#0f1523] border border-[#1e293b] flex items-center justify-center text-[#00e5ff] shadow-sm">
                    <AgentIcon name={ag.name} className="w-4.5 h-4.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-extrabold text-white uppercase tracking-wider truncate">
                      {ag.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#00e5ff] truncate">{ag.model}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <ArrowDown className={`w-6 h-6 ${simStep >= 4 ? 'text-[#00e5ff] animate-bounce drop-shadow-[0_0_8px_#00e5ff]' : 'text-slate-600'}`} />
        </div>

        {/* Stage 4: Synthesis & Output */}
        <div
          className={`p-7 rounded-none border transition-all shadow-sm ${
            simStep >= 4
              ? 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.1)]'
              : 'bg-[#0f1523] border-[#1e293b] border-l-4 border-l-[#1e293b]'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#131b2e] border border-[#1e293b] flex items-center justify-center text-[#00e5ff] shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                  STAGE 04
                </span>
                <h3 className="font-extrabold text-white text-base uppercase tracking-tight font-sans">
                  Master Multi-Agent Synthesis Layer
                </h3>
                <p className="text-xs text-slate-300 font-sans font-normal mt-0.5">
                  Consolidates specialist outputs into one coherent, unified response without redundant agent meta-chatter.
                </p>
              </div>
            </div>
            {simStep >= 4 && (
              <span className="px-3 py-1 rounded-none text-[10px] bg-[#10e070]/15 text-[#10e070] border border-[#10e070]/40 font-mono font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-[0_0_8px_rgba(16,224,112,0.15)]">
                <CheckCircle className="w-3.5 h-3.5" /> Ready for User
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
