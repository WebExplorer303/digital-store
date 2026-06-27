import SubscriptionDonut from "../analytics/chart";
import { prisma } from "../../../lib/prisma";
import { Overview } from "../overview";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/lib/actions";
import SubscriptionList from "../analytics/sublist";



export default async function AnalyticsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }
    const subscriptions = await getUserSubscriptions(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingSubscriptions = await prisma.product.findMany({
        where: {
            userId: userId,
            nextRenewal: { gte: today.toISOString() },
        },
        orderBy: {
            nextRenewal: "asc",
        },
    });

    return (
        <>
            <Overview />
            <div className="space-y-4 p-6">
                <h2 className="text-xl font-bold">Upcoming Renewals</h2>
                <SubscriptionList subscriptions={upcomingSubscriptions} />
            </div>


            <div className="mt-8">
                <SubscriptionDonut data={subscriptions as any} />
            </div>
        </>
    );
}
