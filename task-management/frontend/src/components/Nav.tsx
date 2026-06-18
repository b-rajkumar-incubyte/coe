import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          Task Manager
        </Link>
        <Link href="/tasks" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
          Tasks
        </Link>
      </div>
    </nav>
  );
}