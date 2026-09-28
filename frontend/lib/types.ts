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

export interface ChatRequest {
  message: string;
}

export interface MemoryRetainRequest {
  content: string;
  memoryType: string;
  source: string;
}

export interface MemoryRecallRequest {
  query: string;
  limit?: number;
}

export interface MemoryRecallResponse {
  memories: Memory[];
}

export interface RecommendationRequest {
  topic?: string;
  limit?: number;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text?: string;
  response?: ChatResponse;
  isLoading?: boolean;
}