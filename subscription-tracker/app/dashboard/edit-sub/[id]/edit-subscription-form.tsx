"use client";

import { EditSubscription } from "../../subscriptions/actions";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function EditSubscriptionForm({ subscription }: { subscription: any }) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(EditSubscription, null);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Subscription</h2>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={subscription.id} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Netflix"
                        defaultValue={subscription.name}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Cost ($)</label>
                    <input
                        type="number"
                        name="cost"
                        step="0.01"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="15.99"
                        defaultValue={subscription.cost.toFixed(2)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billing Cycle</label>
                    <select
                        name="cycle"
                          defaultValue={subscription.cycle}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                    
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Renewal Date</label>
                    <input
                        type="date"
                        name="nextRenewal"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={subscription.nextRenewal}
                    />
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">
                        {state.success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                    {isPending ? 'Saving...' : 'Edit Subscription'}
                </button>
            </form>
        </div>
    );
}