"use client";

import { useState, useEffect } from 'react';
import { db, authClient } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import NewProductForm from '@/components/AddProducts';
import DeleteProduct from '@/components/deleteproduct';
import { useRouter } from 'next/navigation'

export default function ProductsDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [ownedProducts, setOwnedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authClient, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!currentUser) {
      setProducts([]);
      setOwnedProducts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeSnapshot = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error('Firestore query error:', error);
        setLoading(false);
      }
    );

    const ownedQ = query(
      collection(db, 'products'),
      where('ownedBy', 'array-contains', currentUser.uid)
    );

    const unsubscribeOwned = onSnapshot(ownedQ, (snapshot) => {
      setOwnedProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeSnapshot();
      unsubscribeOwned();
    };
  }, [authReady, currentUser]);

  const handleRemoveFromList = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProductToList = (newProduct: any) => {
    setProducts((prev) => {
      const alreadyExists = prev.some((p) => p.id === newProduct.id);
      if (alreadyExists) return prev;
      return [{ ...newProduct }, ...prev];
    });
  };

  useEffect(() => {
    if (!openMenuId) return;
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [openMenuId]);

  if (!authReady || loading) {
    return <div className="text-white p-10">Loading your assets...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <div>
          <div className="lg:sticky lg:top-6">
            <NewProductForm onSuccess={handleAddProductToList} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-400">Your Products</h2>
          {products.length === 0 ? (
            <p className="text-slate-600">No assets listed yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="relative border border-slate-800 p-3 sm:p-4 rounded-xl shadow-sm bg-slate-900 flex flex-col overflow-visible"
                >
                  <img
                    src={product.imageUrl || 'https://picsum.photos/600/400'}
                    alt={product.title}
                    className="w-full h-28 sm:h-40 object-cover rounded-lg mb-3 sm:mb-4"
                    onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
                  />

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === product.id ? null : product.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-200 hover:bg-slate-800 transition"
                      aria-label="Product options"
                    >
                      <i className="ti ti-dots-vertical text-lg" aria-hidden="true" />
                    </button>

                    {openMenuId === product.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-10"
                      >
                        <button
                          onClick={() => router.push(`/editproduct/${product.id}`)}
                          className="w-full text-left text-sm px-3 py-2 text-slate-100 hover:bg-slate-700 transition"
                        >
                          Edit
                        </button>
                        <DeleteProduct productId={product.id} onDelete={handleRemoveFromList} />
                      </div>
                    )}
                  </div>

                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono self-start">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-lg mt-2 text-white line-clamp-1">{product.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-1 flex-grow hidden sm:block">{product.summary}</p>
                  <p className="text-blue-400 font-extrabold mt-2 sm:mt-3 mb-1 sm:mb-2 text-sm sm:text-base">${product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-400">Owned Products</h2>
          {ownedProducts.length === 0 ? (
            <p className="text-slate-600">No owned products yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
              {ownedProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="relative border border-slate-800 p-3 sm:p-4 rounded-xl shadow-sm bg-slate-900 flex flex-col overflow-hidden"
                >
                  <img
                    src={product.imageUrl || 'https://picsum.photos/600/400'}
                    alt={product.title}
                    className="w-full h-28 sm:h-40 object-cover rounded-lg mb-3 sm:mb-4"
                    onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
                  />
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono self-start">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-lg mt-2 text-white line-clamp-1">{product.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-1 flex-grow hidden sm:block">{product.summary}</p>
                  <p className="text-blue-400 font-extrabold mt-2 sm:mt-3 mb-1 sm:mb-2 text-sm sm:text-base">${product.price}</p>
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="mt-1 sm:mt-2 w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-700 transition"
                  >
                    View →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}