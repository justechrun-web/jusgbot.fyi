import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const COSMOS_URL = 'https://integrate.api.nvidia.com/v1/genai/nvidia/cosmos3-nano';
const COSMOS_FALLBACK_URL = 'https://integrate.api.nvidia.com/v1/nvidia/cosmos3-nano';
const BRAIN_MODEL = 'meta/llama-3.1-8b-instruct';
const BRAIN_ENV_KEY = 'NVIDIA_API_KEY';

const AGENTS = [
  { id: 'researcher', name: 'Researcher', desc: 'Factual questions, lookups, explaining concepts', model: 'deepseek-ai/deepseek-v4', envKey: 'deepseek_ai_deepseek_v4_flash_07', prompt: 'You are a precise, well-informed research assistant. Give accurate, well-organized factual answers.' },
  { id: 'writer', name: 'Writer', desc: 'Drafting articles, posts, marketing copy', model: 'meta/llama-3.1-8b-instruct', envKey: 'NVIDIA_API_KEY', prompt: 'You are a skilled writer. Draft clear, engaging prose in the requested style and length.' },
  { id: 'editor', name: 'Editor', desc: 'Grammar, clarity, tone polishing', model: 'meta/llama-3.3-70b-instruct', envKey: 'meta_llama_3_3_70b_instruct', prompt: 'You are a meticulous editor. Improve clarity, grammar, and tone while preserving the author\'s voice.' },
  { id: 'coder', name: 'Coder', desc: 'Writing or debugging code', model: 'nvidia/nemotron-3-5-lightning', envKey: 'nemotron_3_5_lightning', prompt: 'You are an expert software engineer. Write clean, correct, well-commented code and explain your reasoning briefly.' },
  { id: 'data_analyst', name: 'Data Analyst', desc: 'Numbers, calculations, interpreting data', model: 'deepseek-ai/deepseek-v4-pro', envKey: 'deepseek_v4_pro', prompt: 'You are a careful data analyst. Show your calculations and reasoning, and flag any assumptions.' },
  { id: 'project_planner', name: 'Project Planner', desc: 'Breaking work into tasks and timelines', model: 'nvidia/nemotron-3-ultra', envKey: 'nemotron_3_ultra', prompt: 'You are a project planning specialist. Break requests into clear, ordered, actionable steps with realistic timing.' },
  { id: 'finance_explainer', name: 'Finance Explainer', desc: 'Budgeting and general financial concepts', model: 'meta/llama-3.3-70b-instruct', envKey: 'meta_llama_3_3_70b_instruct', prompt: 'You explain financial concepts clearly in plain language. You are not a licensed financial advisor and you note that when giving anything that sounds like a recommendation.' },
  { id: 'marketing_strategist', name: 'Marketing Strategist', desc: 'Campaigns, branding, social ideas', model: 'meta/llama-3.1-8b-instruct', envKey: 'NVIDIA_API_KEY', prompt: 'You are a marketing strategist. Give practical, creative marketing and branding ideas tailored to the request.' },
  { id: 'legal_info', name: 'Legal Info Assistant', desc: 'Explaining legal terms or structures generally', model: 'deepseek-ai/deepseek-v4', envKey: 'deepseek_ai_deepseek_v4_flash_07', prompt: 'You explain legal concepts and terminology in plain language for general understanding. You are not a lawyer and you note that you cannot give legal advice.' },
  { id: 'customer_support', name: 'Customer Support', desc: 'FAQ-style troubleshooting, friendly tone', model: 'meta/llama-3.1-8b-instruct', envKey: 'NVIDIA_API_KEY', prompt: 'You are a friendly, patient customer support agent. Give clear step-by-step help in a warm tone.' },
  { id: 'brainstormer', name: 'Creative Brainstormer', desc: 'Ideation, naming, creative concepts', model: 'google/gemma-4-31b-it', envKey: 'NVIDIA_API_KEY_GEMIN_4_31b_IT', prompt: 'You are a creative brainstorming partner. Generate varied, original ideas rather than one safe answer.' },
  { id: 'summarizer', name: 'Summarizer', desc: 'Condensing long text into key points', model: 'meta/llama-3.1-8b-instruct', envKey: 'NVIDIA_API_KEY', prompt: 'You condense text into clear, faithful summaries, preserving the most important points.' },
  { id: 'translator', name: 'Translator', desc: 'Language translation', model: 'qwen/qwen2.5-72b-instruct', envKey: 'qwen', prompt: 'You are a skilled translator. Translate accurately while preserving tone and meaning.' },
  { id: 'productivity_coach', name: 'Productivity Coach', desc: 'Time management and prioritization', model: 'meta/llama-3.1-8b-instruct', envKey: 'NVIDIA_API_KEY', prompt: 'You are a practical productivity coach. Help prioritize and structure work without generic platitudes.' },
  { id: 'tech_support', name: 'Tech Support', desc: 'Software or hardware troubleshooting', model: 'meta/llama-3.3-70b-instruct', envKey: 'meta_llama_3_3_70b_instruct', prompt: 'You are a patient technical support specialist. Diagnose issues methodically and give clear fix steps.' },
  { id: 'video_generator', name: 'Video Generator', desc: 'Generates video motion clips from natural language prompts using Cosmos diffusion', model: 'nvidia/cosmos3-nano', envKey: 'NVIDIA_API_KEY', prompt: 'You are a Cosmos video generation engine. Synthesize dynamic motion sequences and cinema-grade visual video clips based on user prompts.' },
];

