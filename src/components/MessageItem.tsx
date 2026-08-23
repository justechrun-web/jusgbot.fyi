import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Bot, User, Layers, Cpu, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';
import { AgentIcon } from './AgentIcon';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'synthesized' | string>('synthesized');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSpecialistResults = message.agentResults && message.agentResults.length > 0;
  const currentSpecialist = message.agentResults?.find((a) => a.id === activeView);

  return (
    <div
      id={`msg-${message.id}`}
      className={`py-6 px-5 sm:px-7 transition-all rounded-none ${
        isUser
          ? 'bg-[#111827] border-b border-[#1e293b] border-l-4 border-l-[#d946ef] shadow-sm'
          : 'bg-[#0f1523] border-b border-[#1e293b] border-l-4 border-l-[#00e5ff] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header line */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold shadow-sm ${
                isUser
                  ? 'bg-[#d946ef] text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                  : 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">
                {isUser ? 'USER DISPATCH' : 'JUSGBOT SYNTHESIS'}
              </span>

              {!isUser && message.agentsUsed && message.agentsUsed.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
                    NODES:
                  </span>
                  {message.agentsUsed.map((agentName, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-none bg-[#131b2e] text-[#00e5ff] border border-[#1e293b] flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
                    >
                      <AgentIcon name={agentName} className="w-2.5 h-2.5 text-[#00e5ff]" />
                      {agentName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-mono">
            {message.latencyMs !== undefined && (
              <span className="flex items-center gap-1 bg-[#131b2e] px-2 py-0.5 border border-[#1e293b] text-slate-300 font-bold">
                <Clock className="w-3 h-3 text-[#00e5ff]" />
                {message.latencyMs}ms
              </span>
            )}
            <button
              onClick={() =>
                handleCopy(
                  activeView === 'synthesized'
                    ? message.content
                    : currentSpecialist?.output || message.content
                )
              }
              className="p-1.5 rounded-none bg-[#131b2e] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e293b] transition shadow-sm"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10e070]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Routing Decision Banner if assistant */}
        {!isUser && message.routingDecision && message.routingDecision.reasoning && (
          <div className="mb-4 p-3.5 rounded-none bg-[#131b2e] border border-[#1e293b] border-l-2 border-l-[#00e5ff] text-xs text-slate-300 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] mt-1 shrink-0"></div>
            <div>
              <div className="text-[10px] font-extrabold text-[#00e5ff] uppercase tracking-widest font-mono">
                CORE.BRAIN CLASSIFICATION LOG
              </div>
              <p className="text-xs font-mono text-slate-300 mt-1 leading-relaxed">
                {message.routingDecision.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Multi-agent view switch tabs */}
        {!isUser && hasSpecialistResults && message.agentResults && message.agentResults.length > 1 && (
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-[#1e293b]">
            <button
              onClick={() => setActiveView('synthesized')}
              className={`px-3.5 py-1.5 rounded-none text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeView === 'synthesized'
                  ? 'bg-[#00e5ff] text-[#0a0e17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'bg-[#131b2e] text-slate-300 hover:bg-[#1e293b] border border-[#1e293b]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Unified Synthesis
            </button>

            {message.agentResults.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setActiveView(agent.id)}
                className={`px-3.5 py-1.5 rounded-none text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 font-mono ${
                  activeView === agent.id
                    ? 'bg-[#d946ef] text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                    : 'bg-[#0f1523] text-slate-300 hover:bg-[#131b2e] border border-[#1e293b]'
                }`}
              >
                <AgentIcon name={agent.name} className="w-3.5 h-3.5" />
                {agent.name}
                {agent.fallbackUsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a] shadow-[0_0_4px_#ff6b4a]" title="Fallback used" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content body */}
        <div className="text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-headings:font-extrabold prose-pre:bg-[#0a0e17] prose-pre:text-slate-100 prose-pre:border prose-pre:border-[#1e293b] prose-pre:rounded-none prose-code:text-[#00e5ff] prose-code:bg-[#131b2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:border prose-code:border-[#1e293b] prose-code:font-mono font-sans font-normal">
          {activeView === 'synthesized' || !currentSpecialist ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#131b2e] border border-[#1e293b] text-xs font-mono">
                <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  NODE MODEL:{' '}
                  <span className="text-[#00e5ff] font-mono font-bold">{currentSpecialist.model}</span>
                </span>
                {currentSpecialist.fallbackUsed && (
                  <span className="text-[10px] bg-[#ff6b4a]/15 text-[#ff6b4a] border border-[#ff6b4a]/40 px-2 py-0.5 font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-sm">
                    <AlertTriangle className="w-3 h-3" />
                    Fallback: {currentSpecialist.fallbackModel || 'Gemini'}
                  </span>
                )}
                {!currentSpecialist.fallbackUsed && (
                  <span className="text-[10px] bg-[#10e070]/15 text-[#10e070] border border-[#10e070]/40 px-2 py-0.5 font-extrabold uppercase flex items-center gap-1 tracking-wider shadow-[0_0_8px_rgba(16,224,112,0.15)]">
                    <ShieldCheck className="w-3 h-3" />
                    Direct NIM Execution
                  </span>
                )}
              </div>
              <ReactMarkdown>{currentSpecialist.output}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
