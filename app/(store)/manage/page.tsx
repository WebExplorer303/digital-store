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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(authClient, (user) => {
      console.log('Auth state:', user?.uid ?? 'NULL - not signed in on client');
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
        console.log('Snapshot docs:', snapshot.docs.length, 'uid:', currentUser.uid);
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

  if (!authReady || loading) {
    return <div className="text-white p-10">Loading your assets...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100">
<div className="max-w-7xl mx-auto p-6 text-slate-100">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
   
    <div>
      <div className="sticky top-6">
        <NewProductForm onSuccess={handleAddProductToList} />
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-400">Your Products</h2>
      {products.length === 0 ? (
        <p className="text-slate-600">No assets listed yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="relative group border border-slate-800 p-4 rounded-xl shadow-sm bg-slate-900 flex flex-col overflow-hidden"
            >
              <img
                src={product.imageUrl || 'https://picsum.photos/600/400'}
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
              />
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono self-start">
                {product.category}
              </span>
              <h3 className="font-bold text-lg mt-2 text-white">{product.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mt-1 flex-grow">{product.summary}</p>
              <p className="text-blue-400 font-extrabold mt-3 mb-2">${product.price}</p>
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => router.push(`/editproduct/${product.id}`)}
                  className="flex-1 bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition shadow-lg"
                >
                  Edit
                </button>
                <DeleteProduct productId={product.id} onDelete={handleRemoveFromList} />
              </div>
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
        <div className="flex flex-col gap-4">
          {ownedProducts.map((product: any) => (
            <div
              key={product.id}
              className="relative border border-slate-800 p-4 rounded-xl shadow-sm bg-slate-900 flex flex-col overflow-hidden"
            >
              <img
                src={product.imageUrl || 'https://picsum.photos/600/400'}
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
              />
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono self-start">
                {product.category}
              </span>
              <h3 className="font-bold text-lg mt-2 text-white">{product.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mt-1 flex-grow">{product.summary}</p>
              <p className="text-blue-400 font-extrabold mt-3 mb-2">${product.price}</p>
              <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="mt-2 w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
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
    </div>
  );
}