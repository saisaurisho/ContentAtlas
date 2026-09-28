export interface DashboardOverview {
  totalContent: number;
  totalTopics: number;
  bestTopics: string[];
  lowPerformingTopics: string[];
  contentGaps: string[];
  trendSummary: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  topic: string;
  publicationDate: string;
  performance: number;
  source: string;
}

export interface Memory {
  id: string;
  memoryType: string;
  content: string;
  source: string;
  timestamp?: string;
}

export interface Recommendation {
  title: string;
  topic: string;
  content_type: string;
  why: string;
  evidence: string[];
  historical_memory: string[];
  outline: string[];
}

export interface ChatResponse {
  answer: string;
  intent: string;
  evidence: string[];
  memories_used: string[];
  recommendations: Recommendation[];
}