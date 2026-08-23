import React from 'react';
import { Cpu, Activity, LayoutGrid, Settings, Plus, Sparkles, Network } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'catalog' | 'health' | 'pipeline';
  setActiveTab: (tab: 'chat' | 'catalog' | 'health' | 'pipeline') => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  serverStatus: {
    nvidiaKey: boolean;
    geminiKey: boolean;
    agentsCount: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewChat,
  onOpenSettings,
  serverStatus,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f1523]/95 backdrop-blur-md text-white border-b-2 border-[#00e5ff] shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Geometric Diamond Icon */}
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 bg-[#00e5ff] rounded-none rotate-45 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)] border border-cyan-200">
            <span className="text-[#0a0e17] font-black text-sm -rotate-45">J</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2 uppercase font-sans">
              JUSGBOT <span className="text-[#d946ef] font-bold text-xs tracking-wider normal-case italic">Ops Grid</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-medium hidden sm:block">
              16 Cognitive Nodes // Llama 3.1 & Gemini Redundancy
            </p>
          </div>
        </div>

        {/* Center Tabs with Geometric Styling */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#0a0e17] p-1 border border-[#1e293b] rounded-none">
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'chat'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Orchestrator
          </button>

          <button
            id="tab-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'catalog'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            16 Specialists
          </button>

          <button
            id="tab-health"
            onClick={() => setActiveTab('health')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'health'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Health Matrix
          </button>

          <button
            id="tab-pipeline"
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'pipeline'
                ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Pipeline Flow
          </button>
        </nav>

        {/* Right Status Badges & Controls */}
        <div className="flex items-center space-x-3.5">
          <div className="hidden sm:flex space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5 bg-[#0a0e17] px-2.5 py-1 border border-[#10e070]/30 rounded-none shadow-[0_0_8px_rgba(16,224,112,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#10e070] shadow-[0_0_6px_#10e070] animate-pulse"></span>
              <span className="text-[#10e070] font-bold text-[11px] tracking-wider">GATEWAY: 200 OK</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-[#0a0e17] px-2.5 py-1 border border-[#1e293b] rounded-none">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span>
              <span className="text-slate-300 font-bold text-[11px] tracking-wider">MODELS: 16/16</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-new-chat"
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider bg-[#131b2e] hover:bg-[#1e293b] hover:border-[#00e5ff] text-slate-100 border border-[#1e293b] rounded-none transition shadow-sm"
              title="Start a new conversation"
            >
              <Plus className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span className="hidden sm:inline">New Session</span>
            </button>

            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-2 text-slate-300 hover:text-[#00e5ff] hover:bg-[#131b2e] border border-[#1e293b] hover:border-[#00e5ff] rounded-none transition shadow-sm"
              title="Configure API Keys & Parameters"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex lg:hidden px-4 py-2 bg-[#0a0e17] border-t border-[#1e293b] gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-none transition ${
            activeTab === 'chat' ? 'bg-[#00e5ff] text-[#0a0e17]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-none transition ${
            activeTab === 'catalog' ? 'bg-[#00e5ff] text-[#0a0e17]' : 'text-slate-400 hover:text-white'
          }`}
        >
          16 Agents
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-none transition ${
            activeTab === 'health' ? 'bg-[#00e5ff] text-[#0a0e17]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Health
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-extrabold uppercase tracking-wider rounded-none transition ${
            activeTab === 'pipeline' ? 'bg-[#00e5ff] text-[#0a0e17]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pipeline
        </button>
      </div>
    </header>
  );
};
