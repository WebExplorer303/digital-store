import Link from "next/link";
import { prisma as db } from "@/lib/prisma"; // Use the prisma.ts file as the client
import { getUserSubscriptions } from "@/lib/actions"; // Import the function to get user subscriptions
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


interface Subscription {
    id: string;
    name: string;
    cost: number;
    cycle: string;
    nextRenewal: string;
}

export default async function SubscriptionsPage() {
        const {userId } = await auth();
    
        if (!userId) {
            redirect("/sign-in");
        }
const subscriptions = await getUserSubscriptions(userId);
    return (
        <>
            <div className="max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
                </header>
            </div>

            <table className="min-w-full divide-y divide-gray-300 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Next Renewal</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sub.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${sub.cost.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sub.cycle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sub.nextRenewal}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link href={`/dashboard/subscriptions/edit-sub`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <Link href="/dashboard/add-sub" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                Add Subscription
            </Link>

        </>
    );
}