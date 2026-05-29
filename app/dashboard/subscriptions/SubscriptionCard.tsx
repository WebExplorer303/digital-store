import { Calendar, DollarSign, CreditCard } from "lucide-react";

interface SubscriptionCardProps {
  subscription: {
    name: string;
    cost: number;
    cycle: string;
    nextRenewal: string;
  };
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
            <CreditCard className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">{subscription.name}</h3>
        </div>
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
          {subscription.cycle}
        </span>
      </div>
      
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-900 text-base">₹{subscription.cost.toFixed(2)}</span>
          <span className="text-slate-400 text-xs">/ {subscription.cycle === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Next: {new Date(subscription.nextRenewal).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
