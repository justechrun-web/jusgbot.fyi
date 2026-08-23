import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentResult } from '../types';
import { AGENTS, BRAIN_MODEL } from '../agentsData';
import { MessageItem } from './MessageItem';
import { AgentIcon } from './AgentIcon';
import {
  Send,
  Sparkles,
  Bot,
  Layers,
  Trash2,
  Download,
  Loader2,
  Cpu,
  ChevronDown,
  Compass,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, directAgentId?: string) => Promise<void>;
  isLoading: boolean;
  activeAgentsThinking?: string[];
  directAgentId?: string;
  setDirectAgentId: (id: string | undefined) => void;
  onClearChat: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeAgentsThinking = [],
  directAgentId,
  setDirectAgentId,
  onClearChat,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeAgentsThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSendMessage(text, directAgentId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const samplePrompts = [
    {
      label: 'TypeScript worker with jitter',
      text: 'Write a TypeScript resilient retry function with exponential backoff and randomized jitter for HTTP API calls.',
      icon: 'Coder',
    },
    {
      label: 'SaaS churn & ARR projection',
      text: 'Our SaaS has $150k ARR, 4.5% monthly churn, and $18k in new monthly MRR. Calculate and project our 12-month ARR trajectory.',
      icon: 'Data Analyst',
    },
    {
      label: '4-Week Microservices Migration',
      text: 'Create a realistic 4-week sprint plan to decompose a monolithic Express app into Docker microservices with zero downtime.',
      icon: 'Project Planner',
    },
    {
      label: 'AI Startup Name & Taglines',
      text: 'Brainstorm 6 modern, memorable brand names and taglines for an intelligent multi-agent collaborative workspace.',
      icon: 'Creative Brainstormer',
    },
  ];

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const exportData = {
      exportedAt: new Date().toISOString(),
      app: 'JusGBot Multi-Agent Orchestrator',
      totalMessages: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        agentsUsed: m.agentsUsed || [],
        routingDecision: m.routingDecision,
        agentResults: m.agentResults,
        latencyMs: m.latencyMs,
        provider: m.provider,
      })),
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jusgbot-chat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedAgent = AGENTS.find((a) => a.id === directAgentId);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto w-full bg-[#0a0e17]">
      {/* Top Controller Bar */}
      <div className="px-5 py-3 bg-[#0f1523] border-b border-[#1e293b] flex items-center justify-between gap-3 text-xs shadow-md">
        {/* Direct mode or Auto Brain */}
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px] hidden sm:inline font-mono">
            DISPATCH ROUTE:
          </span>
          <div className="relative">
            <select
              value={directAgentId || 'auto'}
              onChange={(e) => setDirectAgentId(e.target.value === 'auto' ? undefined : e.target.value)}
              className="bg-[#131b2e] text-slate-100 border border-[#1e293b] rounded-none px-3.5 py-1.5 pr-8 text-xs font-mono font-bold focus:outline-none focus:border-[#00e5ff] appearance-none cursor-pointer tracking-wider"
            >
              <option value="auto">CORE.BRAIN ({BRAIN_MODEL} routing)</option>
              <optgroup label="Direct Node Specialists">
                {AGENTS.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    NODE: {agent.name} ({agent.model})
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#00e5ff] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                id="export-chat-button"
                onClick={handleExportChat}
                className="px-3 py-1.5 rounded-none bg-[#131b2e] hover:bg-[#1e293b] text-slate-200 hover:text-[#00e5ff] border border-[#1e293b] hover:border-[#00e5ff] text-[11px] font-extrabold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
                title="Export conversation history to JSON"
              >
                <Download className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Export Chat</span>
              </button>

              <button
                id="clear-chat-button"
                onClick={onClearChat}
                className="p-2 rounded-none bg-[#131b2e] hover:bg-[#ff6b4a]/20 text-slate-400 hover:text-[#ff6b4a] border border-[#1e293b] hover:border-[#ff6b4a]/50 transition shadow-sm"
                title="Reset session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b] p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-8 my-auto">
            {/* Geometric Diamond Emblem */}
            <div className="w-16 h-16 bg-[#00e5ff] rounded-none rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] my-2 border border-cyan-200">
              <span className="text-[#0a0e17] font-black text-3xl -rotate-45">J</span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-[#00e5ff] font-black uppercase tracking-widest font-mono">
                Cognitive Pipeline Online // 16 Specialists
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase font-sans">
                JusGBot Multi-Agent Orchestrator
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
                Powered by a central Llama 3.1 routing brain classifying intent and dynamically dispatching across 16 specialized model nodes with multi-agent synthesis.
              </p>
            </div>

            {/* Starter Prompt Cards */}
            <div className="w-full space-y-3 pt-2">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest text-left font-mono">
                VERIFIED PROMPT SCENARIOS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(p.text);
                      if (textareaRef.current) textareaRef.current.focus();
                    }}
                    className="p-4 bg-[#0f1523] border border-[#1e293b] border-l-4 border-l-[#00e5ff] hover:border-[#00e5ff] text-xs text-slate-200 transition-all rounded-none shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5 text-[#00e5ff] font-extrabold uppercase tracking-wider text-[11px]">
                        <AgentIcon name={p.icon} className="w-3.5 h-3.5" />
                        {p.label}
                      </span>
                      <span className="text-[9px] bg-[#131b2e] text-[#d946ef] border border-[#1e293b] px-1.5 py-0.5 font-mono uppercase font-extrabold tracking-wider">
                        Scenario
                      </span>
                    </div>
                    <p className="text-slate-300 line-clamp-2 text-xs leading-relaxed font-sans font-normal">
                      {p.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => <MessageItem key={m.id} message={m} />)
        )}

        {/* Live Loading / Thinking State */}
        {isLoading && (
          <div className="py-6 px-7 bg-[#0f1523] text-white border border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.15)] rounded-none">
            <div className="max-w-4xl mx-auto flex items-start gap-4">
              <div className="w-9 h-9 rounded-none bg-[#00e5ff] text-[#0a0e17] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>

              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-[#00e5ff] flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Cognitive Dispatch Active
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    // Routing & dispatching specialists...
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] px-2.5 py-1 rounded-none bg-[#131b2e] text-[#00e5ff] border border-[#1e293b] font-mono font-bold uppercase tracking-wider">
                    BRAIN: {BRAIN_MODEL}
                  </span>
                  {activeAgentsThinking.map((name, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-none bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 font-mono font-extrabold uppercase flex items-center gap-1.5 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.25)]"
                    >
                      <AgentIcon name={name} className="w-3 h-3" />
                      {name} (inferring...)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 sm:p-5 bg-[#0f1523] border-t border-[#1e293b] shadow-lg">
        <form onSubmit={handleSubmit} className="relative">
          {/* Active direct indicator badge if single agent chosen */}
          {selectedAgent && (
            <div className="mb-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 text-xs font-mono font-bold uppercase tracking-wider">
              <AgentIcon name={selectedAgent.name} className="w-3.5 h-3.5 text-[#00e5ff]" />
              TARGET: {selectedAgent.name} ({selectedAgent.model})
              <button
                type="button"
                onClick={() => setDirectAgentId(undefined)}
                className="ml-1 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <div className="relative rounded-none bg-[#131b2e] border border-[#1e293b] focus-within:border-[#00e5ff] focus-within:ring-1 focus-within:ring-[#00e5ff] transition shadow-inner">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedAgent
                  ? `Enter query for ${selectedAgent.name}...`
                  : 'Enter request — JusGBot will classify intent and orchestrate specialist nodes...'
              }
              rows={1}
              className="w-full py-4 pl-5 pr-16 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-44 font-sans leading-relaxed"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-3 rounded-none bg-[#00e5ff] hover:bg-[#33ebff] disabled:opacity-30 text-[#0a0e17] transition shadow-[0_0_12px_rgba(0,229,255,0.3)] font-black"
              title="Dispatch message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono px-1">
            <span>Press Enter to dispatch, Shift+Enter for newline</span>
            <span className="text-[#d946ef] font-bold">16 ACTIVE NIM NODES + GEMINI REDUNDANCY</span>
          </div>
        </form>
      </div>
    </div>
  );
};
