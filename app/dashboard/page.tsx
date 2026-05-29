import path from "path";
import SubscriptionDonut from "./analytics/chart";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/lib/actions";
import { Overview } from "./overview";
import { checkAndRequestRenewalUpdates } from "./subscriptions/actions";




export default async function DashboardPage() {

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    await checkAndRequestRenewalUpdates(userId);

    const subscriptions = await getUserSubscriptions(userId);


    const totalMonthly = subscriptions.reduce((acc, sub) => {
        if (sub.cycle === "monthly") {
            return acc + sub.cost;
        }
        else { return acc + sub.cost / 12; }
        return acc;
    }, 0);
    const totalYearly = totalMonthly * 12;

return (
  <>

    <div className="w-full min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(30,30,60,0.4),rgba(0,0,0,0))] text-neutral-100 antialiased selection:bg-blue-500/30">
      

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-16">
        

        <header className="mb-12 border-b border-neutral-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-400 mb-4 tracking-wide uppercase">
            ⚡ Live Metrics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-base text-neutral-400 mt-2 font-normal max-w-xl leading-relaxed">
            Track your subscription architecture, aggregate expenditure cycles, and monthly system burn rates.
          </p>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="group relative bg-gradient-to-b from-neutral-900 to-neutral-900/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between h-52 shadow-xl hover:shadow-blue-500/[0.02]">
            <div>
              <div className="w-2 h-2 rounded-full bg-blue-500 mb-4 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                Total Monthly
              </p>
            </div>
            <p className="text-4xl font-semibold text-white tracking-tight font-mono">
              ₹{totalMonthly.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>


          <div className="group relative bg-gradient-to-b from-neutral-900 to-neutral-900/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between h-52 shadow-xl hover:shadow-emerald-500/[0.02]">
            <div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 mb-4 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                Total Yearly
              </p>
            </div>
            <p className="text-4xl font-semibold text-white tracking-tight font-mono">
              ₹{totalYearly.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="group relative bg-gradient-to-b from-neutral-900 to-neutral-900/40 p-8 rounded-2xl border border-neutral-800/80 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between h-52 shadow-xl hover:shadow-purple-500/[0.02]">
            <div>
              <div className="w-2 h-2 rounded-full bg-purple-500 mb-4 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                Active Subs
              </p>
            </div>
            <p className="text-4xl font-semibold text-white tracking-tight font-mono">
              {subscriptions.length} <span className="text-sm font-normal text-neutral-500">units</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  </>
);
}