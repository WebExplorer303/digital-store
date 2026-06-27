import EditSubscriptionForm  from "./edit-subscription-form";
import { prisma } from "@/lib/prisma";


export default async function EditSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const subscription = await prisma.product.findUnique({
            where: { id: id }
        });

        if (!subscription) {
            return <div className="p-10 text-center">Subscription not found.</div>;
        }

        return (
            <div className="max-w-md mx-auto p-6">
                <EditSubscriptionForm subscription={subscription} />
            </div>
        );
    } catch (error) {
        console.error("Database fetch error:", error);
        return <div className="p-10 text-center text-red-500">Error loading subscription. Check console.</div>;
    }
}