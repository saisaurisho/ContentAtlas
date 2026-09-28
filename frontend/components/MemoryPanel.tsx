"use client";

import { useState, useEffect } from "react";
import { Memory } from "@/lib/types";
import { retainMemory, recallMemories } from "@/lib/api";
import { memories as initialMemories } from "@/lib/mockData";
import MemoryCard from "./MemoryCard";

export default function MemoryPanel() {
  const [allMemories, setAllMemories] = useState<Memory[]>(initialMemories);
  const [recalledMemories, setRecalledMemories] = useState<Memory[]>([]);
  
  // Retain Form State
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("user_retained");
  const [newSource, setNewSource] = useState("manual_input");
  const [isRetaining, setIsRetaining] = useState(false);
  const [retainSuccess, setRetainSuccess] = useState(false);

  // Recall Query State
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecalling, setIsRecalling] = useState(false);

  // Tab filter: 'all' | 'retained' | 'recalled'
  const [activeTab, setActiveTab] = useState<"all" | "retained" | "recalled">("all");

  const handleRetainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isRetaining) return;

    setIsRetaining(true);
    try {
      const addedMemory = await retainMemory({
        content: newContent,
        memoryType: newType,
        source: newSource,
      });

      setAllMemories((prev) => [addedMemory, ...prev]);
      setNewContent("");
      setRetainSuccess(true);
      setTimeout(() => setRetainSuccess(false), 3000);
    } catch (err) {
      console.error("Retain error:", err);
    } finally {
      setIsRetaining(false);
    }
  };

  const handleRecallSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setRecalledMemories([]);
      return;
    }

    setIsRecalling(true);
    try {
      const results = await recallMemories(query);
      setRecalledMemories(results);
    } catch (err) {
      console.error("Recall error:", err);
    } finally {
      setIsRecalling(false);
    }
  };

  const handleDeleteMemory = (id: string) => {
    setAllMemories((prev) => prev.filter((m) => m.id !== id));
    setRecalledMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const displayedMemories = () => {
    if (activeTab === "recalled") {
      return recalledMemories;
    }
    if (activeTab === "retained") {
      return allMemories;
    }
    // "all": show search filtered or all
    if (searchQuery.trim()) {
      return recalledMemories;
    }
    return allMemories;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Retain Memory Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🧠</span> Memory Management Hub
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Retain long-term content performance knowledge & recall strategic insights.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
            <span className="font-semibold text-gray-900">{allMemories.length}</span> Retained Memories Active
          </div>
        </div>

        {/* Retain Memory Form */}
        <form onSubmit={handleRetainSubmit} className="mt-5 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Retain New Memory (POST /api/v1/memory/retain)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="e.g. Tutorial videos under 10 minutes get 2x retention rate..."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="performance_pattern">Performance Pattern</option>
                <option value="content_gap">Content Gap</option>
                <option value="brand_voice">Brand Voice</option>
                <option value="user_retained">User Retained</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={isRetaining || !newContent.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isRetaining ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>+ Retain Memory</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {retainSuccess && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 inline-block">
              ✓ Memory successfully retained in ContentAtlas memory store!
            </p>
          )}
        </form>
      </div>

      {/* Recall Memories Search & Filter Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Retained ({allMemories.length})
            </button>
            <button
              onClick={() => setActiveTab("recalled")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "recalled"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recalled Results ({recalledMemories.length})
            </button>
          </div>

          {/* Search Query for Recall */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleRecallSearch(e.target.value)}
              placeholder="Recall memory by topic/query (POST /api/v1/memory/recall)..."
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            {isRecalling && (
              <span className="absolute right-3.5 top-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            )}
          </div>
        </div>

        {/* Memories Grid */}
        <div className="mt-6">
          {displayedMemories().length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 bg-gray-50">
              <span className="text-3xl">🔍</span>
              <p className="mt-2 text-sm font-semibold text-gray-700">No memories found</p>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery ? `No memories matched "${searchQuery}"` : "Retain some memories above to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMemories().map((mem) => {
                const isRec = recalledMemories.some((rm) => rm.id === mem.id);
                return (
                  <MemoryCard
                    key={mem.id}
                    memory={mem}
                    isRecalled={isRec}
                    onDelete={handleDeleteMemory}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
