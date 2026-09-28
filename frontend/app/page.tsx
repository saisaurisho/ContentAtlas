"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070a11] text-white">

      {/* NAVBAR */}
      <header className="border-b border-white/[0.07] bg-[#070a11]/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <Brain className="h-5 w-5" />
            </div>

            <div>
              <div className="text-sm font-semibold">
                ContentAtlas
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                AI Content Strategy
              </div>
            </div>

          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            Open Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pt-32">

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2">

              <Sparkles className="h-3.5 w-3.5 text-violet-300" />

              <span className="text-[11px] text-violet-200">
                AI-Powered Content Intelligence
              </span>

            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">

              Turn your content history into

              <span className="block bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
                your next strategy.
              </span>

            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
              ContentAtlas analyzes your content performance, discovers
              strategic gaps, remembers what worked, and helps your team
              decide what to create next.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Explore Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                Ask AI Strategist
                <MessageSquare className="h-4 w-4" />
              </Link>

            </div>

          </div>

          {/* PRODUCT PREVIEW */}
          <div className="mx-auto mt-20 max-w-5xl">

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-2 shadow-2xl shadow-violet-500/5">

              <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e16] p-6">

                {/* Preview header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">

                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                      Content Intelligence
                    </div>

                    <div className="mt-1 text-sm font-semibold">
                      Strategy Overview
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-emerald-300">
                      Agent online
                    </span>
                  </div>

                </div>

                {/* Preview stats */}
                <div className="mt-6 grid gap-3 sm:grid-cols-4">

                  <PreviewStat
                    label="Total Content"
                    value="127"
                  />

                  <PreviewStat
                    label="Topics Tracked"
                    value="18"
                  />

                  <PreviewStat
                    label="Avg. Engagement"
                    value="8.7%"
                  />

                  <PreviewStat
                    label="Content Gaps"
                    value="5"
                  />

                </div>

                {/* Preview lower section */}
                <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold">
                          Topic Performance
                        </div>

                        <div className="mt-1 text-[9px] text-white/25">
                          Historical engagement score
                        </div>
                      </div>

                      <BarChart3 className="h-4 w-4 text-white/20" />
                    </div>

                    <div className="mt-6 space-y-4">

                      <PreviewBar
                        label="AI Agents"
                        value={92}
                      />

                      <PreviewBar
                        label="Developer Tools"
                        value={81}
                      />

                      <PreviewBar
                        label="Automation"
                        value={74}
                      />

                      <PreviewBar
                        label="Cybersecurity"
                        value={48}
                      />

                    </div>

                  </div>

                  <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.05] p-5">

                    <div className="flex items-center gap-2">

                      <Sparkles className="h-4 w-4 text-violet-300" />

                      <span className="text-xs font-semibold">
                        AI Recommendation
                      </span>

                    </div>

                    <div className="mt-5 text-lg font-semibold">
                      AI Agents × Cybersecurity
                    </div>

                    <p className="mt-3 text-[10px] leading-5 text-white/30">
                      Combine strong AI-agent performance with an
                      underrepresented cybersecurity topic.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[10px] text-violet-300">
                      <Target className="h-3.5 w-3.5" />
                      High opportunity
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="border-t border-white/[0.06]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-2xl text-center">

            <div className="text-[10px] uppercase tracking-[0.2em] text-violet-300/60">
              One intelligence layer
            </div>

            <h2 className="mt-3 text-3xl font-semibold">
              From content history to strategic action.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/30">
              ContentAtlas connects analytics, memory, content gaps and AI
              recommendations into one workflow.
            </p>

          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={<BarChart3 />}
              title="Performance Analytics"
              description="Understand which topics and content formats are actually performing."
            />

            <FeatureCard
              icon={<Target />}
              title="Content Gaps"
              description="Identify opportunities where audience demand and your existing coverage don't align."
            />

            <FeatureCard
              icon={<Brain />}
              title="Strategic Memory"
              description="Remember successful patterns, brand preferences and previous recommendations."
            />

            <FeatureCard
              icon={<Lightbulb />}
              title="AI Recommendations"
              description="Turn historical evidence into practical ideas for what to create next."
            />

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-white/[0.06]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/60">
                How it works
              </div>

              <h2 className="mt-3 text-3xl font-semibold">
                Your content gets smarter over time.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-white/30">
                ContentAtlas combines your historical content and performance
                signals with persistent strategic memory to continuously
                improve recommendations.
              </p>

            </div>

            <div className="space-y-4">

              <Step
                number="01"
                title="Analyze"
                description="Understand your existing content and performance."
              />

              <Step
                number="02"
                title="Remember"
                description="Store useful patterns, preferences and strategic learnings."
              />

              <Step
                number="03"
                title="Recommend"
                description="Generate evidence-backed content opportunities."
              />

              <Step
                number="04"
                title="Learn"
                description="Use outcomes to improve future recommendations."
              />

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/[0.06]">

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400">
            <TrendingUp className="h-5 w-5" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold">
            Build your next content strategy with evidence.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/30">
            Explore your content intelligence dashboard and see what your
            history is telling you to create next.
          </p>

          <Link
            href="/dashboard"
            className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Open ContentAtlas
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-6 text-[10px] text-white/20 sm:flex-row">

          <span>
            ContentAtlas · AI Content Strategy Agent
          </span>

          <span>
            Analytics · Memory · Recommendations
          </span>

        </div>

      </footer>

    </main>
  );
}

/* =========================================================
   PREVIEW STAT
========================================================= */

function PreviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="text-[9px] text-white/25">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   PREVIEW BAR
========================================================= */

function PreviewBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-[9px]">

        <span className="text-white/40">
          {label}
        </span>

        <span className="text-white/50">
          {value}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-violet-400/20">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-[11px] leading-5 text-white/30">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   HOW IT WORKS STEP
========================================================= */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-[10px] font-semibold text-violet-300">
        {number}
      </div>

      <div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-5 text-white/30">
          {description}
        </p>

      </div>

    </div>
  );
}