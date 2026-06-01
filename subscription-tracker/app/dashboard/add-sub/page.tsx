import AddSubscriptionForm from "./add-subscription-form";

export default function AddSubscriptionPage() {
    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Subscription</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Enter the details of your new subscription below.</p>
            <AddSubscriptionForm />
        </div>
    );
}


    