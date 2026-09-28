"use client";

import Link from "next/link";
import TrendChart from "@/components/TrendChart";
import { trendData } from "@/lib/mockData";

import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronRight,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const topics = [
  {
    name: "AI Agents",
    score: 92,
    posts: 18,
    trend: "+24%",
  },
  {
    name: "Developer Tools",
    score: 81,
    posts: 14,
    trend: "+18%",
  },
  {
    name: "Automation",
    score: 74,
    posts: 21,
    trend: "+12%",
  },
  {
    name: "Cybersecurity",
    score: 48,
    posts: 4,
    trend: "+31%",
  },
  {
    name: "Cloud",
    score: 42,
    posts: 12,
    trend: "+5%",
  },
];

const gaps = [
  {
    title: "AI + Cybersecurity",
    score: "82%",
    reason:
      "Low coverage with strong performance in related AI topics.",
  },
  {
    title: "AI + Finance",
    score: "74%",
    reason:
      "Very limited coverage despite strong adjacent-topic signals.",
  },
  {
    title: "AI + Healthcare",
    score: "68%",
    reason:
      "Almost no historical content in a growing topic area.",
  },
];

const content = [
  {
    title: "Building Production-Ready AI Agents",
    topic: "AI Agents",
    type: "Technical Guide",
    engagement: "12.8%",
    date: "Sep 24",
  },
  {
    title: "10 Developer Tools You Should Know",
    topic: "Developer Tools",
    type: "Blog",
    engagement: "10.4%",
    date: "Sep 21",
  },
  {
    title: "Automating Your Engineering Workflow",
    topic: "Automation",
    type: "Tutorial",
    engagement: "9.7%",
    date: "Sep 18",
  },
  {
    title: "The Future of Generic AI News",
    topic: "AI News",
    type: "Article",
    engagement: "3.1%",
    date: "Sep 14",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#070a11] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0a0e16] lg:flex lg:flex-col">

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

          <div className="px-3 py-5">

            <p className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white/20">
              Workspace
            </p>

            <NavItem
              href="/dashboard"
              icon={<Activity />}
              label="Overview"
              active
            />

            <NavItem
              href="/content"
              icon={<FileText />}
              label="Content"
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

          <div className="mt-auto p-4">

            <div className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.07] p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-300">
                  Memory active
                </span>

              </div>

              <p className="mt-3 text-[11px] leading-5 text-white/30">
                Hindsight is available for your organization's strategic
                memory.
              </p>

              <button className="mt-4 flex items-center gap-1 text-[11px] text-violet-300">
                Explore memory
                <ChevronRight className="h-3 w-3" />
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
                Strategy Overview
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

          <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8">

            {/* SEARCH / ACTION BAR */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <h2 className="text-xl font-semibold">
                  Good evening, NovaStack.
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  Here's what your content strategy is telling you today.
                </p>

              </div>

              <Link
                href="/dashboard"
                className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI Strategist
              </Link>

            </div>

            {/* STAT CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <Stat
                icon={<FileText />}
                label="Total Content"
                value="127"
                change="+14 this month"
              />

              <Stat
                icon={<Target />}
                label="Topics Tracked"
                value="18"
                change="+3 discovered"
              />

              <Stat
                icon={<TrendingUp />}
                label="Avg. Engagement"
                value="8.7%"
                change="+1.8% vs last month"
              />

              <Stat
                icon={<Lightbulb />}
                label="Content Gaps"
                value="5"
                change="3 high opportunity"
              />

            </div>

            {/* TOP ROW */}
            <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">

              {/* TOPICS */}
              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-sm font-semibold">
                      Topic Performance
                    </h3>

                    <p className="mt-1 text-[11px] text-white/30">
                      Historical engagement score
                    </p>

                  </div>

                  <button className="text-[11px] text-white/30">
                    Last 12 months
                  </button>

                </div>

                <div className="mt-7 space-y-6">

                  {topics.map((topic) => (

                    <div key={topic.name}>

                      <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="text-xs font-medium text-white/75">
                            {topic.name}
                          </span>

                          <span className="text-[10px] text-white/20">
                            {topic.posts} posts
                          </span>

                        </div>

                        <div className="flex items-center gap-3">

                          <span className="text-xs font-medium">
                            {topic.score}
                          </span>

                          <span className="text-[10px] text-emerald-400">
                            {topic.trend}
                          </span>

                        </div>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{
                            width: `${topic.score}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </section>

              {/* RECOMMENDATION */}
              <section className="rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.08] to-cyan-500/[0.025] p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      AI Recommendation
                    </h3>

                    <p className="text-[10px] text-white/25">
                      Analytics + Hindsight memory
                    </p>

                  </div>

                </div>

                <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/20 p-5">

                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-300/70">
                    Recommended next
                  </span>

                  <h4 className="mt-2 text-lg font-semibold">
                    AI Agents × Cybersecurity
                  </h4>

                  <p className="mt-3 text-xs leading-6 text-white/40">
                    Your AI-agent tutorials consistently perform well, while
                    cybersecurity has very low historical coverage.
                  </p>

                  <div className="mt-4 space-y-2">

                    <Evidence text="18 AI-agent posts with strong engagement" />

                    <Evidence text="Only 4 cybersecurity posts" />

                    <Evidence text="Related technical topics are trending" />

                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-[11px] font-medium hover:bg-white/[0.08]">
                    View full recommendation
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                </div>

              </section>

            </div>

            {/* PERFORMANCE TREND */}
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

              <div className="mb-6">

                <h3 className="text-sm font-semibold">
                  Performance Trend
                </h3>

                <p className="mt-1 text-[11px] text-white/30">
                  Content performance over time
                </p>

              </div>

              <TrendChart data={trendData} />

            </section>

            {/* CONTENT GAPS */}
            <section>

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <h3 className="text-sm font-semibold">
                    Content Opportunities
                  </h3>

                  <p className="mt-1 text-[11px] text-white/30">
                    Areas where your content strategy has room to grow
                  </p>

                </div>

                <button className="hidden text-[11px] text-white/30 sm:block">
                  View all →
                </button>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                {gaps.map((gap) => (

                  <div
                    key={gap.title}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-violet-400/20"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10">
                        <Target className="h-4 w-4 text-amber-300" />
                      </div>

                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-300">
                        {gap.score}
                      </span>

                    </div>

                    <h4 className="mt-5 text-sm font-semibold">
                      {gap.title}
                    </h4>

                    <p className="mt-2 text-[11px] leading-5 text-white/30">
                      {gap.reason}
                    </p>

                    <button className="mt-5 flex items-center gap-1 text-[10px] text-white/40">
                      Analyze opportunity
                      <ChevronRight className="h-3 w-3" />
                    </button>

                  </div>

                ))}

              </div>

            </section>

            {/* RECENT CONTENT */}
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-semibold">
                    Recent Content
                  </h3>

                  <p className="mt-1 text-[11px] text-white/30">
                    Latest published content and performance
                  </p>

                </div>

                <Link
                  href="/content"
                  className="text-[11px] text-white/30 hover:text-white"
                >
                  View all →
                </Link>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-white/[0.06] text-left text-[9px] uppercase tracking-[0.15em] text-white/20">

                      <th className="pb-3">
                        Content
                      </th>

                      <th className="pb-3">
                        Topic
                      </th>

                      <th className="pb-3">
                        Type
                      </th>

                      <th className="pb-3">
                        Date
                      </th>

                      <th className="pb-3 text-right">
                        Engagement
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {content.map((item) => (

                      <tr
                        key={item.title}
                        className="border-b border-white/[0.04] last:border-0"
                      >

                        <td className="py-4 pr-5">

                          <div className="text-xs font-medium text-white/70">
                            {item.title}
                          </div>

                        </td>

                        <td className="py-4 text-[11px] text-white/35">
                          {item.topic}
                        </td>

                        <td className="py-4">

                          <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[9px] text-white/40">
                            {item.type}
                          </span>

                        </td>

                        <td className="py-4 text-[11px] text-white/30">
                          {item.date}
                        </td>

                        <td className="py-4 text-right text-xs font-medium text-emerald-300">
                          {item.engagement}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

            {/* MEMORY STATUS */}
            <section className="grid gap-4 md:grid-cols-3">

              <MemoryCard
                title="Content Memory"
                value="127"
                description="Published content remembered"
              />

              <MemoryCard
                title="Strategic Patterns"
                value="34"
                description="Performance patterns retained"
              />

              <MemoryCard
                title="Recommendations"
                value="21"
                description="Historical recommendations"
              />

            </section>

            {/* FOOTER */}
            <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-white/20 sm:flex-row">

              <span>
                ContentAtlas · AI Content Strategy Agent
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

function Stat({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
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

      <div className="mt-1 text-[10px] text-emerald-400/80">
        {change}
      </div>

    </div>
  );
}

function Evidence({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-white/40">

      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

      {text}

    </div>
  );
}

function MemoryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
        <Brain className="h-4 w-4 text-violet-300" />
      </div>

      <div>

        <div className="text-lg font-semibold">
          {value}
        </div>

        <div className="text-[11px] font-medium text-white/60">
          {title}
        </div>

        <div className="mt-0.5 text-[9px] text-white/25">
          {description}
        </div>

      </div>

    </div>
  );
}
