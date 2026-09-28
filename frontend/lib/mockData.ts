import {
  ChatResponse,
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

export const beforeAfterDemoData = {
  before: {
    title: "Overview of AI Security Trends",
    topic: "AI Security",
    content_type: "Article",
    why: "Generic topic based on recent tech news keywords without considering performance history or channel gap analysis.",
    evidence: [
      "AI security keyword searches are up 15% this month."
    ],
    historical_memory: [
      "No historical performance or brand voice memories applied."
    ],
    outline: [
      "What is AI security?",
      "Why it matters in 2026",
      "Key summary and takeaways"
    ]
  } as Recommendation,
  memoriesRecalled: [
    {
      id: "m1",
      memoryType: "performance_pattern",
      content: "AI-agent tutorials historically perform strongly (92% performance score vs 42% for news).",
      source: "analytics",
      timestamp: "2026-09-28"
    },
    {
      id: "m2",
      memoryType: "content_gap",
      content: "AI + cybersecurity is severely underrepresented in current published history.",
      source: "analytics",
      timestamp: "2026-09-28"
    },
    {
      id: "m3",
      memoryType: "brand_voice",
      content: "Brand guideline: Readers favor technical, concise, practical hands-on step-by-step code tutorials.",
      source: "brand",
      timestamp: "2026-09-28"
    }
  ] as Memory[],
  after: recommendation
};

export function getMockChatResponse(message: string): ChatResponse {
  const lower = message.toLowerCase();

  if (lower.includes("publish next") || lower.includes("recommend")) {
    return {
      answer:
        "Based on performance history and content gap analysis, I recommend creating a technical tutorial on 'AI + Cybersecurity: Building a Security-Focused AI Agent'.",
      intent: "recommendation_request",
      evidence: [
        "AI-agent content holds our highest engagement rating (92%).",
        "AI + Cybersecurity is identified as a top high-priority content gap.",
        "Technical tutorials outperform overview articles by 3.2x."
      ],
      memories_used: [
        "AI-agent tutorials historically perform strongly.",
        "AI + cybersecurity is underrepresented.",
        "Technical, concise, practical content matches the brand voice."
      ],
      recommendations: [recommendation]
    };
  }

  if (lower.includes("worked") || lower.includes("performance")) {
    return {
      answer:
        "Our top-performing content centers around practical AI Agent builds and Developer Tools. For example, 'Building AI Agents with Python' achieved a 92% performance score.",
      intent: "analytics_query",
      evidence: [
        "Building AI Agents with Python — Score: 92/100",
        "Introduction to RAG — Score: 86/100",
        "Developer Productivity Tools — Score: 78/100"
      ],
      memories_used: [
        "AI-agent tutorials historically perform strongly."
      ],
      recommendations: []
    };
  }

  if (lower.includes("gap") || lower.includes("missing")) {
    return {
      answer:
        "We have 3 major content gaps: 1) AI + Cybersecurity, 2) AI + Healthcare, and 3) Developer Productivity. Producing content in AI + Cybersecurity leverages our AI expertise while filling a major gap.",
      intent: "gap_analysis",
      evidence: [
        "Zero published items under 'AI + Cybersecurity' tag.",
        "High audience search intent detected for enterprise AI security."
      ],
      memories_used: [
        "AI + cybersecurity is underrepresented."
      ],
      recommendations: [
        {
          title: "Securing Autonomous AI Agents in Production",
          topic: "AI + Cybersecurity",
          content_type: "Guide",
          why: "Directly addresses content gap with actionable security strategies.",
          evidence: ["High gap score", "Strong developer interest"],
          historical_memory: ["AI + cybersecurity is underrepresented."],
          outline: ["Threat models", "Prompt injection defense", "Sandboxing", "Audit logging"]
        }
      ]
    };
  }

  // Default response
  return {
    answer: `Analysis complete for: "${message}". Recalled relevant brand voice and performance patterns from memory to generate contextual strategy insights.`,
    intent: "general_inquiry",
    evidence: [
      "Matched against ContentAtlas memory store.",
      "Analyzed past performance metrics across 128 content items."
    ],
    memories_used: [
      "AI-agent tutorials historically perform strongly.",
      "Technical, concise, practical content matches brand voice."
    ],
    recommendations: [recommendation]
  };
}