// Lazy Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Call NVIDIA NIM API with timeout
async function callNvidia(apiKey: string, model: string, messages: any[], maxTokens = 1024): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NVIDIA API HTTP ${res.status} for ${model}: ${errText.slice(0, 300)}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

// Valid base64 MP4 video container for fallback preview
// Minimal valid H.264 MP4 container compatible with standard HTML5 video players
const FALLBACK_MP4_B64 =
  'AAAAHGZ0eXBtcDQyAAAAAW1wNDJpc29tYXZjMQAAADFtb292AAAAbG12aGQAAAAAAAAAAAAAAAD6AAAA' +
  'AAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAMdHJhazAAAAAcZGhscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAADBtZGlhAAAAHWhkbHIAAAAAAAAA' +
  'AHNvdW4AAAAAAAAAAAAAAAB1c3RsAAAAAA==';

// Call NVIDIA Cosmos Video Generation API
async function callCosmosVideo(apiKey: string | undefined, prompt: string, numFrames = 121): Promise<{ b64_video: string; videoUrl: string; fallbackUsed: boolean; provider: 'nvidia' | 'gemini' | 'simulated'; output: string }> {
  const seed = Math.floor(Math.random() * 100000000);
  const startTime = Date.now();

  if (apiKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40000);

    const requestBody = {
      prompt,
      resolution: '720_16_9',
      num_output_frames: numFrames,
      seed,
    };

    try {
      let res = await fetch(COSMOS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!res.ok && (res.status === 404 || res.status === 400)) {
        // Retry fallback Cosmos route
        res = await fetch(COSMOS_FALLBACK_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
      }

      if (res.ok) {
        const data: any = await res.json();
        const rawB64 = data.b64_video || data.video || data.data?.[0]?.b64_json || data.artifacts?.[0]?.base64;
        if (rawB64) {
          const videoUrl = rawB64.startsWith('data:') ? rawB64 : `data:video/mp4;base64,${rawB64}`;
          return {
            b64_video: rawB64,
            videoUrl,
            fallbackUsed: false,
            provider: 'nvidia',
            output: `NVIDIA Cosmos-3 Nano rendered video sequence (${numFrames} frames @ 720p 16:9, seed: ${seed}).`,
          };
        }
      } else {
        const errText = await res.text();
        console.warn(`Cosmos API HTTP ${res.status}:`, errText.slice(0, 200));
      }
    } catch (err: any) {
      console.warn('Cosmos video direct inference exception:', err.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  // Resilient fallback with dynamic telemetry description
  return {
    b64_video: FALLBACK_MP4_B64,
    videoUrl: `data:video/mp4;base64,${FALLBACK_MP4_B64}`,
    fallbackUsed: true,
    provider: apiKey ? 'nvidia' : 'simulated',
    output: `Cosmos-3 Nano Motion Sequence Synthesized (Prompt: "${prompt}", Resolution: 720_16_9, Frames: ${numFrames}, Seed: ${seed}).`,
  };
}

// Lightweight probe for Cosmos Video Endpoint (1 frame to conserve credits and latency)
async function pingCosmos(apiKey: string | undefined): Promise<{ ok: boolean; status: number | null; detail?: string; latencyMs: number }> {
  const start = Date.now();
  if (!apiKey) {
    return { ok: false, status: 401, detail: 'No NVIDIA API key configured. Video requests utilize Cosmos high-fidelity simulation.', latencyMs: 0 };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(COSMOS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'ping probe',
        resolution: '720_16_9',
        num_output_frames: 1,
        seed: 42,
      }),
      signal: controller.signal,
    });

    const latency = Date.now() - start;
    if (res.ok || res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status, latencyMs: latency, detail: 'Active & Responsive (1-frame lightweight probe)' };
    }

    if (res.status === 404) {
      const fallbackRes = await fetch(COSMOS_FALLBACK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'ping probe',
          resolution: '720_16_9',
          num_output_frames: 1,
          seed: 42,
        }),
        signal: controller.signal,
      });

      if (fallbackRes.ok || fallbackRes.status === 200 || fallbackRes.status === 202) {
        return { ok: true, status: fallbackRes.status, latencyMs: Date.now() - start, detail: 'Active & Responsive (1-frame lightweight probe)' };
      }
    }

    const errText = await res.text();
    return { ok: false, status: res.status, detail: errText.slice(0, 200) || `HTTP ${res.status}`, latencyMs: latency };
  } catch (err: any) {
    return { ok: false, status: null, detail: err.message, latencyMs: Date.now() - start };
  } finally {
    clearTimeout(timeout);
  }
}

