"use client";

import { Memory } from "@/lib/types";

interface MemoryCardProps {
  memory: Memory;
  isRecalled?: boolean;
  onDelete?: (id: string) => void;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  performance_pattern: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: "📈",
  },
  content_gap: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: "🔍",
  },
  brand_voice: {
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
    icon: "🎙️",
  },
  user_retained: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: "💡",
  },
};

export default function MemoryCard({
  memory,
  isRecalled = false,
  onDelete,
}: MemoryCardProps) {
  const style = TYPE_STYLES[memory.memoryType] || {
    bg: "bg-gray-50",
    text: "text-gray-800",
    border: "border-gray-200",
    icon: "🧠",
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
        isRecalled ? "border-indigo-300 ring-2 ring-indigo-500/10" : "border-gray-200"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
          >
            <span>{style.icon}</span>
            <span className="capitalize">{memory.memoryType.replace("_", " ")}</span>
          </span>

          {isRecalled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
              ⚡ Recalled
            </span>
          )}
        </div>

        {/* Content */}
        <p className="mt-3.5 text-sm font-medium text-gray-900 leading-relaxed">
          "{memory.content}"
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <strong className="text-gray-700 font-semibold">Source:</strong> {memory.source}
          </span>
          {memory.timestamp && (
            <span className="text-gray-400">
              {memory.timestamp}
            </span>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(memory.id)}
            className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-0.5 rounded hover:bg-red-50"
            title="Delete memory"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
