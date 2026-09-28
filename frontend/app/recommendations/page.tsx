"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import RecommendationCard from "@/components/RecommendationCard";
import BeforeAfterDemo from "@/components/BeforeAfterDemo";
import { Recommendation } from "@/lib/types";
import { getRecommendations } from "@/lib/api";
import { recommendation as defaultRec } from "@/lib/mockData";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([defaultRec]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async (selectedTopic?: string) => {
    setLoading(true);
    try {
      const results = await getRecommendations(selectedTopic || topic);
      setRecommendations(results);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pl-64">
      <Sidebar />

      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              AI Strategy Engine
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Content Recommendations
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Context-aware topic recommendations powered by POST /api/v1/recommendations.
            </p>
          </div>

          {/* Generator Controls */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full flex items-center gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Filter or specify target topic (e.g. AI Agents, Cybersecurity, Developer Tools)..."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                onClick={() => fetchRecommendations()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-40 whitespace-nowrap"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Generate Strategy</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🎯</span> Active Recommendations
            </h2>

            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          {/* Before / After Memory Impact Section */}
          <div className="mt-12">
            <BeforeAfterDemo />
          </div>
        </div>
      </div>
    </main>
  );
}
