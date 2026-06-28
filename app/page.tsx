"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { auth } from "@/lib/firebase"
import { Product } from "@/types/product"

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [allData, setAllData] = useState<Product[]>([]);
  const [fuse, setFuse] = useState<Fuse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        setAllData(data);
        setFuse(new Fuse(data, { keys: ["title", "description"], threshold: 0.3 }));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const results = useMemo<Product[]>(() => {
    const base = !query.trim() || !fuse ? allData : fuse.search(query).map((r) => r.item);

    return base.filter(p =>
      !p.ownedBy?.includes(currentUser?.uid ?? "") &&
      p.sellerId !== currentUser?.uid
    );
  }, [query, fuse, allData, currentUser]);

  if (loading) {
    return <div className="flex justify-center p-10 text-stone-400 font-light tracking-wide">Loading your marketplace...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-8 py-8 sm:py-16">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-14">
        {results.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="group block">
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-slate-600">

              <div className="relative overflow-hidden aspect-[4/3] bg-slate-700">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest bg-slate-900/80 backdrop-blur-sm text-slate-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  {item.category}
                </span>
                <span className="hidden sm:inline absolute bottom-3 right-3 text-xs font-bold text-white bg-cyan-400 text-slate-900 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View →
                </span>
              </div>

              <div className="p-3 sm:p-5">
                <h3 className="font-semibold text-sm sm:text-base text-white leading-snug mb-1 sm:mb-1.5 line-clamp-1 group-hover:text-cyan-400 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="hidden sm:block text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-base sm:text-lg">${item.price}</span>
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">Instant download</span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}