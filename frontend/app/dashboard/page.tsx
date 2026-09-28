import StatCard from "@/components/StatCard";
import TopicCard from "@/components/TopicCard";
import Sidebar from "@/components/Sidebar";
import { dashboardData } from "@/lib/mockData";

export default function DashboardPage() {
  return (
        <main className="min-h-screen bg-gray-50 pl-64">
        <Sidebar />

  <div className="p-8">
            <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-gray-500">
            ContentAtlas
          </p>

          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Content Strategy Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Understand what is working, what is missing,
            and what to publish next.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StatCard
            title="Total Content"
            value={dashboardData.totalContent}
            description="Published content items"
          />

          <StatCard
            title="Total Topics"
            value={dashboardData.totalTopics}
            description="Tracked content topics"
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <TopicCard
            title="Best Performing Topics"
            topics={dashboardData.bestTopics}
          />

          <TopicCard
            title="Low Performing Topics"
            topics={dashboardData.lowPerformingTopics}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Content Gaps
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Topics that are currently underrepresented.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {dashboardData.contentGaps.map((gap) => (
              <div
                key={gap}
                className="rounded-xl border border-dashed border-gray-300 p-4"
              >
                <p className="font-medium text-gray-800">
                  {gap}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Potential content opportunity
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-black p-6 text-white">
          <p className="text-sm text-gray-400">
            Trend Summary
          </p>

          <p className="mt-2 text-lg">
            {dashboardData.trendSummary}
          </p>
        </div>

      </div>
    </main>
  );
}