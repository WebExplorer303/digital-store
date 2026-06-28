"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
};

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadCart() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart");
        if (res.status === 401) { router.push("/login"); return; }
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        if (!isCancelled) setItems(data.items ?? []);
      } catch {
        if (!isCancelled) setError("Couldn't load your cart. Try refreshing.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadCart();
    return () => { isCancelled = true; };
  }, [router]);

  async function handleRemove(productId: string) {
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch {
      setError("Couldn't remove that item. Try again.");
    } finally {
      setRemovingId(null);
    }
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
        Your cart
      </h1>
      <p className="text-stone-500 text-sm mb-6 sm:mb-8">{items.length} item{items.length !== 1 ? "s" : ""}</p>

      {isLoading && (
        <p className="text-sm text-stone-500">Loading your cart…</p>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}

      {!isLoading && items.length === 0 && !error && (
        <div className="border border-stone-800 bg-stone-900 rounded-2xl p-8 sm:p-10 text-center">
          <p className="text-stone-400 mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-amber-400 hover:underline"
          >
            Browse products →
          </Link>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <>

          <div className="border border-stone-800 bg-stone-900 rounded-2xl overflow-hidden mb-4">
            {items.map((item, i) => (
              <div
                key={item.productId}
                className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 ${i !== 0 ? "border-t border-stone-800" : ""}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-sm sm:text-base">{item.title}</p>
                  <p className="text-amber-400 font-bold text-xs sm:text-sm mt-0.5">${item.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId)}
                  disabled={removingId === item.productId}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                >
                  {removingId === item.productId ? "…" : "✕"}
                </button>
              </div>
            ))}
          </div>


          <div className="border border-stone-800 bg-stone-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mb-1">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-white">${total.toFixed(2)}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="w-full sm:w-auto bg-amber-400 text-stone-950 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-amber-300 transition-colors text-sm sm:text-base"
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}