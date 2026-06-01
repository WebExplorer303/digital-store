import Link from "next/link";
import { ReactNode } from "react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">

      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
       <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4">
<div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between">
  

  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
    Profile
  </div>


  <div className="flex items-center">
    <ClerkProvider>
      <UserButton userProfileMode="modal" />
    </ClerkProvider>
  </div>

</div>
</div>
   <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4">
          <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
  <Link href="/dashboard" className="hover:text-white transition-colors duration-200">
    Subscription Tracker
  </Link>
</h2>
          </div>
        </div>

<nav className="flex md:flex-col p-2 gap-2">
  <Link
    href="/dashboard/subscriptions"
    className="px-3 py-2 text-sm text-slate-300 hover:bg-blue-50 hover:text-slate-900 rounded-lg transition-colors"
  >
    Subscriptions
  </Link>
  <Link
    href="/dashboard/analytics"
    className="px-3 py-2 text-sm text-slate-300 hover:bg-blue-50 hover:text-slate-900 rounded-lg transition-colors"
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