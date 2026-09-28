"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  message = "Something went wrong while loading the data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-red-400/10 bg-red-500/[0.03]">

      <div className="flex flex-col items-center gap-3 text-center">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10">
          <AlertCircle className="h-5 w-5 text-red-300" />
        </div>

        <p className="max-w-sm text-xs text-white/40">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        )}

      </div>

    </div>
  );
}