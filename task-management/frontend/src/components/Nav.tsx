import Link from "next/link";
import { cookies } from "next/headers";
import ThemeToggle from "@/components/ThemeToggle";
import { logout } from "@/lib/auth";

export default async function Navbar() {
  const isAuthenticated = Boolean((await cookies()).get("token")?.value);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
          Task Manager
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link href="/tasks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
              Tasks
            </Link>
          )}
          {isAuthenticated ? (
            <form action={logout} className="flex items-center">
              <button
                type="submit"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors cursor-pointer"
              >
                Log out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors">
              Log in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
