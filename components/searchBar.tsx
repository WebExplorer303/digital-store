"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";


export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function updateSearch(next: string) {
    setValue(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) {
      params.set("q", next.trim());
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
<div className="relative w-full max-w-3xl">
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
  <input
    type="text"
    placeholder="Search products..."
    value={value}
    onChange={(e) => updateSearch(e.target.value)}
    className="w-full p-5 pl-14 text-lg text-black bg-white border border-stone-200 rounded-full shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all duration-300 placeholder:text-stone-400 placeholder:font-light"
  />
</div>
  );
}