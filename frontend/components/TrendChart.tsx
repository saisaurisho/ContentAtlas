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
    month: string;
    performance: number;
  }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Performance Trend
        </h2>

        <p className="mt-1 text-sm text-white/30">
          Content performance over time.
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
              dataKey="month"
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