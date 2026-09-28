import {
  ContentItem,
  Memory,
  Recommendation,
} from "./types";

export const dashboardData = {
  totalContent: 128,
  totalTopics: 24,

  bestTopics: [
    "AI Agents",
    "Developer Tools",
    "Machine Learning",
  ],

  lowPerformingTopics: [
    "General News",
    "Product Updates",
  ],

  contentGaps: [
    "AI + Cybersecurity",
    "AI + Healthcare",
    "Developer Productivity",
  ],

  trendSummary:
    "AI-agent and practical tutorial content has shown strong recent performance.",
};

export const contentData: ContentItem[] = [
  {
    id: "1",
    title: "Building AI Agents with Python",
    type: "Tutorial",
    topic: "AI Agents",
    publicationDate: "2026-09-20",
    performance: 92,
    source: "Blog",
  },
  {
    id: "2",
    title: "Introduction to RAG",
    type: "Tutorial",
    topic: "Generative AI",
    publicationDate: "2026-09-15",
    performance: 86,
    source: "Blog",
  },
  {
    id: "3",
    title: "Developer Productivity Tools",
    type: "Article",
    topic: "Developer Tools",
    publicationDate: "2026-09-10",
    performance: 78,
    source: "LinkedIn",
  },
  {
    id: "4",
    title: "Latest Product Updates",
    type: "News",
    topic: "Product",
    publicationDate: "2026-09-05",
    performance: 42,
    source: "Blog",
  },
];

export const memories: Memory[] = [
  {
    id: "1",
    memoryType: "performance_pattern",
    content: "AI-agent tutorials historically perform strongly.",
    source: "analytics",
    timestamp: "2026-09-28",
  },
  {
    id: "2",
    memoryType: "content_gap",
    content: "AI + cybersecurity is underrepresented.",
    source: "analytics",
    timestamp: "2026-09-28",
  },
  {
    id: "3",
    memoryType: "brand_voice",
    content: "Technical, concise, practical.",
    source: "brand",
    timestamp: "2026-09-28",
  },
];

export const recommendation: Recommendation = {
  title: "AI + Cybersecurity: Building a Security-Focused AI Agent",
  topic: "AI + Cybersecurity",
  content_type: "Tutorial",
  why: "This topic addresses an identified content gap while building on historically strong AI-agent content.",
  evidence: [
    "AI-agent tutorials perform strongly.",
    "AI + cybersecurity is underrepresented.",
    "Technical tutorials have strong engagement.",
  ],
  historical_memory: [
    "AI-agent tutorials historically perform strongly.",
    "Technical, concise, practical content matches the brand voice.",
  ],
  outline: [
    "Introduction",
    "AI agent security risks",
    "Architecture",
    "Implementation",
    "Security best practices",
    "Conclusion",
  ],
};