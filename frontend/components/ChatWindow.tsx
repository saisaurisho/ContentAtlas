"use client";

import { useState, useRef, useEffect } from "react";
import { MessageItem } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import ChatMessage from "./ChatMessage";
import QuickQuestionButtons from "./QuickQuestionButtons";

export default function ChatWindow() {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      timestamp: "10:00 AM",
      response: {
        answer: "Welcome to ContentAtlas AI Strategy Assistant! I use memory-augmented retrieval to recommend what content to publish next based on past channel performance, audience gaps, and brand guidelines.",
        intent: "welcome",
        evidence: [
          "128 content items indexed",
          "3 core memory clusters loaded"
        ],
        memories_used: [
          "AI-agent tutorials historically perform strongly.",
          "Brand voice: Technical, concise, practical."
        ],
        recommendations: []
      }
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: userTime,
    };

    const loadingAssistantMsg: MessageItem = {
      id: `asst-loading-${Date.now()}`,
      sender: "assistant",
      timestamp: userTime,
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingAssistantMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const responseData = await sendChatMessage(query);
      const asstTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingAssistantMsg.id
            ? {
                id: `asst-${Date.now()}`,
                sender: "assistant",
                timestamp: asstTime,
                response: responseData,
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingAssistantMsg.id
            ? {
                id: `asst-err-${Date.now()}`,
                sender: "assistant",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                response: {
                  answer: "An error occurred while analyzing your request. Please try again.",
                  intent: "error",
                  evidence: [],
                  memories_used: [],
                  recommendations: []
                },
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>💬</span> AI Content Strategy Chat
          </h2>
          <p className="text-xs text-gray-500">
            Powered by POST /api/v1/chat with memory context
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Agent Online & Ready
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions & Input Box */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-4">
        <QuickQuestionButtons onSelect={(q) => handleSend(q)} disabled={loading} />

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about content strategy, memory, or next topics..."
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Send</span>
                <span>➔</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
