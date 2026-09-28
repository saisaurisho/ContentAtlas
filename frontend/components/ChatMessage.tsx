"use client";

import { MessageItem } from "@/lib/types";
import RecommendationCard from "./RecommendationCard";

interface ChatMessageProps {
  message: MessageItem;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end my-3">
        <div className="flex max-w-2xl flex-col items-end">
          <div className="rounded-2xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-sm">
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          <span suppressHydrationWarning className="mt-1 text-[11px] text-gray-400 px-1">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  // Assistant message
  const res = message.response;

  return (
    <div className="flex justify-start my-4">
      <div className="flex max-w-3xl gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          🧠
        </div>

        {/* Content Card */}
        <div className="flex flex-col space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm w-full">
          {/* Header Intent Badge */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ContentAtlas Agent
            </span>
            {res?.intent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                {res.intent.replace("_", " ")}
              </span>
            )}
          </div>

          {/* Loading Indicator */}
          {message.isLoading ? (
            <div className="flex items-center gap-3 py-2 text-sm text-gray-500">
              <div className="flex space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span>Recalling memory & synthesizing content strategy...</span>
            </div>
          ) : (
            <>
              {/* Answer Text */}
              <div className="text-sm leading-relaxed text-gray-800">
                <p className="whitespace-pre-wrap">{res?.answer || message.text}</p>
              </div>

              {/* Memories Used */}
              {res?.memories_used && res.memories_used.length > 0 && (
                <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-3 text-xs">
                  <span className="font-semibold text-purple-900 flex items-center gap-1.5 mb-1">
                    🧠 Memories Recalled ({res.memories_used.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {res.memories_used.map((mem, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-white border border-purple-200 px-2.5 py-1 text-purple-950 font-medium shadow-2xs"
                      >
                        {mem}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Base */}
              {res?.evidence && res.evidence.length > 0 && (
                <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-3 text-xs">
                  <span className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                    📊 Supporting Evidence:
                  </span>
                  <ul className="space-y-1 mt-1.5 text-gray-600">
                    {res.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Embedded Recommendations */}
              {res?.recommendations && res.recommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Generated Strategy Recommendation
                  </span>
                  {res.recommendations.map((rec, i) => (
                    <RecommendationCard key={i} recommendation={rec} isCompact={true} />
                  ))}
                </div>
              )}
            </>
          )}

          <span suppressHydrationWarning className="text-[11px] text-gray-400 text-right pt-1">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
