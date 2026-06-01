"use client";

import { useState } from "react";

export default function SubscriptionList({ subscriptions }: { subscriptions: any[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fifteenDaysFromNow = new Date(today);
  fifteenDaysFromNow.setDate(today.getDate() + 15);

  const filteredSubs = subscriptions.filter((sub) => {
    const dateString = typeof sub.nextRenewal === "string" ? sub.nextRenewal.split("T")[0] : sub.nextRenewal;
    const renewalDate = new Date(`${dateString}T00:00:00`);
    
    return renewalDate >= today && renewalDate <= fifteenDaysFromNow;
  });

  return (
    <div>
      <div className="grid gap-3">
        {filteredSubs.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No upcoming subscriptions found.</p>
        ) : (
          filteredSubs.map((sub) => {
            const dateString = typeof sub.nextRenewal === "string" ? sub.nextRenewal.split("T")[0] : sub.nextRenewal;
            const localizedDate = new Date(`${dateString}T00:00:00`);

            return (
              <div key={sub.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Renews: {localizedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">₹{Number(sub.cost).toFixed(2)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}