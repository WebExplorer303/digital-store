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

            <div className="w-full min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-gray-100 py-10">

                <div className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                    <header className="mb-12">
                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Overview
                        </h1>
                        <p className="text-lg text-neutral-400 mt-3 font-medium">
                            Track your subscription growth and monthly burn rate.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">

                        <div className="group relative bg-neutral-900/60 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 hover:border-blue-500/50 shadow-2xl flex flex-col justify-between min-h-[180px] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                Total Monthly
                            </p>
                            <p className="text-5xl font-black text-blue-500 tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-6">
                                ₹{totalMonthly.toFixed(2)}
                            </p>
                        </div>

                        <div className="group relative bg-neutral-900/60 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 hover:border-green-500/50 shadow-2xl flex flex-col justify-between min-h-[180px] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                Total Yearly
                            </p>
                            <p className="text-5xl font-black text-green-500 tracking-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.2)] mt-6">
                                ₹{totalYearly.toFixed(2)}
                            </p>
                        </div>

                        <div className="group relative bg-neutral-900/60 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 hover:border-purple-500/50 shadow-2xl flex flex-col justify-between min-h-[180px] transition-all duration-300 sm:col-span-2 lg:col-span-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                Active Subs
                            </p>
                            <p className="text-5xl font-black text-purple-500 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.2)] mt-6">
                                {subscriptions.length}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}