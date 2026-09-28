"use client";

import { useState } from "react";
import { beforeAfterDemoData } from "@/lib/mockData";
import RecommendationCard from "./RecommendationCard";
import MemoryCard from "./MemoryCard";

export default function BeforeAfterDemo() {
  const [activeState, setActiveState] = useState<"before" | "recalled" | "after">("after");
  const [viewMode, setViewMode] = useState<"side-by-side" | "interactive">("side-by-side");
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveState("before");

    setTimeout(() => {
      setActiveState("recalled");
      setTimeout(() => {
        setActiveState("after");
        setIsSimulating(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
              ⚡
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Before vs After Memory Recall Demo
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            See how ContentAtlas recommendations transform when relevant historical memories are recalled.
          </p>
        </div>

        {/* Mode Toggle & Simulate button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Recalling Memories...</span>
              </>
            ) : (
              <>
                <span>▶ Run Live Transformation</span>
              </>
            )}
          </button>

          <div className="flex items-center rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "side-by-side"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode("interactive")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "interactive"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Interactive Steps
            </button>
          </div>
        </div>
      </div>

      {/* Recalled Memories Ribbon */}
      <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            🧠 Recalled Memories Active ({beforeAfterDemoData.memoriesRecalled.length})
          </span>
          <span className="text-[11px] text-purple-700 font-medium">
            Used to inform 'After' strategy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {beforeAfterDemoData.memoriesRecalled.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} isRecalled={true} />
          ))}
        </div>
      </div>

      {/* View Mode: Side by Side */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Before Panel */}
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                ❌ BEFORE Memory Recall
              </span>
              <span className="text-xs text-gray-400">Baseline / Generic LLM</span>
            </div>
            <p className="text-xs text-gray-500 italic">
              Standard response without performance history or brand memory constraints.
            </p>
            <RecommendationCard recommendation={beforeAfterDemoData.before} isCompact={true} />
          </div>

          {/* After Panel */}
          <div className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 ring-2 ring-indigo-500/20">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                ✨ AFTER Memory Recall
              </span>
              <span className="text-xs font-semibold text-indigo-600">Memory-Augmented</span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Transformed strategy taking channel gaps, past top performance, and brand voice into account.
            </p>
            <RecommendationCard recommendation={beforeAfterDemoData.after} isCompact={true} />
          </div>
        </div>
      ) : (
        /* View Mode: Interactive Steps */
        <div className="space-y-4">
          <div className="flex justify-center gap-2 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveState("before")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeState === "before"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Step 1: Before Memory
            </button>
            <button
              onClick={() => setActiveState("recalled")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeState === "recalled"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Step 2: Recall Memories
            </button>
            <button
              onClick={() => setActiveState("after")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeState === "after"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Step 3: After Memory
            </button>
          </div>

          <div className="p-2">
            {activeState === "before" && (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                  ❌ Before Memory Recall
                </span>
                <RecommendationCard recommendation={beforeAfterDemoData.before} />
              </div>
            )}

            {activeState === "recalled" && (
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                  🧠 Recalling Contextual Memories...
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {beforeAfterDemoData.memoriesRecalled.map((mem) => (
                    <MemoryCard key={mem.id} memory={mem} isRecalled={true} />
                  ))}
                </div>
              </div>
            )}

            {activeState === "after" && (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  ✨ After Memory Recall (Memory-Augmented)
                </span>
                <RecommendationCard recommendation={beforeAfterDemoData.after} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
