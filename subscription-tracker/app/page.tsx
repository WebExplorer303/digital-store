import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Welcome to Online Subscription Tracker!
      </h1>
      <p className="text-lg mb-8 max-w-2xl text-center">
        Effortlessly manage and track your subscriptions and recurring expenses.
        Gain clear insights into your spending, never miss a renewal, and take control of your financial health.
      </p>
      <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300">
        Get Started
      </Link>
    </div>
  );
}
