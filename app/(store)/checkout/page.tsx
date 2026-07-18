"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db} from "@/lib/firebase"
import { getDoc , doc, collection, arrayUnion , updateDoc } from "firebase/firestore"
import Link from "next/link";
import { getAuth } from "firebase/auth"
 
type CartItem = {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  id: string;
};
 
export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const [showSuccess, setShowSuccess] = useState(false);

  const fetchCart = async () => {
  const res = await fetch("/api/cart");
  if (res.status === 401) { router.push("/login"); return []; }
  if (!res.ok) throw new Error("Failed to load cart");
  const data = await res.json();
  return data.items ?? [] as CartItem[];
};

  useEffect(() => {
    let isCancelled = false;
 
    async function loadCart() {
      setIsLoading(true);
      try {
          const cartItems = await fetchCart();
        if (!isCancelled) {
          if (cartItems.length === 0) { router.push("/cart"); return; }
          setItems(cartItems);
        }
      } catch {
        if (!isCancelled) setError("Couldn't load your cart. Try refreshing.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
 
    loadCart();
    return () => { isCancelled = true; };
  }, [router]);
 
const handlePlaceOrder = async () => {
  setIsPlacingOrder(true);
  try {
    const res = await fetch("/api/checkout", { method: "POST" });
    if (res.status === 401) { router.push("/login"); return; }
    if (!res.ok) throw new Error("Failed to place order");

    setShowSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } catch {
    setError("Something went wrong placing your order.");
  } finally {
    setIsPlacingOrder(false);
  }
};
 
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0;
  const total = subtotal + tax;
 
  if (isLoading) {
    return (
      <main className="w-full max-w-2xl mx-auto px-6 py-12">
        <p className="text-sm text-stone-500">Loading…</p>
      </main>
    );
  }
 
  return (
    <main className="w-full max-w-2xl mx-auto px-6 py-12 lg:py-16">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-400 transition-colors mb-6"
      >
        ← Back to cart
      </Link>
 
      <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-8">
        Checkout
      </h1>
 
      {error && <p className="text-sm text-red-400 mb-6">{error}</p>}
 
     
      <section className="border border-stone-800 bg-stone-900 rounded-2xl overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-stone-800">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            Your items ({items.length})
          </h2>
        </div>
        <ul className="divide-y divide-stone-800">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 px-6 py-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-stone-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{item.title}</p>
              </div>
              <p className="text-white font-bold shrink-0">${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </section>
 

      <section className="border border-stone-800 bg-stone-900 rounded-2xl p-6">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-4">
          Order summary
        </h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-stone-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-400">
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-4 flex justify-between items-center mb-6">
          <span className="text-white font-bold text-lg">Total</span>
          <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-amber-400 text-stone-950 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? "Placing order…" : "Place order →"}
        </button>
        <p className="text-center text-xs text-stone-600 mt-3">
          🔒 Payments are encrypted and secure
        </p>
      </section>
      {showSuccess && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50">
    <span className="text-2xl">🎉</span>
    <div>
      <p className="font-bold">Purchase Successful!</p>
      <p className="text-sm opacity-80">Redirecting you home...</p>
    </div>
  </div>
)}
    </main>
  );
}