import Sidebar from "@/components/Sidebar";
import { contentData } from "@/lib/mockData";

export default function ContentPage() {
  return (
    <main className="min-h-screen bg-gray-50 pl-64">
      <Sidebar />

      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Content Catalog
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Content History & Performance
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Tracked publication performance history indexed for ContentAtlas memory retrieval.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                        {item.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">{item.source}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{item.publicationDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              item.performance >= 80
                                ? "bg-emerald-500"
                                : item.performance >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${item.performance}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-gray-800">{item.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
