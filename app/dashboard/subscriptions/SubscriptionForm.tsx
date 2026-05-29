'use client';

import { useActionState } from 'react';
import { addSubscription } from './actions';
import { Loader2, PlusCircle } from 'lucide-react';

export function SubscriptionForm() {
  const [state, action, isPending] = useActionState(addSubscription, null);

  return (
    <form action={action} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Service Name</label>
          <input
            required
            name="name"
            placeholder="e.g. Netflix, ChatGPT"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="cost" className="text-sm font-medium text-slate-700">Monthly Cost (₹)</label>
          <input
            required
            type="number"
            step="0.01"
            name="cost"
            placeholder="0.00"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cycle" className="text-sm font-medium text-slate-700">Billing Cycle</label>
          <select 
            name="cycle" 
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="nextRenewal" className="text-sm font-medium text-slate-700">Next Renewal Date</label>
          <input
            required
            type="date"
            name="nextRenewal"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1">
          {state.success}
        </div>
      )}

      <button
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
        Add Subscription
      </button>
    </form>
  );
}
