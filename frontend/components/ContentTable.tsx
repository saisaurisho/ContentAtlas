"use client";

import { useMemo, useState } from "react";
import { ContentItem } from "@/lib/types";

interface ContentTableProps {
  content: ContentItem[];
}

export default function ContentTable({ content }: ContentTableProps) {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const topics = ["All", ...Array.from(new Set(content.map((item) => item.topic)))];

  const types = ["All", ...Array.from(new Set(content.map((item) => item.type)))];

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.topic.toLowerCase().includes(search.toLowerCase());

      const matchesTopic =
        topicFilter === "All" || item.topic === topicFilter;

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesTopic && matchesType;
    });
  }, [content, search, topicFilter, typeFilter]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Filters */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Search */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              placeholder="Search title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Topic filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Topic
            </label>

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      {filteredContent.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">
            No content found
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Topic
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Publication Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Performance
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Source
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredContent.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.topic}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.publicationDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gray-900"
                          style={{
                            width: `${Math.min(
                              item.performance,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-semibold text-gray-900">
                        {item.performance}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result count */}
      <div className="border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredContent.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">
            {content.length}
          </span>{" "}
          content items
        </p>
      </div>
    </div>
  );
}