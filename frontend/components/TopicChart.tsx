"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopicChartProps {
  data: {
    topic: string;
    performance: number;
  }[];
}

export default function TopicChart({ data }: TopicChartProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Topic Performance
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Average performance across content topics.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
            />

            <XAxis
              dataKey="topic"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />

            <YAxis
              tick={{ fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
            />

            <Bar
              dataKey="performance"
              name="Performance"
              fill="#ffffff"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}