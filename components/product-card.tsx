"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { auth } from "@/lib/firebase"

export default function ProductAside({ product }: { product: Product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isOwned = product.ownedBy?.includes(currentUser?.uid ?? "");

  async function handleAddToCart() {
    setIsAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) throw new Error("Failed to add");
      setAdded(true);
    } catch {
      setError("Couldn't add to cart. Try again.");
    } finally {
      setIsAdding(false);
    }
  }

  useEffect(() => {
    async function checkCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const data = await res.json();
        const inCart = (data.items ?? []).some(
          (item: { productId: string }) => item.productId === product.id
        );
        if (inCart) setAdded(true);
      } catch {}
    }
    checkCart();
  }, [product.id]);

  return (
    <aside className="order-1 lg:order-2 w-full lg:w-[340px]">
      <div className="lg:sticky lg:top-8 border border-stone-800 bg-stone-900 p-4 sm:p-6 rounded-2xl flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-0">
        {product.summary && (
          <p className="text-sm text-stone-300 leading-relaxed border-b border-stone-800 pb-4 sm:pb-5">
            {product.summary}
          </p>
        )}

        <div>
          <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
            Price
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
            ${product.price}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {isOwned ? (
          <button
            disabled
            className="w-full bg-stone-700 text-stone-400 py-2.5 rounded-xl font-bold cursor-not-allowed"
          >
            ✓ Owned
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={added || isAdding}
              className={`flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors border
                ${added
                  ? "bg-stone-800 border-stone-700 text-stone-500 cursor-not-allowed"
                  : "bg-stone-800 border-stone-700 text-white hover:bg-stone-700"
                }`}
            >
              {isAdding ? "Adding…" : added ? "✓ Added" : "Add to cart"}
            </button>

            <button
              type="button"
              onClick={async () => {
                await handleAddToCart();
                router.push("/checkout");
              }}
              className="flex-1 bg-amber-400 text-stone-950 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}

        <p className="text-xs text-stone-500 text-center">
          Instant download after purchase
        </p>
      </div>
    </aside>
  );
}