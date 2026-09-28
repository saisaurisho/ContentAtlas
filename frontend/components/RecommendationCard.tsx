"use client";

import { useState } from "react";
import { Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  isCompact?: boolean;
}

export default function RecommendationCard({
  recommendation,
  isCompact = false,
}: RecommendationCardProps) {
  const [copied, setCopied] = useState(false);

  const copyOutline = () => {
    const text = `${recommendation.title}\n\nWhy: ${recommendation.why}\n\nOutline:\n` + 
      recommendation.outline.map((step, idx) => `${idx + 1}. ${step}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md">
      {/* Header Badges & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
            🎯 {recommendation.topic}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
            📄 {recommendation.content_type}
          </span>
        </div>

        <button
          onClick={copyOutline}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          title="Copy strategy & outline to clipboard"
        >
          {copied ? "✓ Copied!" : "📋 Copy Outline"}
        </button>
      </div>

      {/* Recommendation Title & Rationale */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {recommendation.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
          <strong className="text-gray-900 font-semibold">Why this works: </strong>
          {recommendation.why}
        </p>
      </div>

      {/* Grid of details */}
      <div className={`mt-5 grid gap-5 ${isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}>
        {/* Evidence */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <span>📊</span> Evidence Base
          </h4>
          <ul className="mt-3 space-y-2">
            {recommendation.evidence?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-blue-950">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Historical Memory */}
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
            <span>🧠</span> Historical Memory
          </h4>
          <ul className="mt-3 space-y-2">
            {recommendation.historical_memory?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-purple-950">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outline */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <span>📝</span> Proposed Outline
          </h4>
          <ol className="mt-3 space-y-1.5">
            {recommendation.outline?.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
