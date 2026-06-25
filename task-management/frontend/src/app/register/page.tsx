import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Create your account
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <RegisterForm />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 dark:text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
