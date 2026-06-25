import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Log in
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <LoginForm />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-600 dark:text-brand-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
