"use client";

interface QuickQuestionButtonsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const QUICK_QUESTIONS = [
  {
    label: "What should we publish next?",
    icon: "🎯",
    desc: "Get personalized content recommendation",
  },
  {
    label: "What has worked?",
    icon: "📈",
    desc: "Review past top-performing topics",
  },
  {
    label: "What content gaps exist?",
    icon: "🔍",
    desc: "Identify missing audience opportunities",
  },
  {
    label: "Why are you recommending this?",
    icon: "💡",
    desc: "Explain recommendation logic & memory",
  },
];

export default function QuickQuestionButtons({
  onSelect,
  disabled = false,
}: QuickQuestionButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Quick Questions
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q.label)}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-xs disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-base group-hover:bg-indigo-100 transition-colors">
              {q.icon}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-900 group-hover:text-indigo-900 truncate">
                {q.label}
              </span>
              <span className="text-[11px] text-gray-500 truncate">
                {q.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
