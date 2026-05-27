import Link from "next/link";
import { ReactNode } from "react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* 1. On mobile: w-full (full width) 
        2. On desktop (md): w-64 (fixed width sidebar)
      */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header section */}
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Profile</span>
            <ClerkProvider>
              <UserButton userProfileMode="modal" />
            </ClerkProvider>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blue-600">
              <Link href="/dashboard">MicroSaaS Tracker</Link>
            </h2>
          </div>
        </div>

        {/* Navigation links - Now compact on mobile */}
        <nav className="flex md:flex-col p-2 gap-2">
          <Link
            href="/dashboard/subscriptions"
            className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
          >
            Subscriptions
          </Link>
          <Link
            href="/dashboard/analytics"
            className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
          >
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}