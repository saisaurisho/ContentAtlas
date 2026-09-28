import Sidebar from "@/components/Sidebar";
import MemoryPanel from "@/components/MemoryPanel";
import BeforeAfterDemo from "@/components/BeforeAfterDemo";

export default function MemoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 pl-64">
      <Sidebar />

      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Long-term Intelligence
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Memory Store & Recall
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage retained performance patterns, content gaps, and brand voice memories.
            </p>
          </div>

          {/* Memory Panel */}
          <MemoryPanel />

          {/* Before / After Memory Demo */}
          <div className="mt-12">
            <BeforeAfterDemo />
          </div>
        </div>
      </div>
    </main>
  );
}
