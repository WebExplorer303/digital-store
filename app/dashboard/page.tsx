import path from "path";
import SubscriptionDonut from "./analytics/chart";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/lib/actions";



export default async function DashboardPage() {

    const {userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

  const subscriptions = await getUserSubscriptions(userId);


    const totalMonthly = subscriptions.reduce((acc, sub) => {
        if (sub.cycle === "monthly") {
            return acc + sub.cost;
        }
        else 
        {return acc+ sub.cost / 12;}
        return acc;
    }, 0);
    const totalYearly = totalMonthly * 12;

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-gray-500 mt-2">Track your subscription growth and monthly burn rate.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Monthly</p>
                    <p className="text-2xl font-bold text-blue-600">₹{totalMonthly.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Yearly</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalYearly.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subs</p>
                    <p className="text-2xl font-bold text-purple-600">{subscriptions.length}</p>
                </div>
            </div>
        </div>
    );
}