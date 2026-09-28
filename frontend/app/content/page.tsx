"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronDown,
  FileText,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type ContentItem = {
  id?: string;
  title: string;
  topic: string;
  type: string;
  status: string;
  engagement: string;
  engagementValue: number;
  date: string;
  views: string;
};

const contentData: ContentItem[] = [
  {
    title: "Building Production-Ready AI Agents",
    topic: "AI Agents",
    type: "Technical Guide",
    status: "Published",
    engagement: "12.8%",
    engagementValue: 12.8,
    date: "Sep 24, 2026",
    views: "18.4K",
  },
  {
    title: "10 Developer Tools You Should Know",
    topic: "Developer Tools",
    type: "Blog",
    status: "Published",
    engagement: "10.4%",
    engagementValue: 10.4,
    date: "Sep 21, 2026",
    views: "14.7K",
  },
  {
    title: "Automating Your Engineering Workflow",
    topic: "Automation",
    type: "Tutorial",
    status: "Published",
    engagement: "9.7%",
    engagementValue: 9.7,
    date: "Sep 18, 2026",
    views: "12.2K",
  },
  {
    title: "AI Agents for Cybersecurity Teams",
    topic: "Cybersecurity",
    type: "Research",
    status: "Draft",
    engagement: "—",
    engagementValue: 0,
    date: "Sep 27, 2026",
    views: "—",
  },
  {
    title: "Understanding LLM Tool Calling",
    topic: "AI Agents",
    type: "Technical Guide",
    status: "Published",
    engagement: "11.6%",
    engagementValue: 11.6,
    date: "Sep 12, 2026",
    views: "16.8K",
  },
  {
    title: "The Future of Generic AI News",
    topic: "AI News",
    type: "Article",
    status: "Published",
    engagement: "3.1%",
    engagementValue: 3.1,
    date: "Sep 08, 2026",
    views: "21.3K",
  },
  {
    title: "Building Reliable RAG Pipelines",
    topic: "AI Agents",
    type: "Tutorial",
    status: "Published",
    engagement: "9.3%",
    engagementValue: 9.3,
    date: "Sep 04, 2026",
    views: "11.9K",
  },
  {
    title: "AI + Finance: What Developers Need to Know",
    topic: "Finance",
    type: "Article",
    status: "Draft",
    engagement: "—",
    engagementValue: 0,
    date: "Sep 26, 2026",
    views: "—",
  },
];

const topics = [
  "All Topics",
  "AI Agents",
  "Developer Tools",
  "Automation",
  "Cybersecurity",
  "AI News",
  "Finance",
];

const types = [
  "All Types",
  "Technical Guide",
  "Blog",
  "Tutorial",
  "Research",
  "Article",
];