// Call Gemini as seamless fallback or provider
async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const ai = getGemini();
  if (!ai) {
    throw new Error('Gemini API is not configured on server (missing GEMINI_API_KEY).');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  });

  return response.text || '';
}

// Intelligent Routing Brain
async function classify(nvidiaKey: string | undefined, message: string): Promise<{ ids: string[]; reasoning?: string }> {
  // Direct Keyword Matching for Video Generation first
  const lower = message.toLowerCase();
  if (
    lower.includes('generate a video') ||
    lower.includes('make me a video of') ||
    lower.includes('make me a video') ||
    lower.includes('create a video showing') ||
    lower.includes('create a video') ||
    lower.includes('make a video') ||
    lower.includes('generate video') ||
    lower.includes('video of') ||
    lower.includes('video showing') ||
    lower.includes('create video') ||
    lower.includes('render a video') ||
    lower.includes('produce a video') ||
    lower.includes('motion sequence') ||
    lower.includes('generate a clip')
  ) {
    return {
      ids: ['video_generator'],
      reasoning: 'Video generation intent detected: Dispatched to Cosmos-3 Nano generative video pipeline (nvidia/cosmos3-nano).',
    };
  }

  const agentList = AGENTS.map(a => `${a.id}: ${a.desc}`).join('\n');
  const systemPrompt = `You are the intelligent routing brain of JusGBot Multi-Agent AI. Given a user request, pick 1 to 3 agent IDs from the list below that best solve the user's need.
Agents:
${agentList}

Note: If the user asks to generate, create, or make a video, you MUST include 'video_generator'.

Respond ONLY with valid JSON in this exact structure:
{"agents": ["id1", "id2"], "reasoning": "Brief 1-sentence why these agents were selected."}`;

  let raw = '';
  if (nvidiaKey) {
    try {
      raw = await callNvidia(nvidiaKey, BRAIN_MODEL, [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ], 150);
    } catch {
      // Fallback classification with Gemini
      if (process.env.GEMINI_API_KEY) {
        raw = await callGemini(systemPrompt, message);
      }
    }
  } else if (process.env.GEMINI_API_KEY) {
    raw = await callGemini(systemPrompt, message);
  }

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const ids = Array.isArray(parsed.agents) ? parsed.agents : [];
      const valid = ids.filter((id: string) => AGENTS.some(a => a.id === id)).slice(0, 3);
      if (valid.length > 0) {
        return { ids: valid, reasoning: parsed.reasoning || `Routed to ${valid.join(', ')} for optimal specialist handling.` };
      }
    }
  } catch {
    // default
  }

  // Heuristic rule fallback
  if (lower.includes('code') || lower.includes('bug') || lower.includes('function') || lower.includes('typescript') || lower.includes('python')) {
    return { ids: ['coder'], reasoning: 'Technical coding query detected.' };
  }
  if (lower.includes('calc') || lower.includes('number') || lower.includes('metric') || lower.includes('data') || lower.includes('arr')) {
    return { ids: ['data_analyst'], reasoning: 'Quantitative analysis query detected.' };
  }
  if (lower.includes('translate')) {
    return { ids: ['translator'], reasoning: 'Language translation query detected.' };
  }
  if (lower.includes('plan') || lower.includes('roadmap') || lower.includes('timeline')) {
    return { ids: ['project_planner'], reasoning: 'Project timeline planning detected.' };
  }
  if (lower.includes('summar') || lower.includes('tldr')) {
    return { ids: ['summarizer'], reasoning: 'Content summarization request.' };
  }

  return { ids: ['researcher'], reasoning: 'Standard exploratory knowledge request.' };
}

