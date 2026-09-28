interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

        <p className="mt-4 text-sm text-gray-500">
          {message}
        </p>
      </div>
    </div>
  );
}