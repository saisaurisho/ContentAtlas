"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    name: "Content History",
    href: "/content",
    icon: "📝",
  },
  {
    name: "AI Chat",
    href: "/chat",
    icon: "💬",
  },
  {
    name: "Memory",
    href: "/memory",
    icon: "🧠",
  },
  {
    name: "Recommendations",
    href: "/recommendations",
    icon: "🎯",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ContentAtlas
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          AI Content Strategy
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">

        {navigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400">
          Memory-Augmented Agent
        </p>
      </div>

    </aside>
  );
}