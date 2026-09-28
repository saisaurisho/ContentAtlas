"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendChartProps {
  data: {
    month?: string;
    topic?: string;
    performance: number;
  }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const xKey = data.length > 0 && data[0].month !== undefined ? "month" : "topic";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Performance Trends
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Monthly performance trajectory across recent publications.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey={xKey}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />

            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111113",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
            />

            <Line
              type="monotone"
              dataKey="performance"
              name="Performance"
              stroke="#ffffff"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}