import {
  ChatResponse,
  Memory,
  MemoryRecallRequest,
  MemoryRecallResponse,
  MemoryRetainRequest,
  Recommendation,
  RecommendationResponse,
} from "./types";
import { getMockChatResponse, memories as mockMemories, recommendation as mockRecommendation } from "./mockData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * POST /api/v1/chat
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const raw = await apiFetch<any>("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    // Normalize backend OpenAPI schema into frontend expected shape
    const evidenceList: string[] = Array.isArray(raw.evidence)
      ? raw.evidence
      : [
          ...(raw.evidence?.gaps?.map((g: string) => `Target Content Gap: ${g}`) || []),
          ...(raw.evidence?.trends?.map((t: string) => `High-Momentum Topic: ${t}`) || []),
          ...(raw.evidence?.content?.length ? [`Grounded in ${raw.evidence.content.length} verified historical publications`] : []),
        ];

    const memoriesUsed: string[] = Array.isArray(raw.memories_used)
      ? raw.memories_used
      : Array.isArray(raw.memories)
      ? raw.memories.map((m: any) => typeof m === "string" ? m : m.statement || m.key)
      : [];

    const recommendationsList: Recommendation[] = Array.isArray(raw.recommendations)
      ? raw.recommendations
      : raw.recommendation
      ? [
          {
            title: raw.recommendation.title,
            topic: raw.recommendation.target_topic || raw.recommendation.topic || "AI Strategy",
            content_type: raw.recommendation.content_type || "Technical Guide",
            why: raw.recommendation.rationale || "Recommended based on historical performance and gap analysis.",
            evidence: evidenceList,
            historical_memory: memoriesUsed,
            outline: raw.recommendation.outline || [],
          },
        ]
      : [];

    return {
      answer: raw.answer || "",
      intent: raw.intent || "content_recommendation",
      evidence: evidenceList,
      memories_used: memoriesUsed,
      recommendations: recommendationsList,
    };
  } catch (err) {
    console.warn("API /api/v1/chat failed, using fallback mock response:", err);
    // Simulate slight network latency for realistic feel in fallback mode
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getMockChatResponse(message);
  }
}

/**
 * POST /api/v1/memory/retain
 */
export async function retainMemory(
  req: MemoryRetainRequest
): Promise<Memory> {
  try {
    const res = await apiFetch<Memory | { memory: Memory }>("/api/v1/memory/retain", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if ("memory" in res) return res.memory;
    return res;
  } catch (err) {
    console.warn("API /api/v1/memory/retain failed, using fallback mock retention:", err);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      memoryType: req.memoryType || "user_retained",
      content: req.content,
      source: req.source || "user_input",
      timestamp: new Date().toISOString().split("T")[0],
    };
    return newMemory;
  }
}

/**
 * POST /api/v1/memory/recall
 */
export async function recallMemories(
  query: string,
  limit: number = 5
): Promise<Memory[]> {
  try {
    const res = await apiFetch<MemoryRecallResponse | Memory[]>("/api/v1/memory/recall", {
      method: "POST",
      body: JSON.stringify({ query, limit }),
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.memories)) return res.memories;
    return [];
  } catch (err) {
    console.warn("API /api/v1/memory/recall failed, using fallback mock recall:", err);
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!query || query.trim() === "") return mockMemories;
    const lower = query.toLowerCase();
    const filtered = mockMemories.filter(
      (m) =>
        m.content.toLowerCase().includes(lower) ||
        m.memoryType.toLowerCase().includes(lower) ||
        m.source.toLowerCase().includes(lower)
    );
    return filtered.length > 0 ? filtered : mockMemories;
  }
}

/**
 * POST /api/v1/recommendations
 */
export async function getRecommendations(
  topic?: string
): Promise<Recommendation[]> {
  try {
    const res = await apiFetch<RecommendationResponse | Recommendation[]>("/api/v1/recommendations", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.recommendations)) return res.recommendations;
    return [mockRecommendation];
  } catch (err) {
    console.warn("API /api/v1/recommendations failed, using fallback mock recommendation:", err);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [mockRecommendation];
  }
}