export default function ContentPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All Topics");
  const [type, setType] = useState("All Types");

  const filteredContent = useMemo(() => {
    return contentData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.topic.toLowerCase().includes(search.toLowerCase());

      const matchesTopic =
        topic === "All Topics" || item.topic === topic;

      const matchesType =
        type === "All Types" || item.type === type;

      return matchesSearch && matchesTopic && matchesType;
    });
  }, [search, topic, type]);

  return (
    <main className="min-h-screen bg-[#070a11] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0a0e16] lg:flex lg:flex-col">

          {/* Logo */}
          <div className="border-b border-white/[0.07] px-5 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <div className="text-sm font-semibold">
                  ContentAtlas
                </div>

                <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                  AI Strategy
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="px-3 py-5">

            <p className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white/20">
              Workspace
            </p>

            <NavItem
              href="/dashboard"
              icon={<Activity />}
              label="Overview"
            />

            <NavItem
              href="/content"
              icon={<FileText />}
              label="Content"
              active
            />

            <NavItem
              href="/dashboard"
              icon={<Target />}
              label="Content Gaps"
            />

            <NavItem
              href="/dashboard"
              icon={<Brain />}
              label="Memory"
            />

            <NavItem
              href="/dashboard"
              icon={<MessageSquare />}
              label="AI Strategist"
            />
          </div>

          {/* Memory */}
          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.07] p-4">

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-300">
                  Memory active
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-white/30">
                Hindsight is learning from your content history and
                strategic decisions.
              </p>

              <button className="mt-4 flex items-center gap-1 text-[11px] text-violet-300">
                Explore memory
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">

            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Content Intelligence
              </div>

              <h1 className="mt-1 text-lg font-semibold">
                Content Library
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[11px] text-white/40">
                  Agent online
                </span>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[10px] font-semibold">
                NS
              </div>

            </div>
          </header>

          {/* CONTENT */}
          <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8">

            {/* TITLE */}
            <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Your Content
                  </h2>

                  <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[9px] text-white/35">
                    127 total
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                  Explore your publishing history, performance signals,
                  topics, and content patterns used by the AI strategist.
                </p>
              </div>

              <button className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90">
                <Plus className="h-4 w-4" />
                Add Content
              </button>

            </section>

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                icon={<FileText />}
                label="Total Content"
                value="127"
                description="Across all topics"
              />

              <StatCard
                icon={<TrendingUp />}
                label="Published"
                value="119"
                description="+12 this month"
              />

              <StatCard
                icon={<Sparkles />}
                label="Drafts"
                value="8"
                description="3 AI recommended"
              />

              <StatCard
                icon={<Target />}
                label="Avg. Engagement"
                value="8.7%"
                description="+1.8% vs last month"
              />

            </div>

            {/* AI INSIGHT */}
            <section className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-r from-violet-500/[0.08] to-cyan-500/[0.03] p-5">

              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                    <Sparkles className="h-5 w-5 text-violet-300" />
                  </div>

                  <div>
                    <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-300">
                      AI Content Insight
                    </div>

                    <h3 className="mt-1 text-sm font-semibold">
                      Your technical AI content is outperforming general AI news.
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-white/35">
                      ContentAtlas detected stronger engagement across
                      technical guides and AI-agent tutorials.
                    </p>
                  </div>

                </div>

                <button className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] text-white/60">
                  Analyze pattern
                  <ArrowUpRight className="h-3 w-3" />
                </button>

              </div>
            </section>

            {/* SEARCH + FILTERS */}
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

              <div className="flex flex-col gap-3 lg:flex-row">

                {/* Search */}
                <div className="relative flex-1">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search content, topics..."
                    className="h-10 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                  />

                </div>

                {/* Topic */}
                <div className="relative">

                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-10 min-w-[160px] appearance-none rounded-xl border border-white/[0.07] bg-[#0b0f17] px-4 pr-9 text-xs text-white/60 outline-none"
                  >
                    {topics.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />

                </div>

                {/* Type */}
                <div className="relative">

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-10 min-w-[160px] appearance-none rounded-xl border border-white/[0.07] bg-[#0b0f17] px-4 pr-9 text-xs text-white/60 outline-none"
                  >
                    {types.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />

                </div>

                <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 text-xs text-white/50">
                  <Filter className="h-3.5 w-3.5" />
                  More Filters
                </button>

              </div>

              <div className="mt-3 text-[10px] text-white/20">
                Showing {filteredContent.length} of {contentData.length} items
              </div>

            </section>

            {/* TABLE */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                <div>
                  <h3 className="text-sm font-semibold">
                    Content Library
                  </h3>

                  <p className="mt-1 text-[10px] text-white/25">
                    Your historical content and performance signals
                  </p>
                </div>

                <button className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-[10px] text-white/40">
                  Sort by
                  <ChevronDown className="h-3 w-3" />
                </button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-[9px] uppercase tracking-[0.16em] text-white/20">

                      <th className="px-5 py-3 font-medium">
                        Content
                      </th>

                      <th className="py-3 font-medium">
                        Topic
                      </th>

                      <th className="py-3 font-medium">
                        Type
                      </th>

                      <th className="py-3 font-medium">
                        Status
                      </th>

                      <th className="py-3 font-medium">
                        Published
                      </th>

                      <th className="py-3 font-medium">
                        Views
                      </th>

                      <th className="px-5 py-3 text-right font-medium">
                        Engagement
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredContent.length > 0 ? (
                      filteredContent.map((item) => (
                        <ContentRow
                          key={item.title}
                          item={item}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-16 text-center"
                        >
                          <Search className="mx-auto h-6 w-6 text-white/15" />

                          <p className="mt-3 text-xs text-white/35">
                            No content found
                          </p>

                          <p className="mt-1 text-[10px] text-white/20">
                            Try changing your search or filters.
                          </p>
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4">

                <span className="text-[10px] text-white/20">
                  Page 1 of 13
                </span>

                <div className="flex gap-2">

                  <button className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-[10px] text-white/25">
                    Previous
                  </button>

                  <button className="rounded-lg border border-white/[0.07] bg-white/[0.05] px-3 py-1.5 text-[10px] text-white/60">
                    1
                  </button>

                  <button className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-[10px] text-white/40">
                    2
                  </button>

                  <button className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-[10px] text-white/40">
                    Next
                  </button>

                </div>

              </div>

            </section>

            {/* FOOTER */}
            <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-white/20 sm:flex-row">

              <span>
                ContentAtlas · Content Intelligence
              </span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Hindsight memory connected
              </span>

            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition ${
        active
          ? "bg-white/[0.07] text-white"
          : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
      }`}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>

      {label}
    </Link>
  );
}


function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div className="flex items-start justify-between">

        <span className="text-[11px] text-white/30">
          {label}
        </span>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/35">
          <span className="[&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        </div>

      </div>

      <div className="mt-4 text-2xl font-semibold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-white/25">
        {description}
      </div>

    </div>
  );
}


function ContentRow({
  item,
}: {
  item: ContentItem;
}) {
  return (
    <tr className="group border-b border-white/[0.04] transition hover:bg-white/[0.025]">

      {/* Content */}
      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <FileText className="h-4 w-4 text-violet-300" />
          </div>

          <div className="min-w-0">

            <div className="max-w-[300px] truncate text-xs font-medium text-white/75">
              {item.title}
            </div>

            <div className="mt-1 text-[9px] text-white/20">
              Content ID · CA-{item.id}
            </div>

          </div>

        </div>

      </td>

      {/* Topic */}
      <td className="py-4">

        <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[9px] text-white/40">
          {item.topic}
        </span>

      </td>

      {/* Type */}
      <td className="py-4">

        <span className="text-[10px] text-white/35">
          {item.type}
        </span>

      </td>

      {/* Status */}
      <td className="py-4">

        <StatusBadge status={item.status} />

      </td>

      {/* Date */}
      <td className="py-4 text-[10px] text-white/30">
        {item.date}
      </td>

      {/* Views */}
      <td className="py-4 text-[10px] text-white/40">
        {item.views}
      </td>

      {/* Engagement */}
      <td className="px-5 py-4 text-right">

        {item.engagementValue > 0 ? (
          <div className="flex flex-col items-end">

            <span
              className={`text-xs font-semibold ${
                item.engagementValue >= 10
                  ? "text-emerald-300"
                  : "text-white/60"
              }`}
            >
              {item.engagement}
            </span>

            <span className="mt-1 text-[9px] text-white/20">
              engagement
            </span>

          </div>
        ) : (
          <span className="text-[10px] text-white/20">
            —
          </span>
        )}

      </td>

    </tr>
  );
}


function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2 py-1 text-[9px] text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Draft
    </span>
  );
}