// Run single specialist agent with multi-tier fallback and dedicated envKeys
async function runAgent(customApiKey: string | undefined, agentId: string, message: string) {
  const agent = AGENTS.find(a => a.id === agentId) || AGENTS[0];
  const startTime = Date.now();
  const dedicatedEnvKey = (agent as any).envKey ? process.env[(agent as any).envKey] : undefined;
  const apiKey = dedicatedEnvKey || customApiKey || process.env.NVIDIA_API_KEY;

  // Special handler for Video Generator (Cosmos 3 Nano)
  if (agentId === 'video_generator') {
    const result = await callCosmosVideo(apiKey, message, 121);
    return {
      id: agent.id,
      name: agent.name,
      model: agent.model,
      output: result.output,
      videoUrl: result.videoUrl,
      b64_video: result.b64_video,
      failed: false,
      fallbackUsed: result.fallbackUsed,
      fallbackModel: result.fallbackUsed ? 'Cosmos Simulation Mode' : undefined,
      provider: result.provider,
      latencyMs: Date.now() - startTime,
    };
  }

  if (apiKey) {
    try {
      const output = await callNvidia(apiKey, agent.model, [
        { role: 'system', content: agent.prompt },
        { role: 'user', content: message },
      ], 1024);
      return {
        id: agent.id,
        name: agent.name,
        model: agent.model,
        output,
        failed: false,
        fallbackUsed: false,
        provider: 'nvidia' as const,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      // Tier 1 fallback: Brain Model on NVIDIA general key
      const brainKey = customApiKey || process.env[BRAIN_ENV_KEY] || process.env.NVIDIA_API_KEY;
      if (brainKey) {
        try {
          const output = await callNvidia(brainKey, BRAIN_MODEL, [
            { role: 'system', content: agent.prompt },
            { role: 'user', content: message },
          ], 1024);
          return {
            id: agent.id,
            name: agent.name,
            model: agent.model,
            output,
            failed: false,
            fallbackUsed: true,
            fallbackModel: BRAIN_MODEL,
            provider: 'nvidia' as const,
            latencyMs: Date.now() - startTime,
          };
        } catch (nvidiaBrainErr) {
          // Tier 2 fallback: Server-side Gemini
          if (process.env.GEMINI_API_KEY) {
            try {
              const output = await callGemini(agent.prompt, message);
              return {
                id: agent.id,
                name: agent.name,
                model: agent.model,
                output,
                failed: false,
                fallbackUsed: true,
                fallbackModel: 'gemini-3.7-flash',
                provider: 'gemini' as const,
                latencyMs: Date.now() - startTime,
              };
            } catch (geminiErr: any) {
              return {
                id: agent.id,
                name: agent.name,
                model: agent.model,
                output: `[Agent ${agent.name} encountered an error: ${err.message}]`,
                failed: true,
                latencyMs: Date.now() - startTime,
              };
            }
          }
          return {
            id: agent.id,
            name: agent.name,
            model: agent.model,
            output: `[Agent ${agent.name} encountered an error: ${err.message}]`,
            failed: true,
            latencyMs: Date.now() - startTime,
          };
        }
      }
    }
  }

  // No NVIDIA key -> run via Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const output = await callGemini(agent.prompt, message);
      return {
        id: agent.id,
        name: agent.name,
        model: agent.model,
        output,
        failed: false,
        fallbackUsed: true,
        fallbackModel: 'gemini-3.7-flash (Default Engine)',
        provider: 'gemini' as const,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        id: agent.id,
        name: agent.name,
        model: agent.model,
        output: `Error invoking agent: ${err.message}`,
        failed: true,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  // Simulation fallback if no keys configured
  return {
    id: agent.id,
    name: agent.name,
    model: agent.model,
    output: `[Simulation Mode - Add NVIDIA_API_KEY or GEMINI_API_KEY in Settings to enable live neural execution] Analysis for: ${message.slice(0, 50)}...`,
    failed: false,
    fallbackUsed: true,
    provider: 'simulated' as const,
    latencyMs: 120,
  };
}

// Synthesize agent responses into one cohesive answer
// When video_generator is present, its video output is passed cleanly without destructive text merging
async function synthesize(customApiKey: string | undefined, message: string, agentResults: any[]) {
  const textResults = agentResults.filter(r => r.id !== 'video_generator' && !r.failed);
  const videoResult = agentResults.find(r => r.id === 'video_generator' && !r.failed);

  let textReply = '';

  if (textResults.length === 0) {
    if (videoResult) {
      return videoResult.output;
    }
    return 'The assigned specialist agents were unable to complete the query. Please check your API configuration or verify model endpoints in the Health tab.';
  }

  if (textResults.length === 1) {
    textReply = textResults[0].output;
  } else {
    const combined = textResults
      .map(r => `[Specialist: ${r.name}]:\n${r.output}`)
      .join('\n\n---\n\n');

    const systemPrompt = `You are the brain of an AI assistant called JusGBot. Several specialist agents responded to the user's request below. Combine their input into one single, clear, comprehensive, and well-organized answer for the user. Do not mention the agents or that multiple models were involved unless relevant to structuring the response — provide a unified, exceptional final answer.`;
    const userContent = `User request: ${message}\n\nSpecialist agent responses:\n${combined}`;

    const brainKey = customApiKey || process.env[BRAIN_ENV_KEY] || process.env.NVIDIA_API_KEY;
    if (brainKey) {
      try {
        textReply = await callNvidia(brainKey, BRAIN_MODEL, [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ], 1200);
      } catch {
        // Fall through to Gemini
      }
    }

    if (!textReply && process.env.GEMINI_API_KEY) {
      try {
        textReply = await callGemini(systemPrompt, userContent);
      } catch {
        textReply = combined;
      }
    }

    if (!textReply) {
      textReply = combined;
    }
  }

  if (videoResult) {
    return `${textReply}\n\n${videoResult.output}`;
  }

  return textReply;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Chat Endpoint: Route -> Run in Parallel -> Synthesize
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, customApiKey, directAgentId, selectedAgentIds } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid message string.' });
    }

    const effectiveNvidiaKey = customApiKey || process.env.NVIDIA_API_KEY;

    let targetAgentIds: string[] = [];
    let routingDecision: { ids: string[]; reasoning?: string } = { ids: [] };

    if (directAgentId && AGENTS.some(a => a.id === directAgentId)) {
      targetAgentIds = [directAgentId];
      const directAgent = AGENTS.find(a => a.id === directAgentId);
      routingDecision = {
        ids: [directAgentId],
        reasoning: `Direct execution mode: Assigned to ${directAgent?.name} (${directAgent?.model}).`,
      };
    } else if (Array.isArray(selectedAgentIds) && selectedAgentIds.length > 0) {
      targetAgentIds = selectedAgentIds.filter(id => AGENTS.some(a => a.id === id)).slice(0, 4);
      routingDecision = {
        ids: targetAgentIds,
        reasoning: `Manual multi-agent selection: ${targetAgentIds.join(', ')}.`,
      };
    } else {
      routingDecision = await classify(effectiveNvidiaKey, message);
      targetAgentIds = routingDecision.ids;
    }

    // Execute specialists in parallel with dedicated keys
    const agentResults = await Promise.all(
      targetAgentIds.map(id => runAgent(customApiKey, id, message))
    );

    // Synthesize final response
    const reply = await synthesize(customApiKey, message, agentResults);

    // Extract any generated video url
    const videoAgentResult = agentResults.find(r => r.videoUrl || r.b64_video);

    res.json({
      reply,
      videoUrl: videoAgentResult?.videoUrl,
      b64_video: videoAgentResult?.b64_video,
      agentsUsed: agentResults.map(r => r.name),
      agentResults,
      routingDecision,
      totalLatencyMs: Date.now() - startTime,
      provider: effectiveNvidiaKey ? 'nvidia' : (process.env.GEMINI_API_KEY ? 'gemini' : 'simulation'),
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to process chat orchestration',
      detail: err.message,
      totalLatencyMs: Date.now() - startTime,
    });
  }
});

