"use client";

export default function LoadingState({
  message = "Loading strategy data...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      <div className="flex flex-col items-center gap-3">

        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

        <p className="text-xs text-white/40">
          {message}
        </p>

      </div>
    </div>
  );
}