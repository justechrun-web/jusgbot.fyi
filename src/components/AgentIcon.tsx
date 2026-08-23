import React from 'react';
import {
  Search,
  PenTool,
  CheckCheck,
  Code2,
  BarChart3,
  KanbanSquare,
  DollarSign,
  Megaphone,
  Scale,
  Headset,
  Sparkles,
  FileText,
  Languages,
  Target,
  Wrench,
  Cpu,
  Bot,
  Video,
  Film
} from 'lucide-react';

interface AgentIconProps {
  name: string;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name.toLowerCase()) {
    case 'researcher':
      return <Search className={className} />;
    case 'writer':
      return <PenTool className={className} />;
    case 'editor':
      return <CheckCheck className={className} />;
    case 'coder':
      return <Code2 className={className} />;
    case 'data analyst':
    case 'data_analyst':
      return <BarChart3 className={className} />;
    case 'project planner':
    case 'project_planner':
      return <KanbanSquare className={className} />;
    case 'finance explainer':
    case 'finance_explainer':
      return <DollarSign className={className} />;
    case 'marketing strategist':
    case 'marketing_strategist':
      return <Megaphone className={className} />;
    case 'legal info assistant':
    case 'legal_info':
      return <Scale className={className} />;
    case 'customer support':
    case 'customer_support':
      return <Headset className={className} />;
    case 'creative brainstormer':
    case 'brainstormer':
      return <Sparkles className={className} />;
    case 'summarizer':
      return <FileText className={className} />;
    case 'translator':
      return <Languages className={className} />;
    case 'productivity coach':
    case 'productivity_coach':
      return <Target className={className} />;
    case 'tech support':
    case 'tech_support':
      return <Wrench className={className} />;
    case 'video generator':
    case 'video_generator':
    case 'video':
      return <Video className={className} />;
    case 'orchestrator brain':
    case 'brain':
      return <Cpu className={className} />;
    default:
      return <Bot className={className} />;
  }
};
