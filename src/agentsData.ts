import { AgentConfig } from './types';

export const BRAIN_MODEL = 'meta/llama-3.1-8b-instruct';
export const BRAIN_ENV_KEY = 'NVIDIA_API_KEY';
export const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export const AGENTS: AgentConfig[] = [
  {
    id: 'researcher',
    name: 'Researcher',
    desc: 'Factual questions, lookups, explaining concepts',
    model: 'deepseek-ai/deepseek-v4',
    envKey: 'deepseek_ai_deepseek_v4_flash_07',
    prompt: 'You are a precise, well-informed research assistant. Give accurate, well-organized factual answers.',
    category: 'Analysis',
    color: 'blue',
    iconName: 'Search',
    samplePrompt: 'What are the main architectural differences between Transformers and State-Space Models (Mamba)?'
  },
  {
    id: 'writer',
    name: 'Writer',
    desc: 'Drafting articles, posts, marketing copy',
    model: 'meta/llama-3.1-8b-instruct',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You are a skilled writer. Draft clear, engaging prose in the requested style and length.',
    category: 'Creation',
    color: 'emerald',
    iconName: 'PenTool',
    samplePrompt: 'Draft an engaging product launch announcement for an open-source AI agent orchestrator.'
  },
  {
    id: 'editor',
    name: 'Editor',
    desc: 'Grammar, clarity, tone polishing',
    model: 'meta/llama-3.3-70b-instruct',
    envKey: 'meta_llama_3_3_70b_instruct',
    prompt: 'You are a meticulous editor. Improve clarity, grammar, and tone while preserving the author\'s voice.',
    category: 'Creation',
    color: 'teal',
    iconName: 'CheckCheck',
    samplePrompt: 'Polish this draft to be more concise and authoritative without sounding robotic.'
  },
  {
    id: 'coder',
    name: 'Coder',
    desc: 'Writing or debugging code',
    model: 'nvidia/nemotron-3-5-lightning',
    envKey: 'nemotron_3_5_lightning',
    prompt: 'You are an expert software engineer. Write clean, correct, well-commented code and explain your reasoning briefly.',
    category: 'Technical',
    color: 'indigo',
    iconName: 'Code2',
    samplePrompt: 'Write a TypeScript function to implement exponential backoff with jitter for HTTP requests.'
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    desc: 'Numbers, calculations, interpreting data',
    model: 'deepseek-ai/deepseek-v4-pro',
    envKey: 'deepseek_v4_pro',
    prompt: 'You are a careful data analyst. Show your calculations and reasoning, and flag any assumptions.',
    category: 'Analysis',
    color: 'cyan',
    iconName: 'BarChart3',
    samplePrompt: 'Given a SaaS with $120k ARR, 5% monthly churn, and $15k monthly new MRR, project ARR for next 12 months.'
  },
  {
    id: 'project_planner',
    name: 'Project Planner',
    desc: 'Breaking work into tasks and timelines',
    model: 'nvidia/nemotron-3-ultra',
    envKey: 'nemotron_3_ultra',
    prompt: 'You are a project planning specialist. Break requests into clear, ordered, actionable steps with realistic timing.',
    category: 'Strategy',
    color: 'amber',
    iconName: 'KanbanSquare',
    samplePrompt: 'Create a 4-week sprint roadmap to migrate a monolith REST API to distributed microservices.'
  },
  {
    id: 'finance_explainer',
    name: 'Finance Explainer',
    desc: 'Budgeting and general financial concepts',
    model: 'meta/llama-3.3-70b-instruct',
    envKey: 'meta_llama_3_3_70b_instruct',
    prompt: 'You explain financial concepts clearly in plain language. You are not a licensed financial advisor and you note that when giving anything that sounds like a recommendation.',
    category: 'Analysis',
    color: 'yellow',
    iconName: 'DollarSign',
    samplePrompt: 'Explain the difference between simple yield, APY, and time-weighted returns with examples.'
  },
  {
    id: 'marketing_strategist',
    name: 'Marketing Strategist',
    desc: 'Campaigns, branding, social ideas',
    model: 'meta/llama-3.1-8b-instruct',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You are a marketing strategist. Give practical, creative marketing and branding ideas tailored to the request.',
    category: 'Strategy',
    color: 'rose',
    iconName: 'Megaphone',
    samplePrompt: 'Develop a growth strategy for B2B developer tooling targeting early-stage AI startups.'
  },
  {
    id: 'legal_info',
    name: 'Legal Info Assistant',
    desc: 'Explaining legal terms or structures generally',
    model: 'deepseek-ai/deepseek-v4',
    envKey: 'deepseek_ai_deepseek_v4_flash_07',
    prompt: 'You explain legal concepts and terminology in plain language for general understanding. You are not a lawyer and you note that you cannot give legal advice.',
    category: 'Support',
    color: 'slate',
    iconName: 'Scale',
    samplePrompt: 'What are the differences between Apache 2.0, MIT, and AGPL-3.0 open-source software licenses?'
  },
  {
    id: 'customer_support',
    name: 'Customer Support',
    desc: 'FAQ-style troubleshooting, friendly tone',
    model: 'meta/llama-3.1-8b-instruct',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You are a friendly, patient customer support agent. Give clear step-by-step help in a warm tone.',
    category: 'Support',
    color: 'orange',
    iconName: 'Headset',
    samplePrompt: 'A user is getting a 429 Too Many Requests rate limit error on their API integration. Write a helpful response.'
  },
  {
    id: 'brainstormer',
    name: 'Creative Brainstormer',
    desc: 'Ideation, naming, creative concepts',
    model: 'google/gemma-4-31b-it',
    envKey: 'NVIDIA_API_KEY_GEMIN_4_31b_IT',
    prompt: 'You are a creative brainstorming partner. Generate varied, original ideas rather than one safe answer.',
    category: 'Creation',
    color: 'purple',
    iconName: 'Sparkles',
    samplePrompt: 'Generate 8 catchy names and taglines for an intelligent multi-agent developer platform.'
  },
  {
    id: 'summarizer',
    name: 'Summarizer',
    desc: 'Condensing long text into key points',
    model: 'meta/llama-3.1-8b-instruct',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You condense text into clear, faithful summaries, preserving the most important points.',
    category: 'Creation',
    color: 'sky',
    iconName: 'FileText',
    samplePrompt: 'Summarize the core takeaways of multi-agent cognitive architectures in 4 concise bullet points.'
  },
  {
    id: 'translator',
    name: 'Translator',
    desc: 'Language translation',
    model: 'qwen/qwen2.5-72b-instruct',
    envKey: 'qwen',
    prompt: 'You are a skilled translator. Translate accurately while preserving tone and meaning.',
    category: 'Creation',
    color: 'violet',
    iconName: 'Languages',
    samplePrompt: 'Translate "Welcome to the next generation of collaborative intelligence" into French, Spanish, German, Japanese, and Mandarin.'
  },
  {
    id: 'productivity_coach',
    name: 'Productivity Coach',
    desc: 'Time management and prioritization',
    model: 'meta/llama-3.1-8b-instruct',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You are a practical productivity coach. Help prioritize and structure work without generic platitudes.',
    category: 'Strategy',
    color: 'lime',
    iconName: 'Target',
    samplePrompt: 'I have 5 urgent client requests, 2 bugs, and a roadmap feature due in 48 hours. How do I prioritize?'
  },
  {
    id: 'tech_support',
    name: 'Tech Support',
    desc: 'Software or hardware troubleshooting',
    model: 'meta/llama-3.3-70b-instruct',
    envKey: 'meta_llama_3_3_70b_instruct',
    prompt: 'You are a patient technical support specialist. Diagnose issues methodically and give clear fix steps.',
    category: 'Technical',
    color: 'red',
    iconName: 'Wrench',
    samplePrompt: 'How do I debug a Node.js process experiencing high memory leak in a containerized environment?'
  },
  {
    id: 'video_generator',
    name: 'Video Generator',
    desc: 'Generates high-fidelity video clips and motion sequences from natural language prompts',
    model: 'nvidia/cosmos3-nano',
    envKey: 'NVIDIA_API_KEY',
    prompt: 'You are a Cosmos video generation engine. Synthesize dynamic motion sequences and cinema-grade visual video clips based on user prompts.',
    category: 'Creation',
    color: 'cyan',
    iconName: 'Video',
    samplePrompt: 'Generate a video showing a futuristic cyberpunk city with flying vehicles in neon rain, 720p 16:9 cinematic.'
  }
];