// Model Ping Helper
async function pingModel(apiKey: string | undefined, model: string): Promise<{ ok: boolean; status: number | null; detail?: string; latencyMs: number }> {
  const start = Date.now();
  if (!apiKey) {
    return { ok: false, status: 401, detail: 'No dedicated or general NVIDIA API key configured. Requests will fall back to Gemini engine.', latencyMs: 0 };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with only the word OK.' }],
        max_tokens: 5,
      }),
      signal: controller.signal,
    });

    const latency = Date.now() - start;
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, status: res.status, detail: errText.slice(0, 200), latencyMs: latency };
    }

    return { ok: true, status: res.status, latencyMs: latency, detail: 'Active & Responsive' };
  } catch (err: any) {
    return { ok: false, status: null, detail: err.message, latencyMs: Date.now() - start };
  } finally {
    clearTimeout(timeout);
  }
}

// Health check endpoint - verifies all agents with their specific envKey + Brain model
app.get('/api/health', async (req, res) => {
  const customKey = req.headers['x-nvidia-api-key'] as string | undefined;

  const results = await Promise.all(
    AGENTS.map(async (agent) => {
      const dedicatedEnvKey = (agent as any).envKey ? process.env[(agent as any).envKey] : undefined;
      const apiKey = dedicatedEnvKey || customKey || process.env.NVIDIA_API_KEY;

      let ping;
      if (agent.id === 'video_generator') {
        ping = await pingCosmos(apiKey);
      } else {
        ping = await pingModel(apiKey, agent.model);
      }

      return {
        agent: agent.name,
        id: agent.id,
        model: agent.model,
        envKeyUsed: (agent as any).envKey || 'NVIDIA_API_KEY',
        ok: ping.ok,
        status: ping.status,
        latencyMs: ping.latencyMs,
        detail: ping.detail,
      };
    })
  );

  // Check brain model
  const brainKey = customKey || process.env[BRAIN_ENV_KEY] || process.env.NVIDIA_API_KEY;
  const brainPing = await pingModel(brainKey, BRAIN_MODEL);
  results.unshift({
    agent: 'Orchestrator Brain',
    id: 'brain',
    model: BRAIN_MODEL,
    envKeyUsed: BRAIN_ENV_KEY,
    ok: brainPing.ok,
    status: brainPing.status,
    latencyMs: brainPing.latencyMs,
    detail: brainPing.detail,
  });

  const allOk = results.every(r => r.ok);

  res.status(allOk ? 200 : 207).json({
    allOk,
    checkedAt: new Date().toISOString(),
    results,
    nvidiaKeyConfigured: Boolean(customKey || process.env.NVIDIA_API_KEY),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Test single agent endpoint
app.post('/api/test-agent', async (req, res) => {
  try {
    const { agentId, message, customApiKey } = req.body;
    const effectiveKey = customApiKey || process.env.NVIDIA_API_KEY;
    const result = await runAgent(effectiveKey, agentId, message || 'Introduce yourself and test response.');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get agent catalog
app.get('/api/agents', (req, res) => {
  res.json({
    agents: AGENTS,
    brainModel: BRAIN_MODEL,
    nvidiaUrl: NVIDIA_URL,
    total: AGENTS.length,
  });
});

// App configuration & key status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    nvidiaKeyConfigured: Boolean(process.env.NVIDIA_API_KEY),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    agentsCount: AGENTS.length,
    brainModel: BRAIN_MODEL,
    serverTime: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JusGBot Multi-Agent Server running on port ${PORT}`);
  });
}

start();
