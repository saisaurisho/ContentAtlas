interface TopicCardProps {
  title: string;
  topics: string[];
}

export default function TopicCard({
  title,
  topics,
}: TopicCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <div className="mt-4 space-y-3">
        {topics.map((topic) => (
          <div
            key={topic}
            className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
          >
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}