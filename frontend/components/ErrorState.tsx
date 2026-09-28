interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while loading this data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <span className="text-xl">!</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Unable to load data
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Retry
        </button>
      )}
    </div>
  );
}