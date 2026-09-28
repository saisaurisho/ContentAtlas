import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 pl-64">
      <Sidebar />

      <div className="p-8">
        <div className="mx-auto max-w-5xl mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            ContentAtlas Assistant
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            AI Strategy Chat
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Ask questions, query past performance, and request memory-augmented strategy recommendations.
          </p>
        </div>

        <ChatWindow />
      </div>
    </main>
  );
}
